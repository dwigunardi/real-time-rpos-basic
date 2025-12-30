import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt } from '@/lib/crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pageParam = searchParams.get('page') ?? '1';
  const limitParam = searchParams.get('limit') ?? '10';
  const q = (searchParams.get('q') ?? '').trim();

  const page = Number(pageParam);
  const limit = Number(limitParam);

  // Validasi numeric & > 0
  if (!Number.isFinite(page) || !Number.isFinite(limit) || page < 1 || limit < 1) {
    return NextResponse.json(
      { message: 'page and limit must be positive numbers' },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 },
    );
  }

  // Step 1: total count (untuk pagination)
  let baseQuery = supabase.from('profiles').select('*', { count: 'exact', head: false });

  if (q) {
    // contoh simple search (sesuaikan field)
    baseQuery = baseQuery.ilike('name', `%${q}%`);
  }

  // Ambil total count tanpa range dulu
  const { count, error: countError } = await baseQuery.range(0, 0);

  if (countError) {
    return NextResponse.json(
      { message: 'Failed to count users', error: countError.message },
      { status: 500 },
    );
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

  // Step 2: handle out of range
  if (page > totalPages && total > 0) {
    // Bisa balikin kosong tapi tetap info pagination
    const cipher = encrypt(JSON.stringify({
      data: [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }));

    return NextResponse.json({ cipher });
  }

  // Step 3: query data page yang valid
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let dataQuery = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })
    .range(from, to);

  if (q) {
    dataQuery = dataQuery.ilike('name', `%${q}%`);
  }

  const { data, error } = await dataQuery;

  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch users', error: error.message },
      { status: 500 },
    );
  }

  const cipher = encrypt(
    JSON.stringify({
      data: data ?? [],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }),
  );

  return NextResponse.json({ cipher });
}
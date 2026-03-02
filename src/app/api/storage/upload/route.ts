import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { environment } from '@/configs/environment';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const bucket = formData.get('bucket') as string | null;
  const path = formData.get('path') as string | null;
  const prevPath = formData.get('prevPath') as string | null;

  if (!file || !bucket || !path) {
    return NextResponse.json({ message: 'Missing file/bucket/path' }, { status: 400 });
  }

  const newPath = `${path}/${Date.now()}-${file.name}`;

  if (prevPath) {
    const { error } = await supabase.storage.from(bucket).remove([prevPath]);
    if (error) {
      return NextResponse.json(
        { message: 'Failed to remove old file', error: error.message },
        { status: 500 },
      );
    }
  }

  const { error } = await supabase.storage.from(bucket).upload(newPath, file);
  if (error) {
    return NextResponse.json(
      { message: 'Failed to upload file', error: error.message },
      { status: 500 },
    );
  }

  const url = `${environment.SUPABASE_URL}/storage/v1/object/public/${bucket}/${newPath}`;

  return NextResponse.json({
    status: 'success',
    data: {
      url,
      path: newPath,
    },
  });
}
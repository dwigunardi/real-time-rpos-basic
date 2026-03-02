import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt, encrypt, type EncryptedPayload } from '@/lib/crypto';
import { createUserSchemaForm } from '@/validations/user-schema';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Optional: batasi hanya admin yang boleh create user
  const {
    data: { user: currentUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !currentUser) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 },
    );
  }

  // 1. Ambil body terenkripsi
  const body = (await req.json().catch(() => null)) as {
    cipher?: EncryptedPayload;
  } | null;

  if (!body?.cipher) {
    return NextResponse.json(
      { message: 'Invalid encrypted payload' },
      { status: 400 },
    );
  }

  // 2. Decrypt payload
  let decrypted;
  try {
    const plaintext = decrypt(body.cipher);
    decrypted = JSON.parse(plaintext);
  } catch (e) {
    return NextResponse.json(
      { message: 'Failed to decrypt payload' },
      { status: 400 },
    );
  }

  // 3. Validasi dengan schema yang sama
  const validatedFields = createUserSchemaForm.safeParse(decrypted);

  if (!validatedFields.success) {
    return NextResponse.json(
      {
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { email, password, name, role, avatar_url } = validatedFields.data;

  // 4. Supabase signUp
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        avatar_url
      },
    },
  });

  if (error) {
    return NextResponse.json(
      { message: 'Failed to create user', error: error.message },
      { status: 500 },
    );
  }

  // 5. Response (boleh plain, atau juga dienkripsi lagi)
  const cipher = encrypt(
    JSON.stringify({
      status: 'success',
    }),
  );

  return NextResponse.json({ cipher });
}
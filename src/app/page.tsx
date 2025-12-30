import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Home() {
  const cookiesStore = await cookies();
  const profile = JSON.parse(cookiesStore.get("user_profile")?.value ?? "{}");
  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-4xl font-semibold">Welcome {profile.name}</h1>
      <Link href="/admin">
        <Button variant={'default'} className="bg-cyan-600 text-white cursor-pointer hover:bg-cyan-700">Access Dashboard</Button>
      </Link>
    </div>
  );
}

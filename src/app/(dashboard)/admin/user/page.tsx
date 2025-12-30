import { fetchUsers } from "@/actions/users/get-user-action";
import UserManagementComponent from "@/components/pages/user-management";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table-constants";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const metadata = {
  title: "Kumpul Cafe | User Management",
  description: "Manage users in the admin dashboard",
};

export default async function UserManagementPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, q: '' }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserManagementComponent />
    </HydrationBoundary>
  )
}
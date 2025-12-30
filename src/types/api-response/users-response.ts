export type UserRow = {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
}

export type UsersListResponse = {
  data: UserRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
'use client';

import { UsersListResponse } from "@/types/api-response/users-response";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { fetchUsers } from "@/actions/users/get-user-action";
import { useApiQuery } from "@/lib/api/api-query";
import DataTable from "../common/data-table";
import { USER_TABLE_HEADERS } from "@/constants/user-constants";
import { useMemo } from "react";
import DropDownAction from "../common/dropdown-action";
import { Pencil, Trash2 } from "lucide-react";
import useDataTable from "@/hooks/use-datatable";
import DialogCreateUser from "../common/dialog-create-user";

export default function UserManagementComponent() {
    const { currentPage, currentLimit, currentSearch, handlePageChange, handleLimitChange, handleSearchChange } = useDataTable();
    const { data: users, isLoading, refetch }: { data: UsersListResponse | undefined, isLoading: boolean, refetch: () => void } = useApiQuery(
        ['users', currentPage, currentLimit, currentSearch],
        () => fetchUsers({ page: currentPage, limit: currentLimit, q: currentSearch }),
    )

    const dataSource = users?.data || [];
    const totalPages = users?.pagination.totalPages || 1;
    const filteredData = useMemo(() => {
        return (dataSource || []).map((user, index) => {
            return [
                index + 1,
                user?.id,
                user?.name,
                user?.role,
                <DropDownAction
                    menu={[
                        {
                            label: (
                                <span className="flex item-center gap-2">
                                    <Pencil />
                                    Edit
                                </span>
                            ),
                            variant: 'default',
                            type: 'button',
                            action: () => { },
                        },
                        {
                            label: (
                                <span className="flex item-center gap-2">
                                    <Trash2 className="text-red-400" />
                                    Delete
                                </span>
                            ),
                            type: 'button',
                            variant: 'destructive',
                            action: () => { },
                        },
                    ]}
                />,
            ]
        })
    }, [users])

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
                <h1 className="text-2xl font-bold slide-in-text-bottom">User Management</h1>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search users..."
                        className='transition-colors duration-300 focus:ring-offset-blue-50 focus-visible:ring-2 focus-visible:ring-cyan-600 active:ring-cyan-600'
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Create</Button>
                        </DialogTrigger>
                        <DialogCreateUser refetch={refetch} />
                    </Dialog>
                </div>
            </div>
            <DataTable
                header={USER_TABLE_HEADERS}
                isLoading={isLoading}
                dataSource={filteredData}
                totalPages={totalPages}
                currentPage={currentPage}
                currentLimit={currentLimit}
                onChangePage={handlePageChange}
                onChangeLimit={handleLimitChange}
            />
        </div>
    );
}
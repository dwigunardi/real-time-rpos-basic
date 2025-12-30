import { ReactNode } from "react";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import PaginationDatatable from "./pagination-datatable";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { LIMIT_LIST } from "@/constants/data-table-constants";

export default function DataTable({
    header,
    dataSource,
    isLoading,
    totalPages,
    currentPage,
    currentLimit,
    onChangePage,
    onChangeLimit
}: {
    header: string[]
    dataSource: (string | ReactNode)[][]
    isLoading?: boolean,
    totalPages: number
    currentPage: number
    currentLimit: number
    onChangePage: (page: number) => void
    onChangeLimit: (limit: number) => void
}) {
    return (
        <div className="w-full flex flex-col gap-4">
            <Card className="p-0">
                <Table className="w-full rounded-lg overflow-hidden">
                    <TableHeader className="bg-cyan-600 sticky top-0 z-10">
                        <TableRow className="border-none hover:bg-cyan-600!">
                            {header.map((column) => (
                                <TableHead key={`th-${column}`} className="px-6 py-3 text-white">
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && dataSource?.map((row, rowIndex) => (
                            <TableRow key={`tr-${rowIndex}`} className={`hover:bg-accent/50`}>
                                {row.map((cell, cellIndex) => (
                                    <TableCell key={`td-${rowIndex}-${cellIndex}`} className={`px-6 py-3 capitalize`}>
                                        {cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {dataSource?.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={header.length} className="h-24 slide-in-text-bottom text-center py-6">
                                    No Result data.
                                </TableCell>
                            </TableRow>
                        )}
                        {isLoading && (
                            <TableRow className="hover:bg-muted/50 data-[state=selected]:bg-muted space-y-2">
                                <TableCell colSpan={header.length} className="h-24 text-center">
                                    <div className="flex flex-col gap-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="w-full h-8 bg-gray-300 dark:bg-muted animate-pulse rounded-lg" />
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
            <div className="flex items-center sm:justify-center md:justify-between">
                <div className="flex items-center gap-2">
                    <Label>Limit</Label>
                    <Select value={currentLimit.toString()} onValueChange={(value) => onChangeLimit(Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Limit</SelectLabel>
                                {LIMIT_LIST.map((limit, index) => (
                                    <SelectItem
                                        key={`limit-${index}`}
                                        value={limit.toString()}
                                        onClick={() => onChangeLimit(limit)}
                                    >
                                        {limit}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {totalPages && totalPages > 1 && (
                    <div className="flex justify-end">
                        <PaginationDatatable
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onChangePage={onChangePage}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
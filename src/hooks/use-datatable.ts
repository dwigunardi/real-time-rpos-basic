import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table-constants";
import { useState } from "react";
import useDebounce from "./use-debounce";

export default function useDataTable() {
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);
    const [currentSearch, setCurrentSearch] = useState('');
    const debouncedSearch = useDebounce();

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleLimitChange = (limit: number) => {
        setCurrentLimit(limit);
        setCurrentPage(DEFAULT_PAGE);
    }

    const handleSearchChange = (search: string) => {
        return debouncedSearch(() => {
            setCurrentSearch(search);
            setCurrentPage(DEFAULT_PAGE);
        }, 500);
    }

    return {
        currentPage,
        handlePageChange,
        currentLimit,
        handleLimitChange,
        currentSearch,
        handleSearchChange
    }
}
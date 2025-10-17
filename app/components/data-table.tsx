"use client"

import {useState} from "react"
import {
    type ColumnDef, 
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type RowData,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"

import { ArrowUpDown, ChevronDown, MoreHorizontal, Radio } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../components/ui/table"
import type { Players } from '~/types'
export const columns: ColumnDef<Players>[] = [

    {
        accessorKey: "total_points",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Points
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
        },
        {
        accessorKey: "team",
        header: "team",
    },

    {
        accessorKey: "player_name",
        header: "Player name",
    }
]

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<Players, TValue>[]
    data: Players[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 21, //default page size
      });

function multiColumnFilter<TData extends Players & RowData>(
  row: { original: TData },
  columnId: string,
  filterValue: string
) {
  const search = filterValue.toLowerCase();
  return (
    row.original.player_name.toLowerCase().includes(search) ||
    row.original.team.toLowerCase().includes(search)
  );
}


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: multiColumnFilter,
        onPaginationChange: setPagination,
        rowCount: 20,
        state: {
            sorting,
            globalFilter: globalFilter,
        }
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search Player Name"
                    value={globalFilter
                        // (table.getColumn("player_name")?.getFilterValue() as string ?? "")
                    }
                    onChange={(event) => {
                        setGlobalFilter(event.target.value);
                        // table.getColumn("player_name")?.setFilterValue(event.target.value) 
                    }
                    }
                    className="max-w-sm"
                    />
            </div>
        <div className="gameweek-table">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                        ? null 
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )
                                    
                                    }
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows?.length 
                    ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            >

                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))
                                }
                            </TableRow>
                        ))
                    )
                    : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )
                
                }
                </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
        </div>
    )
}
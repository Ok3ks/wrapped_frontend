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

// Custom cell renderer
function Cell({ cell }: { cell: any }) {
    const style = cell.column.columnDef.meta?.style ?? {};
    return <div style={{ padding: '8px', ...style }}>{cell.getValue()}</div>;
  }
  
  // Custom header renderer applying sticky styles if present
function Header({ header }: { header: any }) {
    const style = header.column.columnDef.meta?.style ?? {};
    return (
      <div style={{ fontWeight: 'bold', padding: '8px', backgroundColor: '#ddd', ...style }}>
        {header.isPlaceholder ? null : header.column.columnDef.header}
      </div>
    );
  }
export const columns: ColumnDef<Players>[] = [

    {
        accessorKey: "player_name",
        // header: "Player name",
        cell: Cell,
        header: Header,
        meta: {
            style: {
              position: 'sticky',
              left: 0,
              background: 'white',
              zIndex: 2,
            }
          }
    },
    {
        accessorKey: "minutes",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                minutes
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        
        accessorKey: "total_points",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Total points
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        accessorKey: "team",
        header: "Team",
    },
    {
        accessorKey: "expected_assists",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                xA
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        accessorKey: "expected_goal_involvements",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                xGI
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        accessorKey: "expected_goals",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                xG
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        accessorKey: "expected_goals_conceded",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                xGC
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        accessorKey: "bonus",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Bonus
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        accessorKey: "bps",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Bps
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        accessorKey: "creativity",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Creativity
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            }
    },
    {
        accessorKey: "threat",
        header: ({ column }) => {
            return (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                threat
                <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                )
            },
    },
    {
        accessorKey: "defensive_contribution",
        header: "DC",
    },
    {
        accessorKey: "own_goals",
        header: "Own Goals",
    },
    {
        accessorKey: "penalties_missed",
        header: "Penalties Missed",
    },
    {
        accessorKey: "penalties_saved",
        header: "Penalties Saved",
    },
    {
        accessorKey: "player_name",
        header: "Player Name",
    },
    {
        accessorKey: "position",
        header: "Position",
    },
    {
        accessorKey: "recoveries",
        header: "Recoveries",
    },
    {
        accessorKey: "clean_sheets",
        header: "Clean Sheets",
    },
    {
        accessorKey: "red_cards",
        header: "Red Cards",
    },
    {
        accessorKey: "saves",
        header: "Saves",
    },
    {
        accessorKey: "goals_conceded",
        header: "Goals Conceded",
    },
    {
        accessorKey: "goal_scored",
        header: "Goals Scored",
    },
    {
        accessorKey: "tackles",
        header: "tackles"
    },
   
    {
        accessorKey: "yellow_cards",
        header: "Yellow Cards",
    },
    
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
        pageSize: 5, //default page size
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


    const table = useReactTable<Players>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange:setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: multiColumnFilter,
        onPaginationChange: setPagination,
        rowCount: data.length - 1,
        state: {
            sorting,
            globalFilter: globalFilter,
            pagination: pagination,
            
        }
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search"
                    value={globalFilter
                    }
                    onChange={(event) => {
                        setGlobalFilter(event.target.value);
                    }
                    }
                    className="max-w-sm"
                    />
            </div>
        <div className="gameweek-table">
        <div style={{ overflowX: 'auto', position: 'relative' }}>
        
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
        </div>
        <div className={"pagination flex items-center justify-end space-x-2 py-4"}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    // table.setPageIndex(pagination.pageIndex - 1);
                    setPagination(old => ({ ...old, pageIndex: pagination.pageIndex - 1 }));
                    table.previousPage();
                }
                
                }
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    setPagination(old => ({ ...old, pageIndex: pagination.pageIndex + 1 }));
                    table.nextPage();
                }}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
            {/* <select
                value={pagination.pageSize}
                onChange={e => {
                    setPagination(old => ({ ...old, pageSize: Number(e.target.value) }))}
                }
                className= "py-2 px-4 rounded font-bold transition-colors duration-300"
                >
                {[5, 10, 15].map(size => (
                    <option key={size} value={size}>
                    {size}
                    </option>
                ))}
            </select> */}
        </div>
        </div>
    )
}
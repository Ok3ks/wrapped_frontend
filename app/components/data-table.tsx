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
} from "@tanstack/react-table"

import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../components/ui/button"
import type { Players } from '~/types'
import { TeamChip } from "./top-performers"
import type { TeamFixture } from "./gameweek-tile"

export function buildColumns(teamFixtures: Map<string, TeamFixture>): ColumnDef<Players>[] {
    return [
    {
        accessorKey: "player_name",
        header: "Player",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 min-w-0">
                <span className="truncate">{row.original.player_name}</span>
                <TeamChip team={row.original.team} size="xs" />
            </div>
        ),
    },
    {
        accessorKey: "minutes",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Min <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "total_points",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Pts <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    { accessorKey: "team", header: "Team" },
    {
        id: "score",
        header: "Score",
        cell: ({ row }) => {
            const fixture = teamFixtures.get(row.original.team);
            if (!fixture) return <span className="text-text-secondary">—</span>;
            const { teamGoals, opponentGoals, finished } = fixture;
            const tone = !finished
                ? "text-text-secondary"
                : teamGoals > opponentGoals
                    ? "text-emerald-400"
                    : teamGoals < opponentGoals
                        ? "text-rose-400"
                        : "text-text-secondary";
            return (
                <span className={`font-mono font-semibold whitespace-nowrap ${tone}`}>
                    {teamGoals}–{opponentGoals}
                </span>
            );
        },
    },
    { accessorKey: "goals_scored", header: "GS" },
    { accessorKey: "goals_conceded", header: "GC" },
    { accessorKey: "clean_sheets", header: "CS" },
    { accessorKey: "position", header: "Pos" },
    {
        accessorKey: "expected_assists",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                xA <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "expected_goal_involvements",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                xGI <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "expected_goals",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                xG <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "expected_goals_conceded",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                xGC <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "bonus",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Bonus <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "bps",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                BPS <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "creativity",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Cre <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: "threat",
        header: ({ column }) => (
            <Button variant="ghost" className="text-gold hover:text-gold px-1 h-auto py-1 text-xs"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Thr <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
    },
    { accessorKey: "defensive_contribution", header: "DC" },
    { accessorKey: "own_goals", header: "OG" },
    { accessorKey: "penalties_missed", header: "PM" },
    { accessorKey: "penalties_saved", header: "PS" },
    { accessorKey: "recoveries", header: "Rec" },
    { accessorKey: "red_cards", header: "RC" },
    { accessorKey: "saves", header: "Sav" },
    { accessorKey: "tackles", header: "Tkl" },
    { accessorKey: "yellow_cards", header: "YC" },
    ];
}

export const columns: ColumnDef<Players>[] = buildColumns(new Map());

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<Players, TValue>[]
    data: Players[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'total_points', desc: true }
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 6,
    });
    const [curPosition, setCurPosition] = useState<string>('ALL');
    const positions = ["ALL", "GK", "DEF", "MID", "FWD"];
    const posMap = new Map<string, string>([
        ["GK","Goalkeeper"],
        ["DEF", "Defender"],
        ["MID", "Midfielder"],
        ["FWD", "Forward"],
        ["ALL", ""]
    ])

    function multiColumnFilter<TData extends Players & RowData>(
        row: { original: TData },
        columnId: string,
        filterValue: string
    ) {
        const search = filterValue.toLowerCase();
        return (
            row.original.position.toLowerCase().includes(search) ||
            row.original.player_name.toLowerCase().includes(search) ||
            row.original.team.toLowerCase().includes(search)
        );
    }

    const table = useReactTable<Players>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
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
            globalFilter,
            pagination,
        },
    })

    return (
        <div className="w-full max-w-full overflow-hidden">
            {/* Search + position filters */}
            <div className="flex flex-wrap items-center gap-2 py-3">
                <input
                    placeholder="Search player, team..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 px-3 text-sm font-mono font-normal bg-surface border border-gold-border text-text-primary placeholder:text-text-secondary outline-none focus:border-gold w-full sm:w-48 transition-colors"
                />
                <div className="flex gap-1">
                    {positions.map((position) => (
                        <button
                            key={position}
                            className={`px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider border transition-colors
                                ${curPosition === position
                                    ? "bg-gold text-surface border-gold"
                                    : "bg-transparent text-text-secondary border-gold-border hover:text-text-primary hover:border-gold"
                                }`}
                            onClick={() => {
                                setCurPosition(position);
                                setGlobalFilter(posMap.get(position) ?? "")
                            }}
                        >
                            {position}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table with styled scrollbar */}
            <div className="data-table-scroll border border-gold-border">
                <table className="w-full text-sm">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b-2 border-gold-border bg-surface">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="h-9 px-2 text-left align-middle text-xs font-mono font-semibold uppercase tracking-wider text-gold whitespace-nowrap"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="font-body font-normal text-xs">
                        {table.getRowModel().rows?.length
                            ? table.getRowModel().rows.map((row, i) => (
                                <tr
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={`border-b border-gold-subtle transition-colors hover:bg-gold-subtle
                                        ${i % 2 === 0 ? "bg-surface" : "bg-surface-2"}`}
                                >
                                    {row.getVisibleCells().map((cell, ci) => (
                                        <td
                                            key={cell.id}
                                            className={`px-2 py-2 align-middle whitespace-nowrap
                                                ${ci === 0 ? "text-text-primary font-medium" : "text-text-secondary"}`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                            : (
                                <tr>
                                    <td colSpan={columns.length} className="h-16 text-center text-text-secondary">
                                        No results.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-3 text-xs text-text-secondary">
                <span>
                    Page {pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        className="flex items-center gap-1 px-2.5 py-1.5 font-mono font-medium border border-gold-border text-text-secondary hover:text-text-primary hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        onClick={() => {
                            setPagination(old => ({ ...old, pageIndex: old.pageIndex - 1 }));
                            table.previousPage();
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    <button
                        className="flex items-center gap-1 px-2.5 py-1.5 font-mono font-medium border border-gold-border text-text-secondary hover:text-text-primary hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        onClick={() => {
                            setPagination(old => ({ ...old, pageIndex: old.pageIndex + 1 }));
                            table.nextPage();
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

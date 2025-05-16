"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Label } from "../components/ui/label"
import { CustomDateRangePicker } from "../components/custom-date-range-picker"

interface DateRange {
  from?: Date
  to?: Date
}

interface FilterControlsProps {
  onApplyFilters: (filters: any) => void
}

export function FilterControls({ onApplyFilters }: FilterControlsProps) {
  const [dateRange, setDateRange] = useState<DateRange>({})
  const [category, setCategory] = useState<string>("all")

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range)
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      dateRange,
      category,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="date-range">Date Range</Label>
            <CustomDateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleApplyFilters} className="mt-2">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

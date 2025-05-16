// "use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import BarChart from "../components/bar-chart"
import LineChart from "../components/line-chart"
import PieChart from "../components/pie-chart"
import AreaChart from "../components/area-chart"
import ScatterPlot from "../components/scatter-plot"
import RadarChart from "../components/radar-chart"
import {
  generateBarData,
  generateLineData,
  generatePieData,
  generateAreaData,
  generateScatterData,
  generateRadarData,
} from "../lib/data"

export default function Home() {
  const [barData, setBarData] = useState(generateBarData())
  const [lineData, setLineData] = useState(generateLineData())
  const [pieData, setPieData] = useState(generatePieData())
  const [areaData, setAreaData] = useState(generateAreaData())
  const [scatterData, setScatterData] = useState(generateScatterData())
  const [radarData, setRadarData] = useState(generateRadarData())

  const refreshAllData = () => {
    setBarData(generateBarData())
    setLineData(generateLineData())
    setPieData(generatePieData())
    setAreaData(generateAreaData())
    setScatterData(generateScatterData())
    setRadarData(generateRadarData())
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">D3.js Visualization Dashboard</h1>
            <p className="text-muted-foreground">Interactive data visualizations using D3.js and React</p>
          </div>
          <Button onClick={refreshAllData}>Refresh All Data</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <Card className="col-span-1 md:col-span-1 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>Monthly sales data for the current year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <BarChart data={barData} />
              </div>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="col-span-1 md:col-span-1 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Stock Price Trends</CardTitle>
              <CardDescription>Daily stock price over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <LineChart data={lineData} />
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="col-span-1 md:col-span-1 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Distribution of revenue across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <PieChart data={pieData} />
              </div>
            </CardContent>
          </Card>

          {/* Area Chart */}
          <Card className="col-span-1 md:col-span-1 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>Daily website visitors over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <AreaChart data={areaData} />
              </div>
            </CardContent>
          </Card>

          {/* Scatter Plot */}
          <Card className="col-span-1 md:col-span-1 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Product Analysis</CardTitle>
              <CardDescription>Relationship between price and customer rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ScatterPlot data={scatterData} />
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="col-span-1 md:col-span-1 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Skill Assessment</CardTitle>
              <CardDescription>Team member skills across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <RadarChart data={radarData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

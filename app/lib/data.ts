// Bar Chart Data
export interface BarDataItem {
  name: string
  value: number
}

export function generateBarData(): BarDataItem[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month) => ({
    name: month,
    value: Math.floor(Math.random() * 10000) + 1000,
  }))
}

// Line Chart Data
export interface LineDataItem {
  date: string
  value: number
}

export function generateLineData(): LineDataItem[] {
  const data: LineDataItem[] = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - 30)

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(baseDate)
    currentDate.setDate(currentDate.getDate() + i)

    data.push({
      date: currentDate.toISOString().split("T")[0],
      value: Math.floor(Math.random() * 500) + 100,
    })
  }

  return data
}

// Pie Chart Data
export interface PieDataItem {
  name: string
  value: number
}

export function generatePieData(): PieDataItem[] {
  const categories = ["Electronics", "Clothing", "Food", "Books", "Home", "Sports"]
  return categories.map((category) => ({
    name: category,
    value: Math.floor(Math.random() * 5000) + 1000,
  }))
}

// Area Chart Data
export interface AreaDataItem {
  date: string
  value: number
}

export function generateAreaData(): AreaDataItem[] {
  const data: AreaDataItem[] = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - 14)

  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(baseDate)
    currentDate.setDate(currentDate.getDate() + i)

    data.push({
      date: currentDate.toISOString().split("T")[0],
      value: Math.floor(Math.random() * 2000) + 500,
    })
  }

  return data
}

// Scatter Plot Data
export interface ScatterDataItem {
  x: number // price
  y: number // rating
  size: number // sales volume
  name: string // product name
}

export function generateScatterData(): ScatterDataItem[] {
  const productNames = [
    "Laptop",
    "Phone",
    "Tablet",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headphones",
    "Speaker",
    "Camera",
    "Printer",
    "Watch",
    "TV",
    "Console",
    "Router",
    "Hard Drive",
    "SSD",
    "RAM",
    "CPU",
    "GPU",
    "Microphone",
  ]

  return productNames.map((name) => ({
    name,
    x: Math.floor(Math.random() * 1000) + 100, // price between 100-1100
    y: Math.random() * 4 + 1, // rating between 1-5
    size: Math.floor(Math.random() * 100) + 10, // sales volume
  }))
}

// Radar Chart Data
export interface RadarDataItem {
  axis: string
  value: number
}

export interface RadarChartData {
  name: string
  data: RadarDataItem[]
}

export function generateRadarData(): RadarChartData[] {
  const skills = ["Technical", "Communication", "Teamwork", "Problem Solving", "Leadership", "Creativity"]

  const teamMembers = ["Alice", "Bob", "Charlie", "Diana"]

  return teamMembers.map((member) => ({
    name: member,
    data: skills.map((skill) => ({
      axis: skill,
      value: Math.floor(Math.random() * 80) + 20, // skill level between 20-100
    })),
  }))
}

export type DataItem = BarDataItem | LineDataItem | PieDataItem | AreaDataItem | ScatterDataItem

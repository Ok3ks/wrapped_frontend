"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import type { AreaDataItem } from "../lib/data"

interface AreaChartProps {
  data: AreaDataItem[]
}

export default function AreaChart({ data }: AreaChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    // Create SVG
    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d")
    const formattedData = data.map((d) => ({
      date: parseDate(d.date) as Date,
      value: d.value,
    }))

    // Create scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(formattedData, (d) => d.date) as [Date, Date])
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([0, (d3.max(formattedData, (d) => d.value) as number) * 1.1])
      .nice()
      .range([height, 0])

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat(d3.timeFormat("%b %d") as any),
      )
      .selectAll("text")
      .attr("font-size", "12px")

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y)).selectAll("text").attr("font-size", "12px")

    // Add Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Visitors")
      .attr("font-size", "14px")

    // Create tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("transition", "opacity 0.2s")

    // Add gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.8)

    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0)

    // Add the area
    const area = d3
      .area<{ date: Date; value: number }>()
      .x((d) => x(d.date))
      .y0(height)
      .y1((d) => y(d.value))
      .curve(d3.curveCardinal)

    // Add a path for the area
    svg
      .append("path")
      .datum(formattedData)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area)
      .attr("opacity", 0)
      .transition()
      .duration(1500)
      .attr("opacity", 1)

    // Add the line
    const line = d3
      .line<{ date: Date; value: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveCardinal)

    // Add a path for the line
    const path = svg
      .append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", line)

    // Animate the line
    const pathLength = path.node()?.getTotalLength() || 0
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1500)
      .attr("stroke-dashoffset", 0)

    // Add dots
    const dots = svg
      .selectAll(".dot")
      .data(formattedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", "#3b82f6")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)

    // Animate dots
    dots
      .transition()
      .delay((_, i) => i * 100 + 500)
      .duration(300)
      .attr("r", 5)

    // Add hover effects
    dots
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8).attr("fill", "#1d4ed8")

        const formatDate = d3.timeFormat("%B %d, %Y")
        tooltip
          .style("opacity", 1)
          .html(`<strong>${formatDate(d.date)}</strong><br>${d.value.toLocaleString()} visitors`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 5).attr("fill", "#3b82f6")
        tooltip.style("opacity", 0)
      })
      .on("mousemove", (event) => {
        tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 28}px`)
      })

    // Clean up
    return () => {
      tooltip.remove()
    }
  }, [data])

  return <svg ref={svgRef} className="w-full h-full" style={{ overflow: "visible" }}></svg>
}

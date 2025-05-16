"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import type { ScatterDataItem } from "../lib/data"

interface ScatterPlotProps {
  data: ScatterDataItem[]
}

export default function ScatterPlot({ data }: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 60 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    // Create SVG
    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    const x = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.x) as number) * 1.1])
      .nice()
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([0, 5.5]) // Rating from 0-5 with some padding
      .nice()
      .range([height, 0])

    const size = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.size) as number, d3.max(data, (d) => d.size) as number])
      .range([5, 20])

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
      .attr("font-size", "12px")

    // Add X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .text("Price ($)")
      .attr("font-size", "14px")

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").attr("font-size", "12px")

    // Add Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Rating (0-5)")
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

    // Add dots
    const dots = svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 0)
      .attr("fill", "#10b981")
      .attr("fill-opacity", 0.7)
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)

    // Animate dots
    dots
      .transition()
      .delay((_, i) => i * 50)
      .duration(500)
      .attr("r", (d) => size(d.size))

    // Add hover effects
    dots
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill-opacity", 1).attr("stroke-width", 2)

        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.name}</strong><br>Price: $${d.x.toLocaleString()}<br>Rating: ${d.y.toFixed(1)}/5<br>Sales: ${d.size}`,
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill-opacity", 0.7).attr("stroke-width", 1.5)
        tooltip.style("opacity", 0)
      })
      .on("mousemove", (event) => {
        tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 28}px`)
      })

    // Add trend line
    if (data.length > 1) {
      // Calculate trend line using linear regression
      const xValues = data.map((d) => d.x)
      const yValues = data.map((d) => d.y)

      // Simple linear regression
      const n = data.length
      const sumX = d3.sum(xValues)
      const sumY = d3.sum(yValues)
      const sumXY = d3.sum(data.map((d, i) => d.x * d.y))
      const sumXX = d3.sum(data.map((d) => d.x * d.x))

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      // Create line function
      const trendLine = d3
        .line<number>()
        .x((d) => d)
        .y((d) => y(slope * d + intercept))

      // Add trend line
      svg
        .append("path")
        .datum([0, d3.max(data, (d) => d.x) as number])
        .attr("fill", "none")
        .attr("stroke", "#10b981")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", trendLine)
        .attr("opacity", 0)
        .transition()
        .delay(1000)
        .duration(500)
        .attr("opacity", 0.7)
    }

    // Clean up
    return () => {
      tooltip.remove()
    }
  }, [data])

  return <svg ref={svgRef} className="w-full h-full" style={{ overflow: "visible" }}></svg>
}

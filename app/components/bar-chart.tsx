"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import type { DataItem } from "../lib/data"

interface BarChartProps {
  data: DataItem[]
}

export default function BarChart({ data }: BarChartProps) {
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

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.2)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .nice()
      .range([height, 0])

    // Create color scale
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .range(["#94a3b8", "#0ea5e9"])

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
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
      .text("Sales ($)")
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

    // Add bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name) as number)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d) => colorScale(d.value))
      .attr("rx", 4)
      // Add animation
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))

    // Add hover effects
    svg
      .selectAll(".bar")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8)
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.name}</strong>: $${d.value.toLocaleString()}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1)
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

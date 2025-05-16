"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import type { RadarChartData } from "../lib/data"

interface RadarChartProps {
  data: RadarChartData[]
}

export default function RadarChart({ data }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set dimensions
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const radius = (Math.min(width, height) / 2) * 0.8

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    // Get all axes (skills)
    const allAxes = data[0].data.map((d) => d.axis)
    const totalAxes = allAxes.length
    const angleSlice = (Math.PI * 2) / totalAxes

    // Create scales
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius])

    // Create color scale
    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.name))
      .range(d3.schemeCategory10)

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

    // Draw circular grid
    const levels = 5
    const gridGroups = svg
      .selectAll(".grid-group")
      .data(d3.range(1, levels + 1).reverse())
      .enter()
      .append("g")
      .attr("class", "grid-group")

    // Draw circular grid lines
    gridGroups
      .append("circle")
      .attr("class", "grid-circle")
      .attr("r", (d) => (radius * d) / levels)
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "4,4")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1)

    // Add labels for grid levels
    gridGroups
      .append("text")
      .attr("class", "level-label")
      .attr("x", 4)
      .attr("y", (d) => (-radius * d) / levels)
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .style("fill", "#666")
      .text((d) => ((d * 100) / levels).toString())
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1)

    // Draw axis lines
    const axes = svg.selectAll(".axis").data(allAxes).enter().append("g").attr("class", "axis")

    axes
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (_, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (_, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1)
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1)

    // Add axis labels
    axes
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (_, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (_, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => d)
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1)

    // Draw radar areas
    data.forEach((d, i) => {
      // Create radar path
      const radarLine = d3
        .lineRadial<{ axis: string; value: number }>()
        .radius((d) => rScale(d.value))
        .angle((_, i) => i * angleSlice)
        .curve(d3.curveLinearClosed)

      // Create radar path points
      const radarPoints = d.data.map((point) => ({
        ...point,
        x: rScale(point.value) * Math.cos(allAxes.indexOf(point.axis) * angleSlice - Math.PI / 2),
        y: rScale(point.value) * Math.sin(allAxes.indexOf(point.axis) * angleSlice - Math.PI / 2),
      }))

      // Add radar area
      svg
        .append("path")
        .datum(d.data)
        .attr("class", "radar-area")
        .attr("d", radarLine as any)
        .attr("fill", color(d.name))
        .attr("fill-opacity", 0)
        .attr("stroke", color(d.name))
        .attr("stroke-width", 2)
        .style("opacity", 0)
        .transition()
        .delay(i * 200)
        .duration(1000)
        .attr("fill-opacity", 0.2)
        .style("opacity", 0.9)

      // Add radar points
      const points = svg
        .selectAll(`.radar-point-${i}`)
        .data(radarPoints)
        .enter()
        .append("circle")
        .attr("class", `radar-point-${i}`)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .attr("fill", color(d.name))
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)

      // Animate points
      points
        .transition()
        .delay(i * 200 + 1000)
        .duration(300)
        .attr("r", 5)

      // Add hover effects
      points
        .on("mouseover", function (event, point) {
          d3.select(this).attr("r", 8).attr("fill-opacity", 1)

          tooltip
            .style("opacity", 1)
            .html(`<strong>${d.name}</strong><br>${point.axis}: ${point.value}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`)
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 5).attr("fill-opacity", 0.8)
          tooltip.style("opacity", 0)
        })
        .on("mousemove", (event) => {
          tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 28}px`)
        })
    })

    // Add legend - Fixed approach
    const legendRectSize = 15
    const legendSpacing = 5
    const legendHeight = legendRectSize + legendSpacing

    // Create legend group
    const legendGroup = svg
      .append("g")
      .attr("class", "legend-group")
      .attr("transform", `translate(${width / 2 - 80}, ${-height / 2 + 20})`)

    // Create individual legend items
    data.forEach((d, i) => {
      // Create a group for each legend item
      const legendItem = legendGroup
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", `translate(0, ${i * legendHeight})`)
        .style("opacity", 0)

      // Add colored rectangle
      legendItem.append("rect").attr("width", legendRectSize).attr("height", legendRectSize).attr("fill", color(d.name))

      // Add text label
      legendItem
        .append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .text(d.name)
        .style("font-size", "12px")

      // Apply transition to the whole item
      legendItem
        .transition()
        .delay(1500 + i * 200)
        .duration(500)
        .style("opacity", 1)
    })

    // Clean up
    return () => {
      tooltip.remove()
    }
  }, [data])

  return <svg ref={svgRef} className="w-full h-full"></svg>
}

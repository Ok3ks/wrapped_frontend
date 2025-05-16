"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import type { PieDataItem } from "../lib/data"

interface PieChartProps {
  data: PieDataItem[]
}

export default function PieChart({ data }: PieChartProps) {
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

    // Create color scale
    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.name))
      .range(d3.schemeCategory10)

    // Create pie generator
    const pie = d3
      .pie<PieDataItem>()
      .value((d) => d.value)
      .sort(null)

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<PieDataItem>>().innerRadius(0).outerRadius(radius)

    // Create outer arc for labels
    const outerArc = d3
      .arc<d3.PieArcDatum<PieDataItem>>()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1)

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

    // Create pie slices
    const slices = svg.selectAll(".slice").data(pie(data)).enter().append("g").attr("class", "slice")

    // Add paths for slices
    slices
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.name))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("opacity", 0.8)
      .transition()
      .duration(1000)
      .attrTween("d", (d) => {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
        return (t) => arc(interpolate(t))
      })

    // Add hover effects
    slices
      .on("mouseover", function (event, d) {
        d3.select(this).select("path").style("opacity", 1).attr("stroke-width", 3)

        const percent = ((d.data.value / d3.sum(data, (d) => d.value)) * 100).toFixed(1)
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.data.name}</strong><br>$${d.data.value.toLocaleString()} (${percent}%)`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
      })
      .on("mouseout", function () {
        d3.select(this).select("path").style("opacity", 0.8).attr("stroke-width", 2)
        tooltip.style("opacity", 0)
      })
      .on("mousemove", (event) => {
        tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 28}px`)
      })

    // Add labels
    const text = svg
      .selectAll(".label")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("dy", ".35em")
      .text((d) => {
        const percent = ((d.data.value / d3.sum(data, (d) => d.value)) * 100).toFixed(0)
        return percent + "%"
      })
      .attr("opacity", 0)

    // Position labels
    text
      .transition()
      .delay((_, i) => 1000 + i * 100)
      .duration(500)
      .attr("opacity", 1)
      .attr("transform", (d) => {
        // For smaller slices, position labels outside
        const pos = outerArc.centroid(d)
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.7 * (midAngle < Math.PI ? 1 : -1)

        // For larger slices, position labels inside
        if (d.endAngle - d.startAngle > 0.5) {
          return `translate(${arc.centroid(d)})`
        }
        return `translate(${pos})`
      })
      .style("text-anchor", (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return midAngle < Math.PI ? "start" : "end"
      })
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "white")

    // Add lines connecting labels to slices for smaller slices
    svg
      .selectAll(".line")
      .data(pie(data))
      .enter()
      .append("polyline")
      .attr("class", "line")
      .attr("points", (d) => {
        if (d.endAngle - d.startAngle > 0.5) return null

        const pos = outerArc.centroid(d)
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.7 * (midAngle < Math.PI ? 1 : -1)
        return [arc.centroid(d), outerArc.centroid(d), pos].join(" ")
      })
      .attr("stroke", "gray")
      .attr("fill", "none")
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .transition()
      .delay((_, i) => 1000 + i * 100)
      .duration(500)
      .attr("opacity", (d) => (d.endAngle - d.startAngle > 0.5 ? 0 : 0.5))

    // Add category labels
    svg
      .selectAll(".category-label")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("class", "category-label")
      .text((d) => d.data.name)
      .attr("transform", (d) => {
        if (d.endAngle - d.startAngle <= 0.5) {
          const pos = outerArc.centroid(d)
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
          pos[0] = radius * 0.9 * (midAngle < Math.PI ? 1 : -1)
          return `translate(${pos})`
        }
        return null
      })
      .style("text-anchor", (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return midAngle < Math.PI ? "start" : "end"
      })
      .style("font-size", "10px")
      .style("opacity", 0)
      .transition()
      .delay((_, i) => 1200 + i * 100)
      .duration(500)
      .style("opacity", (d) => (d.endAngle - d.startAngle > 0.5 ? 0 : 1))

    // Clean up
    return () => {
      tooltip.remove()
    }
  }, [data])

  return <svg ref={svgRef} className="w-full h-full"></svg>
}

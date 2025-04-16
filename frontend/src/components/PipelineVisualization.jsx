import React from "react";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const PipelineChart = ({ data, barHeight = 30, metricType = "count" }) => {
  const ref = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setContainerWidth(width);
    });

    resizeObserver.observe(ref.current.parentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!data || data.length === 0 || !ref.current) return;

    // Clear previous chart
    d3.select(ref.current).selectAll("*").remove();

    const width = containerWidth || ref.current.parentElement.clientWidth;
    const margin = { top: 40, right: 60, bottom: 20, left: isMobile ? 10 : 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = data.length * (barHeight + 20);

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", innerHeight + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Use either count or acv based on metricType
    const valueAccessor = (d) => (metricType === "acv" ? d.acv : d.count);
    const maxValue = d3.max(data, valueAccessor);

    data.forEach((d, i) => {
      const barY = i * (barHeight + 20);
      const barValue = valueAccessor(d);
      const greenWidth = (barValue / maxValue) * (innerWidth / 2);

      // Grey base bar (full width)
      g.append("rect")
        .attr("x", 0)
        .attr("y", barY)
        .attr("width", innerWidth)
        .attr("height", barHeight)
        .attr("fill", "#cacaca");

      // Green bars (centered)
      g.append("rect")
        .attr("x", innerWidth / 2 - greenWidth)
        .attr("y", barY)
        .attr("width", greenWidth)
        .attr("height", barHeight)
        .attr("fill", "#4CAF50");

      g.append("rect")
        .attr("x", innerWidth / 2)
        .attr("y", barY)
        .attr("width", greenWidth)
        .attr("height", barHeight)
        .attr("fill", "#4CAF50");

      // Stage name - position differently for mobile
      if (isMobile) {
        // Inside the bar on left side for mobile
        g.append("text")
          .attr("x", 5)
          .attr("y", barY + barHeight / 2 + 5)
          .attr("text-anchor", "start")
          .attr("font-size", "12px")
          .attr("fill", "white")
          .attr("font-weight", "bold")
          .text(d.label);
      } else {
        // Outside the bar for desktop
        g.append("text")
          .attr("x", -10)
          .attr("y", barY + barHeight / 2 + 5)
          .attr("text-anchor", "end")
          .attr("font-size", "14px")
          .text(d.label);
      }

      // Value inside (count or acv)
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", barY + barHeight / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .text(
          metricType === "acv"
            ? `$${Math.round(d.acv).toLocaleString()}`
            : d.count
        );

      // Conversion rate below bar
      // Only show conversion rate if it's not the last bar
      if (i < data.length - 1) {
        const conversionRate =
          metricType === "acv" ? d.acvConversionRate : d.conversion;
        g.append("text")
          .attr("x", innerWidth / 2)
          .attr("y", barY + barHeight + 15)
          .attr("text-anchor", "middle")
          .attr("font-size", "15px")
          .attr("fill", "black")
          .attr("font-weight", "bold")
          .text(`${conversionRate}%`);
      }

      // Win rate at right
      const winRate = metricType === "acv" ? d.acvWinRate : d.winRate;
      g.append("text")
        .attr("x", innerWidth + 5)
        .attr("y", barY + barHeight / 2 + 5)
        .attr("font-size", "15px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .text(`${winRate}%`);
    });
  }, [data, metricType, isMobile, containerWidth]);

  return (
    <Box sx={{ width: "100%", height: "100%", minHeight: "400px" }}>
      <svg ref={ref} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
};

const PipelineVisualization = ({
  data,
  metricType = "count",
  isLoading,
  error,
}) => {
  if (isLoading) return <Typography>Loading data...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!data || data.length === 0)
    return <Typography>No data available</Typography>;

  const title =
    metricType === "acv"
      ? `Win Rate by ACV: ${data[0]?.acvWinRate}%`
      : `Win Rate by opportunity count: ${data[0]?.winRate}%`;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <PipelineChart data={data} metricType={metricType} />
    </Box>
  );
};

export default PipelineVisualization;

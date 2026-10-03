import type { EChartsOption } from "echarts";
import type { NamedValue } from "@/data/parks";

const tip = {
  backgroundColor: "rgba(6, 12, 24, 0.92)",
  borderColor: "rgba(103, 232, 249, 0.45)",
  textStyle: { color: "#e8f1ff" },
};

const label = { color: "rgba(226, 232, 240, 0.72)", fontSize: 11 };

function animate(): boolean {
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function flowLines(
  hours: string[],
  series: { name: string; data: number[]; color: string }[],
): EChartsOption {
  return {
    color: series.map((item) => item.color),
    tooltip: { trigger: "axis", ...tip },
    legend: { top: 0, textStyle: { color: "#dbeafe" } },
    grid: { left: 12, right: 16, top: 36, bottom: 8, containLabel: true },
    xAxis: { type: "category", data: hours, axisLabel: label, axisLine: { lineStyle: { color: "rgba(148,197,255,0.28)" } } },
    yAxis: {
      type: "value",
      axisLabel: label,
      splitLine: { lineStyle: { color: "rgba(148,197,255,0.12)" } },
    },
    animationDuration: 1100,
    animation: animate(),
    series: series.map((item) => ({
      name: item.name,
      type: "line",
      smooth: true,
      showSymbol: false,
      data: item.data,
      lineStyle: { width: 2, shadowBlur: 12, shadowColor: item.color },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: item.color },
            { offset: 1, color: "rgba(5, 8, 20, 0)" },
          ],
        },
        opacity: 0.22,
      },
    })),
  };
}

export function ring(data: NamedValue[]): EChartsOption {
  return {
    color: ["#67e8f9", "#f5c16c", "#34d399", "#a78bfa", "#fb7185", "#38bdf8"],
    tooltip: { trigger: "item", ...tip },
    legend: { bottom: 0, textStyle: { color: "#dbeafe", fontSize: 11 } },
    animationDuration: 900,
    animation: animate(),
    series: [
      {
        type: "pie",
        radius: ["46%", "68%"],
        center: ["50%", "42%"],
        itemStyle: {
          borderColor: "#07111f",
          borderWidth: 2,
          shadowBlur: 14,
          shadowColor: "rgba(34, 211, 238, 0.35)",
        },
        label: { show: false },
        data,
      },
    ],
  };
}

export function bars(data: NamedValue[], color = "#67e8f9", horizontal = false): EChartsOption {
  const names = data.map((item) => item.name);
  const values = data.map((item) => item.value);
  return {
    tooltip: { trigger: "axis", ...tip },
    grid: { left: 8, right: 18, top: 16, bottom: 8, containLabel: true },
    xAxis: horizontal
      ? { type: "value", axisLabel: label, splitLine: { lineStyle: { color: "rgba(148,197,255,0.12)" } } }
      : { type: "category", data: names, axisLabel: { ...label, interval: 0 } },
    yAxis: horizontal
      ? { type: "category", data: names, axisLabel: label }
      : { type: "value", axisLabel: label, splitLine: { lineStyle: { color: "rgba(148,197,255,0.12)" } } },
    animationDuration: 900,
    animation: animate(),
    series: [
      {
        type: "bar",
        data: values,
        barWidth: 12,
        itemStyle: {
          borderRadius: horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0],
          color,
          shadowBlur: 10,
          shadowColor: color,
        },
      },
    ],
  };
}

export function gauge(value: number, color = "#67e8f9"): EChartsOption {
  return {
    animationDuration: 1000,
    animation: animate(),
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        radius: "92%",
        center: ["50%", "58%"],
        progress: { show: true, width: 12, itemStyle: { color, shadowBlur: 12, shadowColor: color } },
        axisLine: { lineStyle: { width: 12, color: [[1, "rgba(148,197,255,0.16)"]] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        detail: {
          valueAnimation: animate(),
          formatter: "{value}%",
          color: "#f8fbff",
          fontSize: 28,
          offsetCenter: [0, "0%"],
        },
        title: { show: true, offsetCenter: [0, "38%"], color: "rgba(186,230,253,0.8)", fontSize: 12 },
        data: [{ value, name: "出租率" }],
      },
    ],
  };
}

export function radar(data: NamedValue[]): EChartsOption {
  return {
    tooltip: { ...tip },
    animationDuration: 900,
    animation: animate(),
    radar: {
      indicator: data.map((item) => ({ name: item.name, max: 100 })),
      radius: "62%",
      axisName: { color: "#dbeafe" },
      splitLine: { lineStyle: { color: "rgba(148,197,255,0.22)" } },
      splitArea: { areaStyle: { color: ["rgba(103,232,249,0.02)", "rgba(103,232,249,0.07)"] } },
      axisLine: { lineStyle: { color: "rgba(148,197,255,0.25)" } },
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: data.map((item) => item.value),
            name: "在岗质量",
            areaStyle: { color: "rgba(103, 232, 249, 0.28)" },
            lineStyle: { color: "#67e8f9", width: 2 },
            itemStyle: { color: "#f5c16c" },
          },
        ],
      },
    ],
  };
}

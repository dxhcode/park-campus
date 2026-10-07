import type { EChartsOption } from "echarts";
import { screenBarOption, screenChartPalette, screenLineOption, screenPieOption } from "@park/theme";
import type { NamedValue } from "@/data/parks";

function animate(): boolean {
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function flowLines(
  hours: string[],
  series: { name: string; data: number[]; color: string }[],
): EChartsOption {
  const option = screenLineOption(
    hours,
    series.map((item) => ({ name: item.name, data: item.data })),
  );
  return {
    ...option,
    color: series.map((item) => item.color),
    grid: { left: 12, right: 16, top: 36, bottom: 8, containLabel: true },
    animationDuration: 1100,
    animation: animate(),
  } as EChartsOption;
}

export function ring(data: NamedValue[]): EChartsOption {
  const option = screenPieOption(data);
  return {
    ...option,
    animationDuration: 900,
    animation: animate(),
    series: option.series.map((item) => ({
      ...item,
      center: ["50%", "42%"],
      label: { ...item.label, show: false },
    })),
  } as EChartsOption;
}

export function bars(data: NamedValue[], color: string = screenChartPalette[0], horizontal = false): EChartsOption {
  const names = data.map((item) => item.name);
  const option = screenBarOption(names, [{ name: "数值", data: data.map((item) => item.value) }]);
  const framed = {
    ...option,
    color: [color],
    grid: { left: 8, right: 18, top: 16, bottom: 8, containLabel: true },
    animationDuration: 900,
    animation: animate(),
  };
  if (!horizontal) return framed as EChartsOption;
  return {
    ...framed,
    xAxis: {
      type: "value",
      axisLabel: option.yAxis.axisLabel,
      splitLine: option.yAxis.splitLine,
    },
    yAxis: {
      type: "category",
      data: names,
      axisLabel: option.xAxis.axisLabel,
      axisLine: option.xAxis.axisLine,
    },
    series: option.series.map((item) => ({
      ...item,
      itemStyle: { ...item.itemStyle, borderRadius: [0, 8, 8, 0] },
    })),
  } as EChartsOption;
}

export function gauge(value: number, color: string = screenChartPalette[0]): EChartsOption {
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
    tooltip: {
      backgroundColor: "rgba(6, 12, 24, 0.92)",
      borderColor: "rgba(103, 232, 249, 0.45)",
      textStyle: { color: "#e8f1ff" },
    },
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
            lineStyle: { color: screenChartPalette[0], width: 2 },
            itemStyle: { color: screenChartPalette[4] },
          },
        ],
      },
    ],
  };
}

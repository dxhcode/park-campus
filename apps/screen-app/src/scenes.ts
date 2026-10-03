export interface Scene {
  key: string;
  title: string;
  path: string;
  description: string;
  accent: string;
  panels: string[];
}

export const scenes: Scene[] = [
  {
    key: "overview",
    title: "综合态势",
    path: "/overview",
    accent: "#67e8f9",
    description: "空间示意、产业结构、出租率与今日通行负荷。",
    panels: ["在园企业", "今日工单", "实时负荷", "通行人次"],
  },
  {
    key: "property",
    title: "物业运行",
    path: "/property",
    accent: "#38bdf8",
    description: "班组进度、设施在线率和今日遗留事项。",
    panels: ["在岗班组", "设施在线", "巡检进度", "遗留问题"],
  },
  {
    key: "workorders",
    title: "工单态势",
    path: "/workorders",
    accent: "#f5c16c",
    description: "未闭环工单、状态结构和滚动工单墙。",
    panels: ["待派单", "处理中", "今日完工", "超时工单"],
  },
  {
    key: "energy",
    title: "能耗监测",
    path: "/energy",
    accent: "#34d399",
    description: "水电曲线、楼宇用电和异常表计。",
    panels: ["总用电", "总用水", "单位能耗", "异常表计"],
  },
  {
    key: "access",
    title: "通行安防",
    path: "/access",
    accent: "#a78bfa",
    description: "人车分时、闸口流量、点位和访客。",
    panels: ["人行通行", "车辆通行", "访客在园", "点位在线"],
  },
  {
    key: "alerts",
    title: "告警中心",
    path: "/alerts",
    accent: "#fb7185",
    description: "等级、来源和滚动告警墙。",
    panels: ["未确认", "处置中", "今日关闭", "高等级"],
  },
];

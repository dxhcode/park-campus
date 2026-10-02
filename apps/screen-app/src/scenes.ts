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
    description: "园区运行总览入口。地图、指标和事件流将在后续接入。",
    panels: ["在园企业", "今日工单", "实时负荷", "通行人次"],
  },
  {
    key: "property",
    title: "物业运行",
    path: "/property",
    accent: "#38bdf8",
    description: "保洁、设施与值班运行入口。班组画面将在后续接入。",
    panels: ["在岗班组", "设施在线", "巡检进度", "遗留问题"],
  },
  {
    key: "workorders",
    title: "工单态势",
    path: "/workorders",
    accent: "#f5c16c",
    description: "报修从受理到完工的态势入口。工单墙将在后续接入。",
    panels: ["待派单", "处理中", "今日完工", "超时工单"],
  },
  {
    key: "energy",
    title: "能耗监测",
    path: "/energy",
    accent: "#34d399",
    description: "电、水与冷热的分项监测入口。曲线将在后续接入。",
    panels: ["总用电", "总用水", "单位能耗", "异常表计"],
  },
  {
    key: "access",
    title: "通行安防",
    path: "/access",
    accent: "#a78bfa",
    description: "人车通行与视频点位入口。闸机画面将在后续接入。",
    panels: ["人行通行", "车辆通行", "访客在园", "点位在线"],
  },
  {
    key: "alerts",
    title: "告警中心",
    path: "/alerts",
    accent: "#fb7185",
    description: "跨系统告警汇聚入口。告警墙将在后续接入。",
    panels: ["未确认", "处置中", "今日关闭", "高等级"],
  },
];

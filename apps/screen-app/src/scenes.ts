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
    description: "园区运行总览。指标、地图和事件流将在此汇合，当前只保留指挥舱骨架。",
    panels: ["在园企业", "今日工单", "实时负荷", "通行人次"],
  },
  {
    key: "property",
    title: "物业运行",
    path: "/property",
    accent: "#38bdf8",
    description: "保洁、设施与值班运行状态。班组与设备台账尚未接入。",
    panels: ["在岗班组", "设施在线", "巡检进度", "遗留问题"],
  },
  {
    key: "workorders",
    title: "工单态势",
    path: "/workorders",
    accent: "#f5c16c",
    description: "报修从受理到完工的态势墙。工单流为空。",
    panels: ["待派单", "处理中", "今日完工", "超时工单"],
  },
  {
    key: "energy",
    title: "能耗监测",
    path: "/energy",
    accent: "#34d399",
    description: "电、水与冷热的分项监测。曲线与表计留待图表阶段。",
    panels: ["总用电", "总用水", "单位能耗", "异常表计"],
  },
  {
    key: "access",
    title: "通行安防",
    path: "/access",
    accent: "#a78bfa",
    description: "人车通行与视频点位的安防墙。闸机和摄像头未连接。",
    panels: ["人行通行", "车辆通行", "访客在园", "点位在线"],
  },
  {
    key: "alerts",
    title: "告警中心",
    path: "/alerts",
    accent: "#fb7185",
    description: "跨系统告警汇聚与处置。告警通道尚未打开。",
    panels: ["未确认", "处置中", "今日关闭", "高等级"],
  },
];

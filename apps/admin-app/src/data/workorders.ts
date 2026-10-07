export const workorderStatuses = ["待受理", "处理中", "待验收", "已完工", "已关闭"] as const;
export const workorderPriorities = ["紧急", "高", "中", "低"] as const;
export const workorderCategories = [
  "电梯",
  "暖通空调",
  "给排水",
  "供配电",
  "公共照明",
  "门禁通行",
  "弱电网络",
  "停车设施",
  "环境秩序",
  "其他",
] as const;
export const workorderSources = ["企业报修", "巡检发现", "告警转入", "电话报修"] as const;
export const parkBuildings = ["海纳楼", "星河楼", "云启楼", "科创中心", "园区公共区"] as const;
export const parkCompanies = [
  "星澜智造（上海）有限公司",
  "浦江云算科技有限公司",
  "临港生物医药有限公司",
  "瀚海物流（临港）有限公司",
  "青禾设计工作室",
  "东岸半导体有限公司",
  "澜桥咨询有限公司",
  "园区公共",
] as const;
export const assigneeOptions = [
  "电工班·王磊",
  "给排水班·孙凯",
  "暖通班·李婷",
  "弱电班·赵衡",
  "秩序班·马俊",
  "外协·通力电梯",
] as const;

export type WorkorderStatus = (typeof workorderStatuses)[number];
export type WorkorderPriority = (typeof workorderPriorities)[number];

export interface TimelineEvent {
  id: string;
  time: string;
  actor: string;
  action: string;
  note: string;
}

export interface Workorder {
  id: string;
  code: string;
  title: string;
  category: string;
  building: string;
  location: string;
  company: string;
  reporter: string;
  phone: string;
  source: string;
  priority: WorkorderPriority;
  status: WorkorderStatus;
  assignee: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  expectAt: string;
  timeline: TimelineEvent[];
}

export interface WorkorderDraft {
  title: string;
  category: string;
  building: string;
  location: string;
  company: string;
  reporter: string;
  phone: string;
  source: string;
  priority: WorkorderPriority;
  assignee: string;
  description: string;
  expectAt: string;
}

export function statusColor(status: WorkorderStatus) {
  const map: Record<WorkorderStatus, string> = {
    待受理: "orange",
    处理中: "blue",
    待验收: "purple",
    已完工: "green",
    已关闭: "default",
  };
  return map[status];
}

export function priorityColor(priority: WorkorderPriority) {
  const map: Record<WorkorderPriority, string> = {
    紧急: "red",
    高: "volcano",
    中: "gold",
    低: "default",
  };
  return map[priority];
}

function event(id: string, time: string, actor: string, action: string, note: string): TimelineEvent {
  return { id, time, actor, action, note };
}

export function createWorkorderSeed(): Workorder[] {
  return [
    {
      id: "wo-1048",
      code: "BX-202609-1048",
      title: "海纳楼 2 号客梯轿厢运行异响",
      category: "电梯",
      building: "海纳楼",
      location: "2 号客梯（A 座西侧）",
      company: "星澜智造（上海）有限公司",
      reporter: "赵敏",
      phone: "13817642086",
      source: "企业报修",
      priority: "紧急",
      status: "处理中",
      assignee: "外协·通力电梯",
      description:
        "早高峰轿厢经过 11 层至 14 层时有金属摩擦声，偶发平层偏差约 3 厘米。已临时停用该梯，人员改走 1 号客梯。",
      createdAt: "2026-09-28 08:16",
      updatedAt: "2026-09-30 16:40",
      expectAt: "2026-10-02",
      timeline: [
        event("e1", "2026-09-28 08:16", "赵敏", "提交报修", "企业前台来电转工单，要求早高峰前恢复。"),
        event("e2", "2026-09-28 08:31", "周启明", "受理并派单", "转通力维保，先停梯并张贴绕行提示。"),
        event("e3", "2026-09-30 16:40", "外协·通力电梯", "现场检测", "导靴磨损，配件预计 10 月 2 日到场更换。"),
      ],
    },
    {
      id: "wo-1062",
      code: "BX-202610-1062",
      title: "星河楼 12 层东侧公共照明跳闸",
      category: "公共照明",
      building: "星河楼",
      location: "12F 东走廊及电梯厅",
      company: "园区公共",
      reporter: "马俊",
      phone: "13701884521",
      source: "巡检发现",
      priority: "高",
      status: "待受理",
      assignee: "",
      description: "夜巡发现 12 层东侧回路跳闸，应急照明正常。重新合闸后约 4 分钟再次断开，疑似末端短路。",
      createdAt: "2026-10-01 19:42",
      updatedAt: "2026-10-01 19:42",
      expectAt: "2026-10-02",
      timeline: [event("e1", "2026-10-01 19:42", "马俊", "提交报修", "已用警戒带分隔暗区，等待电工班受理。")],
    },
    {
      id: "wo-1063",
      code: "BX-202610-1063",
      title: "云启楼地下车库集水坑高水位",
      category: "给排水",
      building: "云启楼",
      location: "B1 集水坑 2 号",
      company: "园区公共",
      reporter: "何倩",
      phone: "13621880345",
      source: "告警转入",
      priority: "紧急",
      status: "处理中",
      assignee: "给排水班·孙凯",
      description: "液位报警持续 20 分钟，1 号泵空转。地库最东侧车位附近地面已有明水，需尽快抽排并更换浮球。",
      createdAt: "2026-10-01 22:05",
      updatedAt: "2026-10-01 22:28",
      expectAt: "2026-10-02",
      timeline: [
        event("e1", "2026-10-01 22:05", "何倩", "告警转入", "BA 高液位告警，值班室已通知给排水班。"),
        event("e2", "2026-10-01 22:28", "孙凯", "到场处置", "改手动启 2 号泵，水位回落，浮球待更换。"),
      ],
    },
    {
      id: "wo-1055",
      code: "BX-202609-1055",
      title: "科创中心 6 层多联机末端不制冷",
      category: "暖通空调",
      building: "科创中心",
      location: "6F 开放办公区西侧",
      company: "浦江云算科技有限公司",
      reporter: "陈舟",
      phone: "13916227740",
      source: "企业报修",
      priority: "中",
      status: "处理中",
      assignee: "暖通班·李婷",
      description: "下午室温升至 28℃，同一系统东侧正常。企业下午有客户参观，希望优先恢复西侧两台室内机。",
      createdAt: "2026-09-29 11:20",
      updatedAt: "2026-09-29 15:06",
      expectAt: "2026-10-03",
      timeline: [
        event("e1", "2026-09-29 11:20", "陈舟", "提交报修", "行政在企业服务群报修。"),
        event("e2", "2026-09-29 15:06", "李婷", "检测反馈", "室内机过滤网堵塞，电子膨胀阀待复核。"),
      ],
    },
    {
      id: "wo-1041",
      code: "BX-202609-1041",
      title: "海纳楼大厅门禁反复拒识工卡",
      category: "门禁通行",
      building: "海纳楼",
      location: "1F 大厅闸机 2",
      company: "临港生物医药有限公司",
      reporter: "周宁",
      phone: "15821996630",
      source: "企业报修",
      priority: "高",
      status: "待验收",
      assignee: "弱电班·赵衡",
      description: "闸机 2 对部分 M1 卡无反应，员工只能走闸机 1，早高峰排队超过 6 分钟。",
      createdAt: "2026-09-27 09:05",
      updatedAt: "2026-09-29 18:12",
      expectAt: "2026-09-30",
      timeline: [
        event("e1", "2026-09-27 09:05", "周宁", "提交报修", "附早高峰排队照片。"),
        event("e2", "2026-09-27 10:10", "赵衡", "受理并派单", "先打开闸机 3 分担客流。"),
        event("e3", "2026-09-29 18:12", "赵衡", "提交验收", "已更换读头并重写 46 张异常卡，请企业抽测。"),
      ],
    },
    {
      id: "wo-1033",
      code: "BX-202609-1033",
      title: "星河楼 8 层茶水间洗手台渗水",
      category: "给排水",
      building: "星河楼",
      location: "8F 茶水间洗手台",
      company: "青禾设计工作室",
      reporter: "林夏",
      phone: "18601772309",
      source: "企业报修",
      priority: "中",
      status: "已完工",
      assignee: "给排水班·孙凯",
      description: "台下软管接口渗水，已浸湿柜体底板。企业希望下班前处理，避免过夜滴到 7 层。",
      createdAt: "2026-09-25 15:18",
      updatedAt: "2026-09-25 17:46",
      expectAt: "2026-09-25",
      timeline: [
        event("e1", "2026-09-25 15:18", "林夏", "提交报修", "现场已用桶接水。"),
        event("e2", "2026-09-25 16:02", "孙凯", "受理并派单", "当班给排水直接上门。"),
        event("e3", "2026-09-25 17:02", "孙凯", "提交验收", "更换角阀与软管，保洁已擦干柜体。"),
        event("e4", "2026-09-25 17:46", "林夏", "确认完工", "无继续渗漏。"),
      ],
    },
    {
      id: "wo-1058",
      code: "BX-202609-1058",
      title: "云启楼弱电间交换机温度告警",
      category: "弱电网络",
      building: "云启楼",
      location: "5F 弱电间",
      company: "园区公共",
      reporter: "顾清",
      phone: "15002150881",
      source: "告警转入",
      priority: "高",
      status: "处理中",
      assignee: "弱电班·赵衡",
      description: "核心交换机连续 3 次上报 71℃。机柜前进风被纸箱挡住，5 层走廊无线已有丢包。",
      createdAt: "2026-09-30 13:44",
      updatedAt: "2026-09-30 14:20",
      expectAt: "2026-10-01",
      timeline: [
        event("e1", "2026-09-30 13:44", "顾清", "告警转入", "网管平台温度阈值告警。"),
        event("e2", "2026-09-30 14:20", "赵衡", "现场清理", "移走纸箱，温度降至 58℃，继续观察风扇转速。"),
      ],
    },
    {
      id: "wo-1066",
      code: "BX-202610-1066",
      title: "科创中心地库出口道闸不落杆",
      category: "停车设施",
      building: "科创中心",
      location: "地库出口道闸",
      company: "瀚海物流（临港）有限公司",
      reporter: "吴迪",
      phone: "13764559012",
      source: "企业报修",
      priority: "中",
      status: "待受理",
      assignee: "",
      description: "货车出场后栏杆不回落，地感疑似常触发。保安在现场手动落杆，出口只能单车放行。",
      createdAt: "2026-10-02 07:48",
      updatedAt: "2026-10-02 07:48",
      expectAt: "2026-10-02",
      timeline: [event("e1", "2026-10-02 07:48", "吴迪", "提交报修", "早班第一辆厢货出场后复现。")],
    },
    {
      id: "wo-1012",
      code: "BX-202609-1012",
      title: "海纳楼 18 层会议室无线投屏无信号",
      category: "弱电网络",
      building: "海纳楼",
      location: "18F 海棠会议室",
      company: "东岸半导体有限公司",
      reporter: "许澜",
      phone: "13671660028",
      source: "企业报修",
      priority: "低",
      status: "已关闭",
      assignee: "弱电班·赵衡",
      description: "投屏盒子搜索不到。会议已改用有线 HDMI，工单关闭前请恢复无线盒子固件。",
      createdAt: "2026-09-18 14:02",
      updatedAt: "2026-09-19 11:26",
      expectAt: "2026-09-19",
      timeline: [
        event("e1", "2026-09-18 14:02", "许澜", "提交报修", "当天下午内部评审使用。"),
        event("e2", "2026-09-18 16:40", "赵衡", "确认完工", "重刷固件并更换 HDMI 线。"),
        event("e3", "2026-09-19 11:26", "周启明", "关闭工单", "企业确认连续两次投屏正常。"),
      ],
    },
    {
      id: "wo-1020",
      code: "BX-202609-1020",
      title: "星河楼南立面景观灯大面积熄灭",
      category: "公共照明",
      building: "星河楼",
      location: "南立面 3 至 8 层灯槽",
      company: "园区公共",
      reporter: "马俊",
      phone: "13701884521",
      source: "巡检发现",
      priority: "低",
      status: "已完工",
      assignee: "电工班·王磊",
      description: "南立面三段灯槽不亮，不影响道路照明。结合外墙清洗窗口一并更换驱动电源。",
      createdAt: "2026-09-20 20:11",
      updatedAt: "2026-09-23 18:05",
      expectAt: "2026-09-24",
      timeline: [
        event("e1", "2026-09-20 20:11", "马俊", "提交报修", "闭园巡视拍照留档。"),
        event("e2", "2026-09-23 18:05", "王磊", "确认完工", "更换 3 个驱动电源，亮灯试运行正常。"),
      ],
    },
    {
      id: "wo-1059",
      code: "BX-202609-1059",
      title: "云启楼 3 层卫生间地漏堵塞",
      category: "给排水",
      building: "云启楼",
      location: "3F 女卫",
      company: "澜桥咨询有限公司",
      reporter: "苏晚",
      phone: "15902148873",
      source: "企业报修",
      priority: "中",
      status: "待验收",
      assignee: "给排水班·孙凯",
      description: "洗手后地面积水，地漏返味。保洁已放置提示牌。",
      createdAt: "2026-09-30 10:26",
      updatedAt: "2026-09-30 15:18",
      expectAt: "2026-09-30",
      timeline: [
        event("e1", "2026-09-30 10:26", "苏晚", "提交报修", "邻近工位能闻到返味。"),
        event("e2", "2026-09-30 15:18", "孙凯", "提交验收", "疏通主管并补防臭芯，请企业确认无积水。"),
      ],
    },
    {
      id: "wo-1064",
      code: "BX-202610-1064",
      title: "海纳楼卸货平台占用消防通道",
      category: "环境秩序",
      building: "海纳楼",
      location: "西侧卸货平台",
      company: "瀚海物流（临港）有限公司",
      reporter: "马俊",
      phone: "13701884521",
      source: "巡检发现",
      priority: "高",
      status: "处理中",
      assignee: "秩序班·马俊",
      description: "两辆厢货卸货后托盘占住西侧消防通道，宽度不足 1 米。需企业当场清运并补交临时卸货登记。",
      createdAt: "2026-10-01 16:33",
      updatedAt: "2026-10-01 16:50",
      expectAt: "2026-10-01",
      timeline: [
        event("e1", "2026-10-01 16:33", "马俊", "提交报修", "已口头通知司机暂停卸货。"),
        event("e2", "2026-10-01 16:50", "马俊", "现场督促", "托盘移出一半，剩余货等企业仓管签字。"),
      ],
    },
  ];
}

export function isWorkorder(value: unknown): value is Workorder {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Workorder>;
  return (
    typeof item.id === "string" &&
    typeof item.code === "string" &&
    typeof item.title === "string" &&
    typeof item.status === "string" &&
    typeof item.priority === "string" &&
    Array.isArray(item.timeline)
  );
}

export function emptyDraft(): WorkorderDraft {
  return {
    title: "",
    category: "给排水",
    building: "海纳楼",
    location: "",
    company: "园区公共",
    reporter: "",
    phone: "",
    source: "企业报修",
    priority: "中",
    assignee: "",
    description: "",
    expectAt: "",
  };
}

export function draftFrom(item: Workorder): WorkorderDraft {
  return {
    title: item.title,
    category: item.category,
    building: item.building,
    location: item.location,
    company: item.company,
    reporter: item.reporter,
    phone: item.phone,
    source: item.source,
    priority: item.priority,
    assignee: item.assignee,
    description: item.description,
    expectAt: item.expectAt,
  };
}

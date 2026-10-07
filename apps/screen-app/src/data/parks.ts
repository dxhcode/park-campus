import { parks as masterParks, queryChartSeries } from "@park/mock";
import { parkMasterIds, type ParkKey } from "@park/shared";

export interface NamedValue {
  name: string;
  value: number;
}

export interface MapBuilding {
  name: string;
  points: string;
  note: string;
  tone: "ok" | "busy" | "warn";
  x: number;
  y: number;
}

export interface Cockpit {
  key: ParkKey;
  name: string;
  city: string;
  slogan: string;
  hotline: string;
  dutyPhone: string;
  dutyName: string;
  area: string;
  occupancy: number;
  companies: number;
  peopleToday: number;
  vehiclesToday: number;
  powerNow: number;
  waterToday: number;
  intensity: string;
  openOrders: number;
  overtimeOrders: number;
  doneToday: number;
  alertsOpen: number;
  alertsHigh: number;
  closedToday: number;
  receivable: string;
  collected: string;
  overdueBills: number;
  hours: string[];
  powerSeries: number[];
  waterSeries: number[];
  peopleSeries: number[];
  vehicleSeries: number[];
  industries: NamedValue[];
  orderStatus: NamedValue[];
  orderCategories: NamedValue[];
  energySplit: NamedValue[];
  alertLevels: NamedValue[];
  alertSystems: NamedValue[];
  serviceRadar: NamedValue[];
  shifts: { name: string; lead: string; members: number; progress: number; focus: string }[];
  facilities: { name: string; online: number; total: number }[];
  issues: { title: string; team: string; status: string }[];
  orders: { code: string; title: string; place: string; status: string; age: string; level: string }[];
  meters: { name: string; kind: string; building: string; value: string; status: string }[];
  buildingsEnergy: NamedValue[];
  gates: { name: string; people: number; cars: number }[];
  visitors: { name: string; company: string; host: string; status: string }[];
  camerasOnline: number;
  camerasTotal: number;
  alerts: { level: string; title: string; place: string; time: string; status: string }[];
  events: { time: string; text: string }[];
  map: {
    motif: "river" | "plant" | "lab";
    buildings: MapBuilding[];
    pins: { x: number; y: number; label: string }[];
  };
}

export const hours = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];

function wave(seed: number, base: number, amp: number): number[] {
  return hours.map((_, index) => {
    const swing = Math.sin((index + seed) * 0.78) * amp;
    const busy = index > 2 && index < 9 ? amp * 0.42 : 0;
    return Math.round(base + swing + busy);
  });
}

const binjiang: Cockpit = {
  key: "binjiang",
  name: "滨江云栖科创园",
  city: "杭州滨江",
  slogan: "沿江研发楼群，云计算与设计企业集中",
  hotline: "0571-86002218",
  dutyPhone: "13800002186",
  dutyName: "沈予舟",
  area: "18.6 万㎡",
  occupancy: 93,
  companies: 86,
  peopleToday: 6284,
  vehiclesToday: 916,
  powerNow: 864,
  waterToday: 286,
  intensity: "0.31 kWh/㎡",
  openOrders: 11,
  overtimeOrders: 1,
  doneToday: 17,
  alertsOpen: 4,
  alertsHigh: 1,
  closedToday: 9,
  receivable: "¥ 428.6 万",
  collected: "¥ 391.2 万",
  overdueBills: 3,
  hours,
  powerSeries: wave(1, 760, 140),
  waterSeries: wave(2, 24, 7),
  peopleSeries: wave(3, 520, 180),
  vehicleSeries: wave(4, 70, 28),
  industries: [
    { name: "云计算", value: 28 },
    { name: "工业软件", value: 22 },
    { name: "设计服务", value: 16 },
    { name: "半导体", value: 12 },
    { name: "其他", value: 8 },
  ],
  orderStatus: [
    { name: "待派单", value: 3 },
    { name: "处理中", value: 6 },
    { name: "待验收", value: 2 },
    { name: "今日完工", value: 17 },
  ],
  orderCategories: [
    { name: "暖通", value: 4 },
    { name: "弱电", value: 6 },
    { name: "电梯", value: 2 },
    { name: "给排水", value: 3 },
    { name: "保洁", value: 5 },
  ],
  energySplit: [
    { name: "空调", value: 38 },
    { name: "照明", value: 16 },
    { name: "机房", value: 29 },
    { name: "动力", value: 11 },
    { name: "其他", value: 6 },
  ],
  alertLevels: [
    { name: "紧急", value: 1 },
    { name: "重要", value: 2 },
    { name: "提示", value: 6 },
  ],
  alertSystems: [
    { name: "门禁", value: 2 },
    { name: "电梯", value: 1 },
    { name: "消防", value: 1 },
    { name: "能耗", value: 2 },
    { name: "视频", value: 1 },
  ],
  serviceRadar: [
    { name: "保洁", value: 92 },
    { name: "工程", value: 84 },
    { name: "安保", value: 90 },
    { name: "客服", value: 88 },
    { name: "绿化", value: 79 },
  ],
  shifts: [
    { name: "楼宇工程", lead: "沈予舟", members: 8, progress: 76, focus: "云栖塔 B 空调末端" },
    { name: "秩序维护", lead: "周晚宁", members: 12, progress: 84, focus: "南门车行复核" },
    { name: "环境保洁", lead: "马清和", members: 15, progress: 91, focus: "会议中心会后复位" },
    { name: "客服前台", lead: "叶知微", members: 6, progress: 68, focus: "访客证补打" },
  ],
  facilities: [
    { name: "客梯", online: 14, total: 14 },
    { name: "新风机组", online: 22, total: 24 },
    { name: "生活水泵", online: 6, total: 6 },
    { name: "门禁控制器", online: 41, total: 42 },
    { name: "信息发布屏", online: 9, total: 11 },
  ],
  issues: [
    { title: "云栖塔 B 12F 末端噪音", team: "工程", status: "处理中" },
    { title: "南广场导向屏黑屏", team: "弱电", status: "待配件" },
    { title: "会议中心地毯水渍", team: "保洁", status: "已复位" },
    { title: "滨江步道灯具闪烁", team: "工程", status: "待验收" },
  ],
  orders: [
    { code: "BX-260404-018", title: "云栖塔 B 空调异响", place: "云栖塔 B · 12F", status: "处理中", age: "46 分钟", level: "紧急" },
    { code: "BX-260404-016", title: "会议中心投影无信号", place: "会议中心 · 多功能厅", status: "待派单", age: "18 分钟", level: "普通" },
    { code: "BX-260404-011", title: "实验楼茶水间漏水", place: "云谷实验楼 · 3F", status: "待验收", age: "2 小时", level: "重要" },
    { code: "BX-260404-009", title: "配套楼门禁刷卡延迟", place: "滨江配套 · 大堂", status: "处理中", age: "1 小时", level: "普通" },
    { code: "BX-260403-044", title: "塔楼 A 客梯轿厢异味", place: "云栖塔 A · 轿厢", status: "今日完工", age: "昨日", level: "普通" },
  ],
  meters: [
    { name: "A 座总表", kind: "电", building: "云栖塔 A", value: "312 kW", status: "正常" },
    { name: "B 座机房表", kind: "电", building: "云栖塔 B", value: "186 kW", status: "偏高" },
    { name: "实验楼水表", kind: "水", building: "云谷实验楼", value: "4.8 t/h", status: "正常" },
    { name: "配套楼冷量表", kind: "冷", building: "滨江配套", value: "离线", status: "离线" },
  ],
  buildingsEnergy: [
    { name: "云栖塔 A", value: 312 },
    { name: "云栖塔 B", value: 286 },
    { name: "云谷实验楼", value: 154 },
    { name: "滨江配套", value: 78 },
    { name: "会议中心", value: 34 },
  ],
  gates: [
    { name: "南门人行", people: 2140, cars: 0 },
    { name: "南门车行", people: 0, cars: 486 },
    { name: "沿江闸机", people: 1688, cars: 0 },
    { name: "地库入口", people: 0, cars: 430 },
  ],
  visitors: [
    { name: "韩叙", company: "青岚云计算", host: "云栖塔 A", status: "在园" },
    { name: "梁小满", company: "折纸设计", host: "会议中心", status: "待入园" },
    { name: "许承川", company: "岸星半导体", host: "云谷实验楼", status: "在园" },
    { name: "曹见鹿", company: "外部审计", host: "滨江配套", status: "已离园" },
  ],
  camerasOnline: 128,
  camerasTotal: 132,
  alerts: [
    { level: "紧急", title: "云栖塔 B 机房温度 29.4℃", place: "云栖塔 B · B1 机房", time: "14:26", status: "处置中" },
    { level: "重要", title: "南门车行道闸抬杆超时", place: "南门车行", time: "13:58", status: "未确认" },
    { level: "重要", title: "配套楼冷量表通讯中断", place: "滨江配套 · 屋顶", time: "11:12", status: "处置中" },
    { level: "提示", title: "沿江步道两盏庭院灯故障", place: "滨江步道", time: "09:40", status: "未确认" },
    { level: "提示", title: "会议中心人流短时超过阈值", place: "会议中心", time: "09:05", status: "已关闭" },
  ],
  events: [
    { time: "14:26", text: "机房温度告警已派给工程班" },
    { time: "13:40", text: "青岚云计算访客韩叙由南门入园" },
    { time: "11:18", text: "本月物业费再入账 ¥ 26.4 万" },
    { time: "10:02", text: "会议中心多功能厅完成会前检查" },
    { time: "08:36", text: "沿江闸机早高峰通行 960 人次" },
  ],
  map: {
    motif: "river",
    buildings: [
      { name: "云栖塔 A", points: "168,78 300,62 322,214 176,228", note: "出租率 97% · 云计算", tone: "ok", x: 242, y: 146 },
      { name: "云栖塔 B", points: "338,70 478,74 492,220 346,214", note: "机房温度关注", tone: "warn", x: 414, y: 146 },
      { name: "云谷实验楼", points: "188,252 392,244 404,400 176,408", note: "中试与共享实验室", tone: "busy", x: 292, y: 326 },
      { name: "滨江配套", points: "520,128 668,118 684,286 528,298", note: "商业与服务", tone: "ok", x: 600, y: 208 },
      { name: "会议中心", points: "516,322 706,312 716,432 524,440", note: "今日两场路演", tone: "busy", x: 616, y: 376 },
    ],
    pins: [
      { x: 120, y: 430, label: "南门" },
      { x: 90, y: 160, label: "沿江闸机" },
      { x: 430, y: 450, label: "地库" },
    ],
  },
};

const lingang: Cockpit = {
  key: "lingang",
  name: "临港智造产业园",
  city: "上海临港",
  slogan: "厂房、中试与物流仓连片，负荷全天偏高",
  hotline: "021-58006619",
  dutyPhone: "13900006619",
  dutyName: "顾承安",
  area: "32.4 万㎡",
  occupancy: 81,
  companies: 64,
  peopleToday: 4126,
  vehiclesToday: 1488,
  powerNow: 1562,
  waterToday: 640,
  intensity: "0.68 kWh/㎡",
  openOrders: 19,
  overtimeOrders: 4,
  doneToday: 12,
  alertsOpen: 7,
  alertsHigh: 2,
  closedToday: 6,
  receivable: "¥ 516.4 万",
  collected: "¥ 470.8 万",
  overdueBills: 6,
  hours,
  powerSeries: wave(5, 1380, 220),
  waterSeries: wave(6, 52, 14),
  peopleSeries: wave(2, 340, 90),
  vehicleSeries: wave(8, 120, 36),
  industries: [
    { name: "智能制造", value: 26 },
    { name: "汽车电子", value: 14 },
    { name: "物流仓储", value: 11 },
    { name: "新材料", value: 8 },
    { name: "其他", value: 5 },
  ],
  orderStatus: [
    { name: "待派单", value: 5 },
    { name: "处理中", value: 10 },
    { name: "待验收", value: 4 },
    { name: "今日完工", value: 12 },
  ],
  orderCategories: [
    { name: "动力", value: 7 },
    { name: "空压", value: 4 },
    { name: "屋面", value: 3 },
    { name: "消防", value: 3 },
    { name: "门禁", value: 2 },
  ],
  energySplit: [
    { name: "生产动力", value: 54 },
    { name: "空压", value: 18 },
    { name: "空调", value: 14 },
    { name: "照明", value: 8 },
    { name: "其他", value: 6 },
  ],
  alertLevels: [
    { name: "紧急", value: 2 },
    { name: "重要", value: 4 },
    { name: "提示", value: 5 },
  ],
  alertSystems: [
    { name: "能耗", value: 4 },
    { name: "消防", value: 2 },
    { name: "门禁", value: 2 },
    { name: "视频", value: 1 },
    { name: "电梯", value: 1 },
  ],
  serviceRadar: [
    { name: "保洁", value: 74 },
    { name: "工程", value: 81 },
    { name: "安保", value: 86 },
    { name: "客服", value: 70 },
    { name: "绿化", value: 66 },
  ],
  shifts: [
    { name: "动力值班", lead: "顾承安", members: 10, progress: 62, focus: "二厂空压机保压" },
    { name: "厂房工程", lead: "宋泊", members: 9, progress: 71, focus: "一厂屋面漏点" },
    { name: "物流秩序", lead: "倪南星", members: 11, progress: 80, focus: "卸货月台排队" },
    { name: "消防巡查", lead: "江晚白", members: 7, progress: 88, focus: "中试车间烟感" },
  ],
  facilities: [
    { name: "货梯", online: 7, total: 8 },
    { name: "空压机", online: 5, total: 6 },
    { name: "屋顶风机", online: 18, total: 22 },
    { name: "月台门", online: 16, total: 16 },
    { name: "消防泵", online: 4, total: 4 },
  ],
  issues: [
    { title: "智造二厂 3 号空压机卸载频繁", team: "动力", status: "处理中" },
    { title: "物流仓月台 4 排队超过 20 分钟", team: "秩序", status: "跟踪" },
    { title: "一厂屋面天沟渗水", team: "工程", status: "待验收" },
    { title: "中试车间烟感误报两只", team: "消防", status: "已隔离" },
  ],
  orders: [
    { code: "BX-260404-027", title: "二厂空压机排气温度高", place: "智造二厂 · 动力站", status: "处理中", age: "1.5 小时", level: "紧急" },
    { code: "BX-260404-024", title: "一厂东侧天沟渗水", place: "智造一厂 · 屋面", status: "待验收", age: "3 小时", level: "重要" },
    { code: "BX-260404-021", title: "物流仓月台门限位失灵", place: "物流仓 · 月台 4", status: "待派单", age: "26 分钟", level: "普通" },
    { code: "BX-260404-015", title: "中试车间照明回路跳闸", place: "中试车间 · 2 跨", status: "处理中", age: "52 分钟", level: "重要" },
    { code: "BX-260404-008", title: "动力站冷却塔填料破损", place: "动力站", status: "处理中", age: "4 小时", level: "普通" },
  ],
  meters: [
    { name: "一厂动力总表", kind: "电", building: "智造一厂", value: "486 kW", status: "正常" },
    { name: "二厂空压表", kind: "电", building: "智造二厂", value: "392 kW", status: "偏高" },
    { name: "物流仓水表", kind: "水", building: "物流仓", value: "9.2 t/h", status: "正常" },
    { name: "中试车间电表", kind: "电", building: "中试车间", value: "离线", status: "离线" },
  ],
  buildingsEnergy: [
    { name: "智造一厂", value: 486 },
    { name: "智造二厂", value: 522 },
    { name: "中试车间", value: 248 },
    { name: "物流仓", value: 166 },
    { name: "动力站", value: 140 },
  ],
  gates: [
    { name: "西门人行", people: 1560, cars: 0 },
    { name: "货运门", people: 220, cars: 860 },
    { name: "南门车行", people: 80, cars: 410 },
    { name: "员工通道", people: 2266, cars: 0 },
  ],
  visitors: [
    { name: "彭小槐", company: "浦津汽车电子", host: "智造二厂", status: "在园" },
    { name: "罗听澜", company: "设备监理", host: "中试车间", status: "在园" },
    { name: "丁晚来", company: "承运车队", host: "物流仓", status: "待入园" },
    { name: "方既明", company: "园区食堂供应商", host: "动力站", status: "已离园" },
  ],
  camerasOnline: 96,
  camerasTotal: 104,
  alerts: [
    { level: "紧急", title: "二厂空压排气温度 96℃", place: "智造二厂 · 空压站", time: "14:18", status: "处置中" },
    { level: "紧急", title: "中试车间电表离线", place: "中试车间", time: "13:06", status: "未确认" },
    { level: "重要", title: "货运门排队超过阈值", place: "货运门", time: "12:44", status: "处置中" },
    { level: "重要", title: "一厂屋面渗水点扩大", place: "智造一厂", time: "10:22", status: "处置中" },
    { level: "提示", title: "物流仓月台广播断续", place: "物流仓", time: "09:16", status: "未确认" },
  ],
  events: [
    { time: "14:18", text: "空压温度告警，动力班已到场" },
    { time: "12:44", text: "货运门在园货车 36 辆" },
    { time: "11:05", text: "浦津汽车电子补缴能耗 ¥ 18.6 万" },
    { time: "09:48", text: "中试车间开工前消防巡查完成" },
    { time: "08:20", text: "员工通道早高峰 1,120 人次" },
  ],
  map: {
    motif: "plant",
    buildings: [
      { name: "智造一厂", points: "70,78 286,88 298,248 78,236", note: "屋面渗水待验收", tone: "warn", x: 184, y: 162 },
      { name: "智造二厂", points: "324,68 568,80 578,236 332,226", note: "空压负荷偏高", tone: "busy", x: 450, y: 152 },
      { name: "中试车间", points: "86,276 308,286 318,424 96,414", note: "电表离线", tone: "warn", x: 202, y: 350 },
      { name: "物流仓", points: "356,274 630,264 646,430 368,422", note: "月台排队", tone: "busy", x: 500, y: 348 },
      { name: "动力站", points: "652,86 762,98 750,220 642,208", note: "全园动力中枢", tone: "ok", x: 702, y: 154 },
    ],
    pins: [
      { x: 48, y: 250, label: "西门" },
      { x: 700, y: 400, label: "货运门" },
      { x: 400, y: 456, label: "南门" },
    ],
  },
};

const guanggu: Cockpit = {
  key: "guanggu",
  name: "光谷生命科学园",
  city: "武汉光谷",
  slogan: "实验楼环绕公共仪器平台，冷链需持续盯防",
  hotline: "027-87003341",
  dutyPhone: "13700003341",
  dutyName: "江采薇",
  area: "14.2 万㎡",
  occupancy: 88,
  companies: 47,
  peopleToday: 3568,
  vehiclesToday: 542,
  powerNow: 918,
  waterToday: 410,
  intensity: "0.54 kWh/㎡",
  openOrders: 8,
  overtimeOrders: 2,
  doneToday: 9,
  alertsOpen: 5,
  alertsHigh: 2,
  closedToday: 4,
  receivable: "¥ 363.9 万",
  collected: "¥ 301.5 万",
  overdueBills: 4,
  hours,
  powerSeries: wave(3, 820, 110),
  waterSeries: wave(9, 34, 9),
  peopleSeries: wave(1, 280, 70),
  vehicleSeries: wave(6, 42, 16),
  industries: [
    { name: "生物医药", value: 21 },
    { name: "医疗器械", value: 11 },
    { name: "检测服务", value: 8 },
    { name: "合成生物", value: 5 },
    { name: "其他", value: 2 },
  ],
  orderStatus: [
    { name: "待派单", value: 2 },
    { name: "处理中", value: 4 },
    { name: "待验收", value: 2 },
    { name: "今日完工", value: 9 },
  ],
  orderCategories: [
    { name: "冷链", value: 3 },
    { name: "纯水", value: 2 },
    { name: "通风", value: 3 },
    { name: "门禁", value: 2 },
    { name: "电梯", value: 1 },
  ],
  energySplit: [
    { name: "实验通风", value: 33 },
    { name: "冷链", value: 27 },
    { name: "空调", value: 18 },
    { name: "纯水", value: 12 },
    { name: "照明", value: 10 },
  ],
  alertLevels: [
    { name: "紧急", value: 2 },
    { name: "重要", value: 2 },
    { name: "提示", value: 4 },
  ],
  alertSystems: [
    { name: "冷链", value: 3 },
    { name: "门禁", value: 2 },
    { name: "通风", value: 2 },
    { name: "视频", value: 1 },
    { name: "消防", value: 1 },
  ],
  serviceRadar: [
    { name: "保洁", value: 86 },
    { name: "工程", value: 77 },
    { name: "安保", value: 91 },
    { name: "客服", value: 83 },
    { name: "绿化", value: 80 },
  ],
  shifts: [
    { name: "实验后勤", lead: "江采薇", members: 7, progress: 73, focus: "公共仪器平台纯水" },
    { name: "冷链值班", lead: "程拾光", members: 5, progress: 64, focus: "动物房冷库回温" },
    { name: "环境消杀", lead: "温晚晴", members: 9, progress: 90, focus: "实验楼 B 走廊" },
    { name: "门禁审核", lead: "苏见山", members: 4, progress: 82, focus: "外来检测人员" },
  ],
  facilities: [
    { name: "实验新风", online: 16, total: 18 },
    { name: "冷库", online: 5, total: 6 },
    { name: "纯水机组", online: 3, total: 3 },
    { name: "客梯", online: 8, total: 8 },
    { name: "门禁", online: 36, total: 38 },
  ],
  issues: [
    { title: "动物房 2 号冷库回温 0.8℃", team: "冷链", status: "处理中" },
    { title: "公共仪器平台纯水电导波动", team: "后勤", status: "观察" },
    { title: "实验楼 A 风阀卡滞", team: "通风", status: "待配件" },
    { title: "生命科学中心雨棚灯不亮", team: "工程", status: "已完工" },
  ],
  orders: [
    { code: "BX-260404-019", title: "动物房冷库温度回升", place: "动物房 · 2 号冷库", status: "处理中", age: "38 分钟", level: "紧急" },
    { code: "BX-260404-014", title: "仪器平台纯水压力不稳", place: "公共仪器 · 纯水间", status: "处理中", age: "1 小时", level: "重要" },
    { code: "BX-260404-012", title: "实验楼 A 风阀卡滞", place: "实验楼 A · 5F", status: "待派单", age: "22 分钟", level: "普通" },
    { code: "BX-260404-006", title: "实验楼 B 门禁尾随告警", place: "实验楼 B · 门厅", status: "待验收", age: "2 小时", level: "重要" },
    { code: "BX-260403-031", title: "中心雨棚灯具更换", place: "生命科学中心", status: "今日完工", age: "昨日", level: "普通" },
  ],
  meters: [
    { name: "中心总表", kind: "电", building: "生命科学中心", value: "268 kW", status: "正常" },
    { name: "动物房冷链表", kind: "电", building: "动物房", value: "96 kW", status: "偏高" },
    { name: "实验楼 A 水表", kind: "水", building: "实验楼 A", value: "3.1 t/h", status: "正常" },
    { name: "仪器平台冷量表", kind: "冷", building: "公共仪器", value: "波动", status: "异常" },
  ],
  buildingsEnergy: [
    { name: "生命科学中心", value: 268 },
    { name: "实验楼 A", value: 188 },
    { name: "实验楼 B", value: 176 },
    { name: "动物房", value: 142 },
    { name: "公共仪器", value: 144 },
  ],
  gates: [
    { name: "主入口人行", people: 1680, cars: 0 },
    { name: "主入口车行", people: 0, cars: 310 },
    { name: "实验物流口", people: 240, cars: 148 },
    { name: "北门员工", people: 1648, cars: 84 },
  ],
  visitors: [
    { name: "乔晚舟", company: "汉口检测", host: "公共仪器", status: "在园" },
    { name: "阮清池", company: "试剂配送", host: "实验楼 B", status: "待入园" },
    { name: "沈见微", company: "合作医院", host: "生命科学中心", status: "在园" },
    { name: "姚南枝", company: "冷链维保", host: "动物房", status: "在园" },
  ],
  camerasOnline: 84,
  camerasTotal: 88,
  alerts: [
    { level: "紧急", title: "2 号冷库回温至 6.2℃", place: "动物房", time: "14:32", status: "处置中" },
    { level: "紧急", title: "仪器平台冷量波动", place: "公共仪器", time: "13:48", status: "未确认" },
    { level: "重要", title: "实验楼 B 门禁尾随", place: "实验楼 B", time: "12:16", status: "处置中" },
    { level: "重要", title: "实验楼 A 新风阀反馈丢失", place: "实验楼 A", time: "10:54", status: "未确认" },
    { level: "提示", title: "北门访客排队 8 人", place: "北门", time: "09:12", status: "已关闭" },
  ],
  events: [
    { time: "14:32", text: "冷库告警，冷链班程拾光到场" },
    { time: "13:10", text: "汉口检测访客乔晚舟刷卡进入公共仪器" },
    { time: "11:26", text: "实验楼 B 物业费逾期催缴已登记" },
    { time: "09:40", text: "环境消杀完成实验楼 B 走廊" },
    { time: "08:15", text: "主入口早高峰 640 人次" },
  ],
  map: {
    motif: "lab",
    buildings: [
      { name: "生命科学中心", points: "248,64 528,74 548,228 236,218", note: "公共大厅与路演", tone: "ok", x: 390, y: 146 },
      { name: "实验楼 A", points: "72,150 214,142 226,336 80,346", note: "风阀卡滞", tone: "warn", x: 148, y: 244 },
      { name: "实验楼 B", points: "568,146 724,156 714,338 556,328", note: "门禁尾随复核", tone: "busy", x: 640, y: 242 },
      { name: "动物房", points: "176,274 360,284 372,424 186,416", note: "冷库回温", tone: "warn", x: 274, y: 350 },
      { name: "公共仪器", points: "404,286 608,276 618,424 412,432", note: "纯水与冷量", tone: "busy", x: 510, y: 354 },
    ],
    pins: [
      { x: 400, y: 40, label: "主入口" },
      { x: 70, y: 420, label: "北门" },
      { x: 730, y: 400, label: "物流口" },
    ],
  },
};

const cockpits: Record<ParkKey, Cockpit> = {
  binjiang,
  lingang,
  guanggu,
};

function withSharedMaster(cockpit: Cockpit): Cockpit {
  const parkId = parkMasterIds[cockpit.key];
  const master = masterParks.find((item) => item.id === parkId);
  const industry = queryChartSeries({ parkId, metric: "产业" })[0];
  const industries = industry
    ? industry.categories.map((name, index) => ({
        name,
        value: industry.series[0]?.data[index] ?? 0,
      }))
    : cockpit.industries;
  if (!master) return { ...cockpit, industries };
  return {
    ...cockpit,
    name: master.name,
    slogan: master.description,
    hotline: master.phone,
    dutyName: master.manager,
    industries,
  };
}

export function cockpitOf(key: ParkKey): Cockpit {
  return withSharedMaster(cockpits[key]);
}

import { shanghaiToday } from "@park/shared";
import { round2 } from "@/utils/storage";

export const billTypes = ["物业费", "电费", "水费", "空调费", "停车费"] as const;
export const billStatuses = ["待缴费", "部分缴纳", "已缴清", "已逾期"] as const;
export const payMethods = ["对公转账", "微信支付", "支付宝", "现金", "园区预存"] as const;

export type BillType = (typeof billTypes)[number];
export type BillStatus = (typeof billStatuses)[number];
export type PayMethod = (typeof payMethods)[number];

export interface Payment {
  id: string;
  amount: number;
  method: PayMethod;
  payer: string;
  paidAt: string;
  operator: string;
  remark: string;
}

export interface Bill {
  id: string;
  code: string;
  company: string;
  building: string;
  room: string;
  type: BillType;
  period: string;
  amount: number;
  dueDate: string;
  contact: string;
  phone: string;
  remark: string;
  createdAt: string;
  payments: Payment[];
}

export interface BillDraft {
  company: string;
  building: string;
  room: string;
  type: BillType;
  period: string;
  amount: number | null;
  dueDate: string;
  contact: string;
  phone: string;
  remark: string;
}

export function paidOf(bill: Bill) {
  return round2(bill.payments.reduce((sum, item) => sum + item.amount, 0));
}

export function remainOf(bill: Bill) {
  return round2(Math.max(0, bill.amount - paidOf(bill)));
}

export function statusOf(bill: Bill, today = shanghaiToday()): BillStatus {
  const paid = paidOf(bill);
  if (paid >= bill.amount - 0.001) return "已缴清";
  if (bill.dueDate < today) return "已逾期";
  if (paid > 0) return "部分缴纳";
  return "待缴费";
}

export function billStatusColor(status: BillStatus) {
  const map: Record<BillStatus, string> = {
    待缴费: "blue",
    部分缴纳: "gold",
    已缴清: "green",
    已逾期: "red",
  };
  return map[status];
}

function pay(
  id: string,
  amount: number,
  method: PayMethod,
  payer: string,
  paidAt: string,
  operator: string,
  remark: string,
): Payment {
  return { id, amount, method, payer, paidAt, operator, remark };
}

export function createBillSeed(): Bill[] {
  return [
    {
      id: "bill-2201",
      code: "JF-202609-2201",
      company: "星澜智造（上海）有限公司",
      building: "海纳楼",
      room: "A-1208",
      type: "物业费",
      period: "2026-09",
      amount: 18640,
      dueDate: "2026-09-25",
      contact: "赵敏",
      phone: "13817642086",
      remark: "按租赁面积 932㎡、单价 20 元/㎡计。合同约定每月 25 日前到账。",
      createdAt: "2026-09-01 09:00",
      payments: [],
    },
    {
      id: "bill-2202",
      code: "JF-202609-2202",
      company: "星澜智造（上海）有限公司",
      building: "海纳楼",
      room: "A-1208",
      type: "电费",
      period: "2026-09",
      amount: 9320.5,
      dueDate: "2026-10-08",
      contact: "赵敏",
      phone: "13817642086",
      remark: "含办公照明与实验配套空调用电，表号 HN-A1208-E。",
      createdAt: "2026-09-02 09:10",
      payments: [
        pay("pay-1", 5000, "对公转账", "星澜智造（上海）有限公司", "2026-09-20 11:24", "陈予安", "先到账 5,000 元，余款月内结清。"),
      ],
    },
    {
      id: "bill-2203",
      code: "JF-202609-2203",
      company: "浦江云算科技有限公司",
      building: "星河楼",
      room: "B-806",
      type: "物业费",
      period: "2026-09",
      amount: 12480,
      dueDate: "2026-10-12",
      contact: "陈舟",
      phone: "13916227740",
      remark: "办公面积 624㎡。企业申请与电费错峰支付。",
      createdAt: "2026-09-01 09:06",
      payments: [],
    },
    {
      id: "bill-2204",
      code: "JF-202609-2204",
      company: "浦江云算科技有限公司",
      building: "星河楼",
      room: "B-806",
      type: "水费",
      period: "2026-09",
      amount: 860,
      dueDate: "2026-10-08",
      contact: "陈舟",
      phone: "13916227740",
      remark: "茶水间与卫生间分摊，表号 XH-B806-W。",
      createdAt: "2026-09-02 09:18",
      payments: [pay("pay-2", 860, "微信支付", "陈舟", "2026-09-12 16:02", "陈予安", "企业行政扫码缴清。")],
    },
    {
      id: "bill-2205",
      code: "JF-202609-2205",
      company: "临港生物医药有限公司",
      building: "云启楼",
      room: "C-501",
      type: "物业费",
      period: "2026-09",
      amount: 24600,
      dueDate: "2026-10-15",
      contact: "周宁",
      phone: "15821996630",
      remark: "含洁净走廊保洁加价。实验室本体能耗另计。",
      createdAt: "2026-09-01 09:12",
      payments: [],
    },
    {
      id: "bill-2188",
      code: "JF-202608-2188",
      company: "临港生物医药有限公司",
      building: "云启楼",
      room: "C-501",
      type: "空调费",
      period: "2026-08",
      amount: 6780,
      dueDate: "2026-09-20",
      contact: "周宁",
      phone: "15821996630",
      remark: "8 月延长空调至 22:30，按加班空调协议结算。",
      createdAt: "2026-09-03 10:02",
      payments: [],
    },
    {
      id: "bill-2206",
      code: "JF-202609-2206",
      company: "瀚海物流（临港）有限公司",
      building: "科创中心",
      room: "D-102",
      type: "物业费",
      period: "2026-09",
      amount: 9800,
      dueDate: "2026-10-10",
      contact: "吴迪",
      phone: "13764559012",
      remark: "仓储办公连廊 490㎡。",
      createdAt: "2026-09-01 09:20",
      payments: [pay("pay-3", 9800, "对公转账", "瀚海物流（临港）有限公司", "2026-09-08 09:41", "陈予安", "银行回单已核对。")],
    },
    {
      id: "bill-2207",
      code: "JF-202609-2207",
      company: "瀚海物流（临港）有限公司",
      building: "科创中心",
      room: "地下车库固定车位",
      type: "停车费",
      period: "2026-09",
      amount: 2400,
      dueDate: "2026-10-10",
      contact: "吴迪",
      phone: "13764559012",
      remark: "固定月租车位 6 个，单价 400 元。",
      createdAt: "2026-09-01 09:22",
      payments: [pay("pay-4", 1200, "对公转账", "瀚海物流（临港）有限公司", "2026-09-18 14:16", "陈予安", "先付 3 个车位，余下月底前补齐。")],
    },
    {
      id: "bill-2208",
      code: "JF-202609-2208",
      company: "青禾设计工作室",
      building: "星河楼",
      room: "B-305",
      type: "物业费",
      period: "2026-09",
      amount: 5600,
      dueDate: "2026-10-18",
      contact: "林夏",
      phone: "18601772309",
      remark: "小微企业工位套间，含会议室 8 小时额度。",
      createdAt: "2026-09-01 09:30",
      payments: [],
    },
    {
      id: "bill-2209",
      code: "JF-202609-2209",
      company: "东岸半导体有限公司",
      building: "海纳楼",
      room: "A-1801",
      type: "电费",
      period: "2026-09",
      amount: 15220.4,
      dueDate: "2026-10-08",
      contact: "许澜",
      phone: "13671660028",
      remark: "测试间夜间负荷较高，表号 HN-A1801-E。",
      createdAt: "2026-09-02 09:40",
      payments: [],
    },
    {
      id: "bill-2210",
      code: "JF-202609-2210",
      company: "澜桥咨询有限公司",
      building: "云启楼",
      room: "C-210",
      type: "物业费",
      period: "2026-09",
      amount: 4200,
      dueDate: "2026-10-12",
      contact: "苏晚",
      phone: "15902148873",
      remark: "联合办公卡位 12 个。",
      createdAt: "2026-09-01 09:36",
      payments: [pay("pay-5", 4200, "支付宝", "苏晚", "2026-09-06 10:18", "陈予安", "企业主扫码一次付清。")],
    },
    {
      id: "bill-2211",
      code: "JF-202609-2211",
      company: "青禾设计工作室",
      building: "星河楼",
      room: "B-305",
      type: "水费",
      period: "2026-09",
      amount: 310,
      dueDate: "2026-09-28",
      contact: "林夏",
      phone: "18601772309",
      remark: "公摊水量，金额较小，已短信提醒两次。",
      createdAt: "2026-09-02 09:48",
      payments: [],
    },
  ];
}

export function isBill(value: unknown): value is Bill {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Bill>;
  return (
    typeof item.id === "string" &&
    typeof item.code === "string" &&
    typeof item.company === "string" &&
    typeof item.amount === "number" &&
    typeof item.dueDate === "string" &&
    Array.isArray(item.payments)
  );
}

export function emptyBillDraft(): BillDraft {
  return {
    company: "星澜智造（上海）有限公司",
    building: "海纳楼",
    room: "",
    type: "物业费",
    period: "2026-10",
    amount: null,
    dueDate: "",
    contact: "",
    phone: "",
    remark: "",
  };
}

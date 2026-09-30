import type { Component } from "vue";
import {
  BankOutlined,
  DashboardOutlined,
  IdcardOutlined,
  NotificationOutlined,
  PayCircleOutlined,
  SettingOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons-vue";

export interface MenuNode {
  key: string;
  title: string;
  icon?: Component;
  path?: string;
  description?: string;
  group?: string;
  highlights?: string[];
  children?: MenuNode[];
}

export const menuTree: MenuNode[] = [
  {
    key: "dashboard",
    title: "工作台",
    icon: DashboardOutlined,
    path: "/dashboard",
    group: "首页",
    description: "园区运营首页。待办、快捷入口和运行摘要将在此汇集，当前仅保留页面骨架。",
    highlights: ["今日待办", "运行摘要", "快捷入口", "公告速览"],
  },
  {
    key: "park",
    title: "园区管理",
    icon: BankOutlined,
    children: [
      {
        key: "park-info",
        title: "园区信息",
        path: "/park/info",
        group: "园区管理",
        description: "维护园区名称、地址、面积与运营主体。档案表单尚未接入。",
        highlights: ["基础档案", "区位信息", "运营主体", "证照附件"],
      },
      {
        key: "buildings",
        title: "楼宇管理",
        path: "/park/buildings",
        group: "园区管理",
        description: "楼栋台账、层数与启用状态的管理入口。列表仍是占位骨架。",
        highlights: ["楼栋台账", "楼层结构", "启用状态", "面积汇总"],
      },
      {
        key: "spaces",
        title: "空间房间",
        path: "/park/spaces",
        group: "园区管理",
        description: "房间、工位与公共空间的空置和占用视图。房源数据待接入。",
        highlights: ["房间台账", "空置情况", "功能分区", "平面索引"],
      },
    ],
  },
  {
    key: "enterprise",
    title: "企业服务",
    icon: ShopOutlined,
    children: [
      {
        key: "companies",
        title: "入驻企业",
        path: "/enterprise/companies",
        group: "企业服务",
        description: "在园企业名录、联系人与入驻状态。名录接口尚未接通。",
        highlights: ["企业名录", "联系人", "入驻状态", "所属楼宇"],
      },
      {
        key: "contracts",
        title: "合同管理",
        path: "/enterprise/contracts",
        group: "企业服务",
        description: "租赁与服务合同的签订、到期提醒。合同文本暂不展示。",
        highlights: ["合同列表", "到期提醒", "签约主体", "附件占位"],
      },
    ],
  },
  {
    key: "workorders",
    title: "报修工单",
    icon: ToolOutlined,
    path: "/workorders",
    group: "物业服务",
    description: "报修受理、派单与完工闭环。工单流将在后续阶段接入。",
    highlights: ["待受理", "处理中", "已完工", "超时提醒"],
  },
  {
    key: "billing",
    title: "物业缴费",
    icon: PayCircleOutlined,
    path: "/billing",
    group: "物业服务",
    description: "物业费、能耗费与其他账单的收取入口。账单数据为空。",
    highlights: ["待缴账单", "已收费用", "催缴记录", "票据占位"],
  },
  {
    key: "visitors",
    title: "访客通行",
    icon: IdcardOutlined,
    path: "/visitors",
    group: "通行安防",
    description: "访客预约、邀约与通行记录。闸机数据尚未接入。",
    highlights: ["今日访客", "预约审核", "通行记录", "黑名单"],
  },
  {
    key: "energy",
    title: "能源监测",
    icon: ThunderboltOutlined,
    path: "/energy",
    group: "运行监测",
    description: "电、水、冷热负荷的监测看板。曲线图留到后续图表阶段。",
    highlights: ["用电负荷", "用水量", "分项能耗", "异常波动"],
  },
  {
    key: "security",
    title: "安防监控",
    icon: VideoCameraOutlined,
    path: "/security",
    group: "通行安防",
    description: "视频点位与告警联动的监控墙。画面流暂不播放。",
    highlights: ["监控点位", "在线状态", "告警联动", "回放入口"],
  },
  {
    key: "notices",
    title: "通知公告",
    icon: NotificationOutlined,
    path: "/notices",
    group: "园区服务",
    description: "面向企业和物业人员的公告发布。内容列表仍是骨架。",
    highlights: ["已发布", "草稿", "阅读范围", "置顶公告"],
  },
  {
    key: "system",
    title: "系统设置",
    icon: SettingOutlined,
    children: [
      {
        key: "users",
        title: "用户管理",
        path: "/system/users",
        group: "系统设置",
        description: "运营账号与组织归属。登录鉴权不在本次原型范围内。",
        highlights: ["账号列表", "所属组织", "启用状态", "最近登录"],
      },
      {
        key: "roles",
        title: "角色管理",
        path: "/system/roles",
        group: "系统设置",
        description: "角色与权限点配置。权限模型尚未落地。",
        highlights: ["角色列表", "权限点", "数据范围", "成员数量"],
      },
      {
        key: "menus",
        title: "菜单管理",
        path: "/system/menus",
        group: "系统设置",
        description: "后台菜单与路由对照。当前菜单由前端静态配置。",
        highlights: ["菜单树", "路由路径", "图标", "排序"],
      },
    ],
  },
];

export function leafMenus(nodes: MenuNode[] = menuTree): MenuNode[] {
  return nodes.flatMap((node) => (node.children ? leafMenus(node.children) : node.path ? [node] : []));
}

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
    description: "汇总待办、欠费、访客和公告，并提供各台账入口。",
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
        description: "维护园区名称、地址、面积与运营主体。档案保存在本机。",
        highlights: ["基础档案", "区位信息", "运营主体", "证照附件"],
      },
      {
        key: "buildings",
        title: "楼宇管理",
        path: "/park/buildings",
        group: "园区管理",
        description: "楼栋台账、层数、用途与启用状态。",
        highlights: ["楼栋台账", "楼层结构", "启用状态", "面积汇总"],
      },
      {
        key: "spaces",
        title: "空间房间",
        path: "/park/spaces",
        group: "园区管理",
        description: "房间与公共空间的空置、出租和自用情况。",
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
        description: "在园企业名录、联系人与入驻状态。",
        highlights: ["企业名录", "联系人", "入驻状态", "所属楼宇"],
      },
      {
        key: "contracts",
        title: "合同管理",
        path: "/enterprise/contracts",
        group: "企业服务",
        description: "租赁与服务合同，可查看到期状态并维护摘要。",
        highlights: ["合同列表", "到期提醒", "签约主体", "状态筛选"],
      },
    ],
  },
  {
    key: "workorders",
    title: "报修工单",
    icon: ToolOutlined,
    path: "/workorders",
    group: "物业服务",
    description: "报修受理、派单、验收与完工。示例数据可筛选、新建和编辑。",
    highlights: ["待受理", "处理中", "已完工", "超时提醒"],
  },
  {
    key: "billing",
    title: "物业缴费",
    icon: PayCircleOutlined,
    path: "/billing",
    group: "物业服务",
    description: "物业费、能耗费与停车费账单。可查看明细、开立账单并登记收款。",
    highlights: ["待缴账单", "已收费用", "逾期账单", "登记收款"],
  },
  {
    key: "visitors",
    title: "访客通行",
    icon: IdcardOutlined,
    path: "/visitors",
    group: "通行安防",
    description: "访客预约、审核与到离记录。闸机仍未接入，可跳到通行大屏。",
    highlights: ["待审核", "已通过", "已到访", "跳转通行大屏"],
  },
  {
    key: "energy",
    title: "能源监测",
    icon: ThunderboltOutlined,
    path: "/energy",
    group: "运行监测",
    description: "电、水、冷热表计台账与最近读数。曲线在能耗大屏。",
    highlights: ["异常表计", "离线表计", "最近读数", "跳转能耗大屏"],
  },
  {
    key: "security",
    title: "安防监控",
    icon: VideoCameraOutlined,
    path: "/security",
    group: "通行安防",
    description: "监控与周界点位、在线状态。画面流暂不播放，可跳到通行大屏。",
    highlights: ["在线点位", "告警点位", "离线点位", "跳转通行大屏"],
  },
  {
    key: "notices",
    title: "通知公告",
    icon: NotificationOutlined,
    path: "/notices",
    group: "园区服务",
    description: "面向企业和物业人员发布公告、草稿和置顶。",
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
        description: "运营账号与组织归属。登录仍使用演示账号，此处是本机台账。",
        highlights: ["账号列表", "所属组织", "启用状态", "最近登录"],
      },
      {
        key: "roles",
        title: "角色管理",
        path: "/system/roles",
        group: "系统设置",
        description: "角色、数据范围与权限摘要。不改变真实登录权限。",
        highlights: ["角色列表", "权限点", "数据范围", "成员数量"],
      },
      {
        key: "menus",
        title: "菜单管理",
        path: "/system/menus",
        group: "系统设置",
        description: "后台菜单与路由对照。修改只写入本机台账，不改左侧导航。",
        highlights: ["菜单树", "路由路径", "图标", "排序"],
      },
    ],
  },
];

export function leafMenus(nodes: MenuNode[] = menuTree): MenuNode[] {
  return nodes.flatMap((node) => (node.children ? leafMenus(node.children) : node.path ? [node] : []));
}

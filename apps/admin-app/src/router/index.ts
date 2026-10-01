import { createRouter, createWebHistory } from "vue-router";
import { readSession } from "@park/shared";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { leafMenus } from "@/menus";
import LoginPage from "@/views/LoginPage.vue";
import PlaceholderPage from "@/views/PlaceholderPage.vue";
import BillDetail from "@/views/billing/BillDetail.vue";
import BillForm from "@/views/billing/BillForm.vue";
import BillList from "@/views/billing/BillList.vue";
import WorkorderDetail from "@/views/workorders/WorkorderDetail.vue";
import WorkorderForm from "@/views/workorders/WorkorderForm.vue";
import WorkorderList from "@/views/workorders/WorkorderList.vue";

const placeholderRoutes = leafMenus()
  .filter((item) => item.key !== "workorders" && item.key !== "billing")
  .map((item) => ({
    path: item.path!.replace(/^\//, ""),
    name: item.key,
    component: PlaceholderPage,
    meta: {
      title: item.title,
      description: item.description ?? "",
      group: item.group ?? "园区运营",
      highlights: item.highlights ?? [],
    },
  }));

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: { title: "登录", public: true },
    },
    {
      path: "/",
      component: AdminLayout,
      redirect: "/dashboard",
      children: [
        {
          path: "workorders",
          name: "workorders",
          component: WorkorderList,
          meta: { title: "报修工单", crumbs: ["报修工单"] },
        },
        {
          path: "workorders/new",
          name: "workorder-create",
          component: WorkorderForm,
          meta: { title: "新建工单", crumbs: ["报修工单", "新建"] },
        },
        {
          path: "workorders/:id/edit",
          name: "workorder-edit",
          component: WorkorderForm,
          meta: { title: "编辑工单", crumbs: ["报修工单", "编辑"] },
        },
        {
          path: "workorders/:id",
          name: "workorder-detail",
          component: WorkorderDetail,
          meta: { title: "工单详情", crumbs: ["报修工单", "详情"] },
        },
        {
          path: "billing",
          name: "billing",
          component: BillList,
          meta: { title: "物业缴费", crumbs: ["物业缴费"] },
        },
        {
          path: "billing/new",
          name: "bill-create",
          component: BillForm,
          meta: { title: "开立账单", crumbs: ["物业缴费", "开立"] },
        },
        {
          path: "billing/:id/pay",
          name: "bill-pay",
          component: BillForm,
          meta: { title: "登记收款", crumbs: ["物业缴费", "收款"] },
        },
        {
          path: "billing/:id",
          name: "bill-detail",
          component: BillDetail,
          meta: { title: "账单详情", crumbs: ["物业缴费", "详情"] },
        },
        ...placeholderRoutes,
        {
          path: ":pathMatch(.*)*",
          name: "not-found",
          component: PlaceholderPage,
          meta: {
            title: "页面不存在",
            description: "该地址没有对应菜单。请从左侧导航进入已开通的原型页面。",
            group: "导航",
            highlights: ["返回工作台", "检查地址", "菜单对照"],
          },
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const authed = Boolean(readSession());
  if (to.meta.public) {
    if (authed && to.path === "/login") return "/dashboard";
    return true;
  }
  if (!authed) return { path: "/login", query: { redirect: to.fullPath } };
  return true;
});

router.afterEach((to) => {
  const title = typeof to.meta.title === "string" ? to.meta.title : "管理控制台";
  document.title = `${title} · 园区运营平台`;
});

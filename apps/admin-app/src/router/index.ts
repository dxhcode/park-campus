import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import PlaceholderPage from "@/views/PlaceholderPage.vue";
import { leafMenus } from "@/menus";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AdminLayout,
      redirect: "/dashboard",
      children: [
        ...leafMenus().map((item) => ({
          path: item.path!.replace(/^\//, ""),
          name: item.key,
          component: PlaceholderPage,
          meta: {
            title: item.title,
            description: item.description ?? "",
            group: item.group ?? "园区运营",
            highlights: item.highlights ?? [],
          },
        })),
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

router.afterEach((to) => {
  const title = typeof to.meta.title === "string" ? to.meta.title : "管理控制台";
  document.title = `${title} · 园区运营平台`;
});

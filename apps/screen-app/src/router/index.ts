import { createRouter, createWebHistory } from "vue-router";
import ScreenLayout from "@/layouts/ScreenLayout.vue";
import ScenePage from "@/views/ScenePage.vue";
import { scenes } from "@/scenes";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: ScreenLayout,
      redirect: "/overview",
      children: [
        ...scenes.map((scene) => ({
          path: scene.path.replace(/^\//, ""),
          name: scene.key,
          component: ScenePage,
          meta: {
            title: scene.title,
            description: scene.description,
            accent: scene.accent,
            panels: scene.panels,
          },
        })),
        {
          path: ":pathMatch(.*)*",
          name: "not-found",
          component: ScenePage,
          meta: {
            title: "未知场景",
            description: "该场景尚未配置。请从顶部导航切换已开通的态势页。",
            accent: "#67e8f9",
            panels: ["场景导航", "综合态势", "告警中心", "返回入口"],
          },
        },
      ],
    },
  ],
});

router.afterEach((to) => {
  const title = typeof to.meta.title === "string" ? to.meta.title : "态势大屏";
  document.title = `${title} · 园区运营平台`;
});

<script setup lang="ts">
import { computed, h, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message, type MenuProps } from "ant-design-vue";
import { BellOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { isParkKey, screenHref, site } from "@park/shared";
import { leafMenus, menuTree, type MenuNode } from "@/menus";
import { useAppStore } from "@/stores/app";
import { useSessionStore } from "@/stores/session";

const route = useRoute();
const router = useRouter();
const app = useAppStore();
const session = useSessionStore();
const openKeys = ref<string[]>([]);
const narrow = ref(false);

function syncNarrow() {
  const next = window.innerWidth < 992;
  if (next && !narrow.value) app.collapsed = true;
  narrow.value = next;
}
const screenLink = computed(() => screenHref("/overview", { from: route.path || "/dashboard", park: app.parkKey }));

watch(
  () => route.query.park,
  (value) => {
    const raw = Array.isArray(value) ? value[0] : value;
    if (typeof raw === "string" && isParkKey(raw)) app.setPark(raw);
  },
  { immediate: true },
);

function owningLeaf(path: string) {
  return leafMenus()
    .filter((item) => item.path && (path === item.path || path.startsWith(`${item.path}/`)))
    .sort((a, b) => b.path!.length - a.path!.length)[0];
}

function toItems(nodes: MenuNode[]): MenuProps["items"] {
  return nodes.map((node) => {
    const item: NonNullable<MenuProps["items"]>[number] = {
      key: node.key,
      label: node.title,
      icon: node.icon ? () => h(node.icon!) : undefined,
    };
    if (node.children?.length) {
      return { ...item, children: toItems(node.children) };
    }
    return item;
  });
}

const menuItems = computed(() => toItems(menuTree));

const selectedKeys = computed(() => {
  const hit = owningLeaf(route.path);
  return hit ? [hit.key] : [];
});

const crumbs = computed(() => {
  if (Array.isArray(route.meta.crumbs) && route.meta.crumbs.length) return route.meta.crumbs;
  const leaf = owningLeaf(route.path);
  if (!leaf) return [String(route.meta.title ?? "页面")];
  const parent = menuTree.find((node) => node.children?.some((child) => child.key === leaf.key));
  return parent ? [parent.title, leaf.title] : [leaf.title];
});

function syncOpenKeys() {
  const leaf = owningLeaf(route.path);
  const parent = menuTree.find((node) => node.children?.some((child) => child.key === leaf?.key));
  if (!parent || app.collapsed) return;
  if (!openKeys.value.includes(parent.key)) openKeys.value = [...openKeys.value, parent.key];
}

function logout() {
  session.logout();
  message.success("已退出登录");
  router.replace("/login");
}

watch(() => route.path, syncOpenKeys, { immediate: true });
watch(
  () => route.path,
  () => {
    if (narrow.value) app.collapsed = true;
  },
);

onMounted(() => {
  narrow.value = window.innerWidth < 992;
  if (narrow.value) app.collapsed = true;
  window.addEventListener("resize", syncNarrow);
});

onUnmounted(() => {
  window.removeEventListener("resize", syncNarrow);
});

function onMenuClick(info: { key: string | number }) {
  const hit = leafMenus().find((item) => item.key === String(info.key));
  if (hit?.path && hit.path !== route.path) router.push(hit.path);
}
</script>

<template>
  <a-layout class="admin-shell">
    <div class="ambient" aria-hidden="true"></div>
    <button
      v-if="narrow && !app.collapsed"
      type="button"
      class="backdrop"
      aria-label="关闭菜单"
      @click="app.collapsed = true"
    ></button>
    <a-layout-sider
      class="sider"
      :class="{ 'is-narrow': narrow }"
      :collapsed="app.collapsed"
      :trigger="null"
      collapsible
      width="248"
      :collapsed-width="narrow ? 0 : 80"
      theme="dark"
    >
      <div class="brand" :class="{ 'is-collapsed': app.collapsed }">
        <div class="mark" aria-hidden="true">园</div>
        <div v-show="!app.collapsed" class="brand-copy">
          <strong>{{ site.name }}</strong>
          <em>{{ site.badge }} · {{ site.consoleName }}</em>
        </div>
      </div>
      <div class="menu-wrap">
        <a-menu
          v-model:openKeys="openKeys"
          :selected-keys="selectedKeys"
          mode="inline"
          theme="dark"
          :items="menuItems"
          @click="onMenuClick"
        />
      </div>
      <div v-show="!app.collapsed" class="sider-foot">演示会话 · 台账保存在本机</div>
    </a-layout-sider>

    <a-layout class="main">
      <a-layout-header class="header">
        <div class="header-left">
          <a-button type="text" class="fold" aria-label="折叠侧栏" @click="app.toggleCollapsed()">
            <MenuUnfoldOutlined v-if="app.collapsed" />
            <MenuFoldOutlined v-else />
          </a-button>
          <div>
            <div class="campus">{{ app.campusName }}</div>
            <a-breadcrumb>
              <a-breadcrumb-item>首页</a-breadcrumb-item>
              <a-breadcrumb-item v-for="crumb in crumbs" :key="crumb">{{ crumb }}</a-breadcrumb-item>
            </a-breadcrumb>
          </div>
        </div>
        <div class="header-right">
          <a :href="screenLink" class="screen-link">态势大屏</a>
          <a-popover placement="bottomRight" title="待关注">
            <template #content>
              <div class="notice">
                <router-link to="/workorders">海纳楼客梯仍在处理，期望今日恢复</router-link>
                <router-link to="/billing">有账单已过到期日，可去登记催缴</router-link>
                <router-link to="/visitors">今日有访客预约待审核</router-link>
                <router-link to="/notices">客梯检修公告仍在置顶</router-link>
              </div>
            </template>
            <a-badge dot>
              <a-button type="text" aria-label="通知">
                <BellOutlined />
              </a-button>
            </a-badge>
          </a-popover>
          <a-dropdown placement="bottomRight" :trigger="['click']">
            <button type="button" class="user">
              <a-avatar :size="32">{{ session.user?.avatarText ?? "园" }}</a-avatar>
              <div>
                <strong>{{ session.user?.displayName ?? "未登录" }}</strong>
                <span>{{ session.user?.roleName ?? "请重新登录" }}</span>
              </div>
            </button>
            <template #overlay>
              <a-menu>
                <a-menu-item key="org" disabled>{{ session.user?.org }}</a-menu-item>
                <a-menu-item key="at" disabled>登录于 {{ session.user?.loginAt }}</a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="logout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view v-slot="{ Component }">
          <transition name="route-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: transparent;
  overflow-x: clip;
}
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  border: 0;
  background: rgba(7, 17, 31, 0.45);
}
.ambient {
  position: fixed;
  inset: auto auto 8% -80px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(29, 109, 255, 0.18), transparent 68%);
  pointer-events: none;
}
.sider {
  position: sticky;
  top: 0;
  height: 100vh;
  background:
    radial-gradient(280px 180px at 20% 0%, rgba(56, 189, 248, 0.18), transparent 70%),
    linear-gradient(180deg, #07111f 0%, #0c1b33 58%, #071018 100%) !important;
  border-right: 1px solid rgba(125, 211, 252, 0.14);
  box-shadow: 12px 0 40px rgba(7, 17, 31, 0.18);
}
.sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  min-height: 84px;
  padding: 18px 16px 12px;
}
.brand.is-collapsed {
  justify-content: center;
  padding-inline: 0;
}
.mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: 14px;
  color: #07111f;
  font-weight: 700;
  background: linear-gradient(135deg, #67e8f9, #f5c16c);
  box-shadow: 0 0 24px rgba(103, 232, 249, 0.45);
}
.brand-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.brand-copy strong {
  color: white;
  font-size: 16px;
  letter-spacing: 0.04em;
}
.brand-copy em {
  color: rgba(186, 230, 253, 0.78);
  font-style: normal;
  font-size: 12px;
}
.menu-wrap {
  flex: 1;
  overflow: auto;
  padding: 4px 10px 12px;
}
.menu-wrap :deep(.ant-menu) {
  background: transparent;
  border-inline-end: 0 !important;
}
.menu-wrap :deep(.ant-menu-item),
.menu-wrap :deep(.ant-menu-submenu-title) {
  border-radius: 10px;
  transition: background-color 0.22s ease, color 0.22s ease;
}
.menu-wrap :deep(.ant-menu-item-selected) {
  background: linear-gradient(90deg, rgba(103, 232, 249, 0.22), rgba(29, 109, 255, 0.08)) !important;
  box-shadow: 0 0 18px rgba(103, 232, 249, 0.12);
}
.menu-wrap :deep(.ant-menu-item-selected)::after {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  border-radius: 999px;
  background: #67e8f9;
  box-shadow: 0 0 10px #67e8f9;
  transform-origin: center;
  animation: menu-bar 0.28s ease;
}
@keyframes menu-bar {
  from {
    transform: scaleY(0.35);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}
.sider-foot {
  margin: 8px 16px 16px;
  padding: 10px 12px;
  border-radius: 12px;
  color: rgba(226, 232, 240, 0.62);
  font-size: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.main {
  min-width: 0;
  background: transparent;
}
.header {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 20px;
  line-height: 1.3;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: inset 0 -2px 0 rgba(29, 109, 255, 0.08);
}
.header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #1d6dff, #67e8f9 46%, #f5c16c);
}
.header-left,
.header-right,
.user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.campus {
  color: rgba(15, 23, 42, 0.45);
  font-size: 12px;
  letter-spacing: 0.08em;
}
.fold {
  width: 40px;
  height: 40px;
}
.screen-link {
  padding: 6px 10px;
  border-radius: 999px;
  color: #0f172a;
  font-size: 13px;
  text-decoration: none;
  border: 1px solid rgba(29, 109, 255, 0.18);
  background: rgba(29, 109, 255, 0.06);
}
.screen-link:hover {
  color: #1d6dff;
}
.notice {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 240px;
}
.notice a {
  color: #1d4ed8;
}
.user {
  border: 0;
  background: rgba(29, 109, 255, 0.06);
  border-radius: 999px;
  padding: 4px 12px 4px 4px;
  cursor: pointer;
  color: inherit;
}
.user strong,
.user span {
  display: block;
}
.user strong {
  font-size: 13px;
}
.user span {
  color: rgba(15, 23, 42, 0.45);
  font-size: 12px;
}
.content {
  padding: 20px;
}
@media (max-width: 991px) {
  .sider.is-narrow {
    position: fixed !important;
    z-index: 30;
    left: 0;
  }
  .screen-link {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .menu-wrap :deep(.ant-menu-item),
  .menu-wrap :deep(.ant-menu-submenu-title) {
    transition: none;
  }
  .menu-wrap :deep(.ant-menu-item-selected)::after {
    animation: none;
  }
}
@media (max-width: 720px) {
  .user span,
  .campus {
    display: none;
  }
  .header {
    padding-inline: 12px;
  }
  .content {
    padding: 12px;
  }
}
</style>

<script setup lang="ts">
import { computed, h, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { MenuProps } from "ant-design-vue";
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import { site } from "@park/shared";
import { leafMenus, menuTree, type MenuNode } from "@/menus";
import { useAppStore } from "@/stores/app";

const route = useRoute();
const router = useRouter();
const app = useAppStore();
const openKeys = ref<string[]>([]);

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
  const hit = leafMenus().find((item) => item.path === route.path);
  return hit ? [hit.key] : [];
});

const crumbs = computed(() => {
  const leaf = leafMenus().find((item) => item.path === route.path);
  if (!leaf) return [String(route.meta.title ?? "页面")];
  const parent = menuTree.find((node) => node.children?.some((child) => child.key === leaf.key));
  return parent ? [parent.title, leaf.title] : [leaf.title];
});

function syncOpenKeys() {
  const parent = menuTree.find((node) => node.children?.some((child) => child.path === route.path));
  if (!parent || app.collapsed) return;
  if (!openKeys.value.includes(parent.key)) openKeys.value = [...openKeys.value, parent.key];
}

watch(() => route.path, syncOpenKeys, { immediate: true });

function onMenuClick(info: { key: string | number }) {
  const hit = leafMenus().find((item) => item.key === String(info.key));
  if (hit?.path && hit.path !== route.path) router.push(hit.path);
}
</script>

<template>
  <a-layout class="admin-shell">
    <div class="ambient" aria-hidden="true"></div>
    <a-layout-sider
      class="sider"
      :collapsed="app.collapsed"
      :trigger="null"
      collapsible
      width="248"
      :collapsed-width="80"
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
      <div v-show="!app.collapsed" class="sider-foot">原型环境 · 菜单已接通 · 数据未接入</div>
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
          <a-badge dot>
            <a-button type="text" aria-label="通知">
              <BellOutlined />
            </a-button>
          </a-badge>
          <div class="user">
            <a-avatar :size="32">运</a-avatar>
            <div>
              <strong>演示账号</strong>
              <span>园区管理员</span>
            </div>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: transparent;
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
.menu-wrap :deep(.ant-menu-item-selected) {
  box-shadow: inset 2px 0 0 #67e8f9;
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
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
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

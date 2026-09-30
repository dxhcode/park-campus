<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { screenTheme } from "./theme";
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="screenTheme">
    <router-view />
  </a-config-provider>
</template>

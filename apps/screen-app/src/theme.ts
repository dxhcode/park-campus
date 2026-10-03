import { theme } from "ant-design-vue";
import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";

export const screenTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#22d3ee",
    colorInfo: "#22d3ee",
    borderRadius: 12,
    fontFamily:
      '"PingFang SC", "Noto Sans SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif',
    colorBgContainer: "rgba(8, 16, 32, 0.2)",
    colorBgElevated: "#0c1728",
  },
};

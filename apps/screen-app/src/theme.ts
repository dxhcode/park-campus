import { theme } from "ant-design-vue";
import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";
import { palette } from "@park/shared";

export const screenTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: palette.cyan,
    colorInfo: palette.cyan,
    colorSuccess: palette.green,
    colorWarning: palette.gold,
    colorError: palette.rose,
    borderRadius: 12,
    fontFamily:
      '"PingFang SC", "Noto Sans SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif',
    colorBgContainer: "rgba(8, 16, 32, 0.2)",
    colorBgElevated: "#0c1728",
  },
};

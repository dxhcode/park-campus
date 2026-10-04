import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";
import { palette } from "@park/shared";

export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: palette.blue,
    colorInfo: palette.blue,
    colorLink: palette.blue,
    colorSuccess: "#059669",
    colorWarning: "#d97706",
    colorError: "#e11d48",
    borderRadius: 10,
    fontFamily:
      '"PingFang SC", "Noto Sans SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif',
    colorBgLayout: "#eef3fb",
    controlHeight: 36,
  },
};

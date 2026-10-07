import { createPinia } from "pinia";
import { createApp } from "vue";
import Antd from "ant-design-vue";
import { applyParkTheme } from "@park/theme";
import "ant-design-vue/dist/reset.css";
import "@park/theme/theme.css";
import "@park/components/style.css";
import App from "./App.vue";
import { router } from "./router";
import "./styles/screen.css";
import "./styles/cockpit.css";

applyParkTheme("screen");

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount("#app");

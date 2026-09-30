# 园区运营平台

智慧园区前端原型。pnpm monorepo 内含两个 Vue 应用：

- `apps/admin-app`：管理控制台，深色侧栏与中文业务菜单
- `apps/screen-app`：态势大屏，全屏科技风场景壳
- `packages/shared`：两端共用的站点名称

当前阶段只有菜单、路由和占位页，没有登录、接口、图表或地图。

## 本地运行

```bash
pnpm install
pnpm dev
```

- 管理端：http://localhost:5173/
- 态势大屏：http://localhost:5174/

也可以单独启动：`pnpm --filter @park/admin-app dev`、`pnpm --filter @park/screen-app dev`。

## 构建与 GitHub Pages

生产构建的 Vite `base` 分别为 `/park-campus/admin/` 与 `/park-campus/screen/`。本地开发仍使用 `/`。

```bash
pnpm pages:build
```

产物目录：

- `dist/index.html`：入口页，链到管理端和大屏
- `dist/admin/`：管理端
- `dist/screen/`：大屏
- `dist/404.html`：深层路由刷新时回到对应应用

发布目标：

- https://dxhcode.github.io/park-campus/
- https://dxhcode.github.io/park-campus/admin/
- https://dxhcode.github.io/park-campus/screen/

Pages 源为 `dist` 分支的根目录。

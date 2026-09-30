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

`dist` 分支根目录已经是可发布的静态包。开启 Pages 需要仓库管理员权限；当前自动化令牌调用 Pages 接口会返回 403，因此要在网页上打开一次：

1. 打开仓库 Settings → Pages：https://github.com/dxhcode/park-campus/settings/pages
2. Build and deployment 选择 **Deploy from a branch**
3. Branch 选择 `dist`，文件夹选择 `/ (root)`，保存

保存后的地址：

- https://dxhcode.github.io/park-campus/
- https://dxhcode.github.io/park-campus/admin/
- https://dxhcode.github.io/park-campus/screen/

站点从已有的 `dist` 分支构建。若保存后短时间仍是 404，等 GitHub 完成第一次构建即可。

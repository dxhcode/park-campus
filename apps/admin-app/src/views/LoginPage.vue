<script setup lang="ts">
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { demoAccounts, screenHref, site } from "@park/shared";
import { useSessionStore } from "@/stores/session";

const route = useRoute();
const router = useRouter();
const session = useSessionStore();

const form = reactive({
  username: "admin",
  password: "park2026",
});

const screenEntry = screenHref("/overview");

function goNext() {
  const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/dashboard";
  const safe = redirect.startsWith("/") && !redirect.startsWith("//") && !redirect.startsWith("/login") ? redirect : "/dashboard";
  router.replace(safe);
}

function enter(username: string, password: string) {
  const result = session.login(username, password);
  if (!result.ok) {
    message.warning(result.message);
    return;
  }
  message.success(`欢迎回来，${result.user.displayName}`);
  goNext();
}

function onFinish() {
  enter(form.username, form.password);
}

function useAccount(username: string, password: string) {
  form.username = username;
  form.password = password;
  enter(username, password);
}
</script>

<template>
  <div class="login">
    <div class="grid" aria-hidden="true"></div>
    <div class="orb orb-a" aria-hidden="true"></div>
    <div class="orb orb-b" aria-hidden="true"></div>

    <div class="panel">
      <section class="intro">
        <div class="badge">{{ site.badge }} · {{ site.campusName }}</div>
        <h1>{{ site.name }}</h1>
        <p>{{ site.tagline }}</p>
        <ul>
          <li>报修从受理到完工可点击走通</li>
          <li>物业账单可开立并登记收款</li>
          <li>会话保存在本机，退出后需重新登录</li>
          <li>大屏可直接看，返回时再进控制台</li>
        </ul>
        <a class="screen-link" :href="screenEntry">先看态势大屏 →</a>
      </section>

      <section class="card">
        <div class="card-kicker">管理控制台</div>
        <h2>登录</h2>
        <p class="hint">演示环境不校验密码。填写任意非空账号即可进入；点下面的名片会直接登录。</p>

        <a-form layout="vertical" :model="form" @finish="onFinish">
          <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input v-model:value="form.username" size="large" autocomplete="username" placeholder="例如 admin" />
          </a-form-item>
          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="form.password"
              size="large"
              autocomplete="current-password"
              placeholder="可留空，演示账号不会被拒绝"
            />
          </a-form-item>
          <a-button type="primary" html-type="submit" size="large" block>进入控制台</a-button>
        </a-form>

        <div class="account-label">演示账号</div>
        <div class="accounts">
          <button
            v-for="account in demoAccounts"
            :key="account.username"
            type="button"
            class="account"
            @click="useAccount(account.username, account.password)"
          >
            <strong>{{ account.displayName }}</strong>
            <span>{{ account.username }} / {{ account.password }}</span>
            <em>{{ account.roleName }} · {{ account.hint }}</em>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #e8f1ff;
  background:
    radial-gradient(900px 480px at 0% -10%, rgba(34, 211, 238, 0.22), transparent 55%),
    radial-gradient(700px 420px at 100% 0%, rgba(245, 193, 108, 0.16), transparent 50%),
    #07111f;
}
.grid,
.orb {
  position: fixed;
  pointer-events: none;
}
.grid {
  inset: 0;
  background-image:
    linear-gradient(rgba(125, 211, 252, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125, 211, 252, 0.08) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: radial-gradient(circle at 30% 40%, #000 15%, transparent 75%);
}
.orb {
  width: 360px;
  height: 360px;
  border-radius: 50%;
  filter: blur(16px);
}
.orb-a {
  top: -80px;
  left: -40px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.35), transparent 68%);
}
.orb-b {
  right: -80px;
  bottom: -120px;
  background: radial-gradient(circle, rgba(245, 193, 108, 0.28), transparent 68%);
}
.panel {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(360px, 480px);
  gap: 48px;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  padding: 64px 24px;
  min-height: 100vh;
}
.badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  color: #67e8f9;
  letter-spacing: 0.16em;
  font-size: 12px;
  border: 1px solid rgba(103, 232, 249, 0.4);
  background: rgba(8, 20, 38, 0.55);
}
h1 {
  margin: 16px 0 10px;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.08;
  letter-spacing: 0.04em;
}
.intro p {
  max-width: 460px;
  color: rgba(226, 232, 240, 0.78);
  font-size: 16px;
  line-height: 1.7;
}
ul {
  margin: 22px 0;
  padding: 0;
  list-style: none;
}
li {
  position: relative;
  margin: 8px 0;
  padding-left: 16px;
  color: rgba(224, 242, 254, 0.88);
}
li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, #67e8f9, #f5c16c);
  box-shadow: 0 0 10px rgba(103, 232, 249, 0.8);
}
.screen-link {
  display: inline-flex;
  margin-top: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  color: #07111f;
  letter-spacing: 0.06em;
  text-decoration: none;
  font-weight: 600;
  background: linear-gradient(135deg, #67e8f9, #f5c16c);
  box-shadow: 0 0 18px rgba(103, 232, 249, 0.35);
}
.card {
  padding: 28px 26px 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}
.card-kicker {
  color: #1d6dff;
  letter-spacing: 0.18em;
  font-size: 12px;
}
h2 {
  margin: 6px 0;
  font-size: 28px;
}
.hint {
  margin: 0 0 16px;
  color: rgba(15, 23, 42, 0.62);
  line-height: 1.6;
}
.account-label {
  margin: 18px 0 8px;
  color: rgba(15, 23, 42, 0.45);
  font-size: 12px;
  letter-spacing: 0.12em;
}
.accounts {
  display: grid;
  gap: 8px;
}
.account {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(29, 109, 255, 0.14);
  background: linear-gradient(180deg, #f8fbff, #fff);
  cursor: pointer;
}
.account:hover {
  border-color: rgba(29, 109, 255, 0.45);
  box-shadow: 0 8px 24px rgba(29, 109, 255, 0.12);
}
.account strong {
  font-size: 14px;
}
.account span,
.account em {
  font-style: normal;
  font-size: 12px;
  color: rgba(15, 23, 42, 0.55);
}
@media (max-width: 860px) {
  .panel {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-top: 36px;
  }
}
</style>

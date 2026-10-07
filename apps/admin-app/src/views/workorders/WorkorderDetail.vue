<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { screenHref } from "@park/shared";
import { assigneeOptions, priorityColor, statusColor, type WorkorderStatus } from "@/data/workorders";
import { useAppStore } from "@/stores/app";
import { useSessionStore } from "@/stores/session";
import { useWorkorderStore } from "@/stores/workorders";

const route = useRoute();
const router = useRouter();
const app = useAppStore();
const store = useWorkorderStore();
const screenLink = computed(() => screenHref("/workorders", { from: route.path, park: app.parkKey }));
const session = useSessionStore();

const item = computed(() => store.byId(String(route.params.id)));
const dispatchOpen = ref(false);
const assignee = ref<string>(assigneeOptions[0]);
const closeOpen = ref(false);

const actor = computed(() => session.user?.displayName ?? "演示用户");

function run(status: WorkorderStatus, action: string, note: string, nextAssignee?: string) {
  const current = item.value;
  if (!current) return;
  store.transition(current.id, status, actor.value, action, note, nextAssignee);
  message.success(action);
}

function confirmDispatch() {
  if (!assignee.value) {
    message.warning("请选择处理人");
    return;
  }
  run("处理中", "受理并派单", `派给 ${assignee.value}`, assignee.value);
  dispatchOpen.value = false;
}
</script>

<template>
  <section class="page-stack">
    <a-result v-if="!item" status="404" title="工单不存在" sub-title="可能已被恢复示例数据覆盖。">
      <template #extra>
        <a-button type="primary" @click="router.push('/workorders')">返回列表</a-button>
      </template>
    </a-result>

    <template v-else>
      <header class="page-hero">
        <div>
          <div class="eyebrow">{{ item.code }} · {{ item.source }}</div>
          <h1>{{ item.title }}</h1>
          <p>{{ item.building }} · {{ item.location }} · 期望 {{ item.expectAt || "未填" }}</p>
        </div>
        <a-space wrap>
          <a-tag :color="priorityColor(item.priority)">{{ item.priority }}</a-tag>
          <a-tag :color="statusColor(item.status)">{{ item.status }}</a-tag>
          <a-button :href="screenLink">工单大屏</a-button>
          <a-button @click="router.push('/workorders')">返回列表</a-button>
          <a-button @click="router.push(`/workorders/${item.id}/edit`)">编辑</a-button>
          <a-button v-if="item.status === '待受理'" type="primary" @click="dispatchOpen = true">受理并派单</a-button>
          <a-button v-else-if="item.status === '处理中'" type="primary" @click="run('待验收', '提交验收', '处理完成，等待报修人确认')">提交验收</a-button>
          <template v-else-if="item.status === '待验收'">
            <a-button @click="run('处理中', '退回处理', '验收未通过，退回现场')">退回处理</a-button>
            <a-button type="primary" @click="run('已完工', '确认完工', '验收通过')">确认完工</a-button>
          </template>
          <a-button v-else-if="item.status === '已完工'" type="primary" @click="closeOpen = true">关闭工单</a-button>
        </a-space>
      </header>

      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :lg="15">
          <a-card class="glow-card" :bordered="false" title="工单资料">
            <a-descriptions :column="2" bordered size="middle">
              <a-descriptions-item label="报修企业" :span="2">{{ item.company }}</a-descriptions-item>
              <a-descriptions-item label="报修人">{{ item.reporter }}</a-descriptions-item>
              <a-descriptions-item label="电话">{{ item.phone }}</a-descriptions-item>
              <a-descriptions-item label="类别">{{ item.category }}</a-descriptions-item>
              <a-descriptions-item label="处理人">{{ item.assignee || "待指派" }}</a-descriptions-item>
              <a-descriptions-item label="报修时间">{{ item.createdAt }}</a-descriptions-item>
              <a-descriptions-item label="最近更新">{{ item.updatedAt }}</a-descriptions-item>
              <a-descriptions-item label="情况说明" :span="2">{{ item.description }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :xs="24" :lg="9">
          <a-card class="glow-card" :bordered="false" title="处理轨迹">
            <a-timeline>
              <a-timeline-item v-for="step in [...item.timeline].reverse()" :key="step.id">
                <div class="step-title">{{ step.action }}</div>
                <div class="step-meta">{{ step.time }} · {{ step.actor }}</div>
                <div class="step-note">{{ step.note }}</div>
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
      </a-row>
    </template>

    <a-modal v-model:open="dispatchOpen" title="受理并派单" ok-text="派单" cancel-text="取消" @ok="confirmDispatch">
      <p>选择到场班组。派单后工单进入处理中。</p>
      <a-select v-model:value="assignee" style="width: 100%" :options="assigneeOptions.map((value) => ({ value, label: value }))" />
    </a-modal>

    <a-modal
      v-model:open="closeOpen"
      title="关闭工单"
      ok-text="关闭"
      cancel-text="取消"
      @ok="
        run('已关闭', '关闭工单', '归档，不再跟进');
        closeOpen = false;
      "
    >
      <p>关闭后仍可在列表中查看，只是不再出现在未闭环统计里。</p>
    </a-modal>
  </section>
</template>

<style scoped>
.step-title {
  font-weight: 650;
}
.step-meta,
.step-note {
  color: rgba(15, 23, 42, 0.62);
  font-size: 13px;
  line-height: 1.6;
}
</style>

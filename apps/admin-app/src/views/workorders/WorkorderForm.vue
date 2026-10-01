<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import {
  assigneeOptions,
  draftFrom,
  emptyDraft,
  parkBuildings,
  parkCompanies,
  workorderCategories,
  workorderPriorities,
  workorderSources,
  type WorkorderDraft,
} from "@/data/workorders";
import { useSessionStore } from "@/stores/session";
import { useWorkorderStore } from "@/stores/workorders";

const route = useRoute();
const router = useRouter();
const store = useWorkorderStore();
const session = useSessionStore();

const editing = computed(() => route.name === "workorder-edit");
const current = computed(() => (editing.value ? store.byId(String(route.params.id)) : undefined));
const form = reactive<WorkorderDraft>(emptyDraft());

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

watch(
  () => route.fullPath,
  () => {
    const source = current.value ? draftFrom(current.value) : emptyDraft();
    Object.assign(form, source);
  },
  { immediate: true },
);

function onFinish() {
  const actor = session.user?.displayName ?? "演示用户";
  if (editing.value) {
    const saved = store.update(String(route.params.id), { ...form }, actor);
    if (!saved) {
      message.error("工单不存在");
      return;
    }
    message.success("工单已保存");
    router.push(`/workorders/${saved.id}`);
    return;
  }
  const created = store.create({ ...form }, actor);
  message.success(`已创建 ${created.code}`);
  router.push(`/workorders/${created.id}`);
}
</script>

<template>
  <section class="page-stack">
    <a-result v-if="editing && !current" status="404" title="无法编辑" sub-title="这条工单不在当前示例数据里。">
      <template #extra>
        <a-button type="primary" @click="router.push('/workorders')">返回列表</a-button>
      </template>
    </a-result>

    <template v-else>
      <header class="page-hero">
        <div>
          <div class="eyebrow">物业服务</div>
          <h1>{{ editing ? "编辑工单" : "新建工单" }}</h1>
          <p>{{ editing ? current?.code : "保存后进入详情，可继续受理、派单和验收。" }}</p>
        </div>
        <a-button @click="router.push(editing && current ? `/workorders/${current.id}` : '/workorders')">取消</a-button>
      </header>

      <a-card class="glow-card form-card" :bordered="false">
        <a-form layout="vertical" :model="form" @finish="onFinish">
          <a-row :gutter="16">
            <a-col :xs="24" :md="16">
              <a-form-item label="标题" name="title" :rules="[{ required: true, message: '请填写标题' }]">
                <a-input v-model:value="form.title" placeholder="例如：海纳楼 2 号客梯异响" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item label="来源" name="source" :rules="[{ required: true, message: '请选择来源' }]">
                <a-select v-model:value="form.source" :options="toOptions(workorderSources)" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item label="类别" name="category" :rules="[{ required: true, message: '请选择类别' }]">
                <a-select v-model:value="form.category" :options="toOptions(workorderCategories)" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item label="楼宇" name="building" :rules="[{ required: true, message: '请选择楼宇' }]">
                <a-select v-model:value="form.building" :options="toOptions(parkBuildings)" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item label="优先级" name="priority" :rules="[{ required: true, message: '请选择优先级' }]">
                <a-select v-model:value="form.priority" :options="toOptions(workorderPriorities)" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="具体位置" name="location" :rules="[{ required: true, message: '请填写位置' }]">
                <a-input v-model:value="form.location" placeholder="楼层、房间或设备位" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="报修企业" name="company" :rules="[{ required: true, message: '请选择企业' }]">
                <a-select v-model:value="form.company" show-search option-filter-prop="label" :options="toOptions(parkCompanies)" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="6">
              <a-form-item label="报修人" name="reporter" :rules="[{ required: true, message: '请填写报修人' }]">
                <a-input v-model:value="form.reporter" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="6">
              <a-form-item
                label="手机"
                name="phone"
                :rules="[
                  { required: true, message: '请填写手机' },
                  { pattern: /^1\d{10}$/, message: '请输入 11 位手机号' },
                ]"
              >
                <a-input v-model:value="form.phone" placeholder="13800000000" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="处理人" name="assignee">
                <a-select
                  v-model:value="form.assignee"
                  allow-clear
                  placeholder="可先不派，详情里再受理"
                  :options="toOptions(assigneeOptions)"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="期望完成" name="expectAt">
                <a-date-picker v-model:value="form.expectAt" value-format="YYYY-MM-DD" style="width: 100%" placeholder="选择日期" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="情况说明" name="description" :rules="[{ required: true, message: '请填写情况说明' }]">
                <a-textarea v-model:value="form.description" :rows="4" placeholder="现象、影响范围、已经做过的临时措施" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-button type="primary" html-type="submit">{{ editing ? "保存修改" : "创建工单" }}</a-button>
        </a-form>
      </a-card>
    </template>
  </section>
</template>

<style scoped>
.form-card {
  max-width: 980px;
}
</style>

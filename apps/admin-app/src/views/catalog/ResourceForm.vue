<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { emptyFields, normalize } from "@/catalog/present";
import { resourceByKey } from "@/catalog/resources";
import type { FieldDef } from "@/catalog/types";
import { useCatalogStore } from "@/stores/catalog";
import { useSessionStore } from "@/stores/session";

const route = useRoute();
const router = useRouter();
const store = useCatalogStore();
const session = useSessionStore();

const def = computed(() => resourceByKey(String(route.meta.resource ?? "")));
const editing = computed(() => route.meta.mode === "edit");
const current = computed(() => (editing.value && def.value ? store.byId(def.value.key, String(route.params.id)) : undefined));
const form = reactive<{ fields: Record<string, string> }>({ fields: {} });

watch(
  () => route.fullPath,
  () => {
    const currentDef = def.value;
    if (!currentDef) return;
    const source = editing.value && current.value ? current.value.fields : emptyFields(currentDef);
    form.fields = normalize(currentDef, source);
  },
  { immediate: true },
);

function rulesFor(field: FieldDef) {
  const rules: Array<Record<string, unknown>> = [];
  if (field.required) {
    rules.push({
      required: true,
      whitespace: field.kind === "text" || field.kind === "textarea",
      message: `请填写${field.label}`,
    });
  }
  if (field.kind === "number" || field.kind === "money") {
    rules.push({
      validator: async (_rule: unknown, value: string) => {
        if (!value) return;
        if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error("请输入数字，最多两位小数");
      },
    });
  }
  return rules;
}

function spanOf(field: FieldDef) {
  if (field.kind === "textarea") return 24;
  return field.span ?? 8;
}

function onFinish() {
  const currentDef = def.value;
  if (!currentDef) return;
  const actor = session.user?.displayName ?? "演示用户";
  const fields = normalize(currentDef, form.fields);
  if (editing.value) {
    const saved = store.update(currentDef.key, String(route.params.id), fields, actor);
    if (!saved) {
      message.error(`${currentDef.noun}不存在`);
      return;
    }
    message.success("已保存");
    router.push(`${currentDef.path}/${saved.id}`);
    return;
  }
  const created = store.create(currentDef.key, fields, actor);
  if (!created) return;
  message.success(`已创建 ${created.code}`);
  router.push(`${currentDef.path}/${created.id}`);
}
</script>

<template>
  <a-result v-if="!def" status="404" title="台账不存在">
    <template #extra>
      <a-button type="primary" @click="router.push('/dashboard')">返回工作台</a-button>
    </template>
  </a-result>
  <a-result v-else-if="editing && !current" status="404" :title="`无法编辑${def.noun}`" sub-title="这条记录不在当前台账里。">
    <template #extra>
      <a-button type="primary" @click="router.push(def.path)">返回列表</a-button>
    </template>
  </a-result>

  <section v-else class="page-stack">
    <header class="page-hero">
      <div>
        <div class="eyebrow">{{ def.group }}</div>
        <h1>{{ editing ? `编辑${def.noun}` : def.createLabel }}</h1>
        <p>{{ editing ? current?.code : def.description }}</p>
      </div>
      <a-button @click="router.push(editing && current ? `${def.path}/${current.id}` : def.path)">取消</a-button>
    </header>

    <a-card class="glow-card form-card" :bordered="false">
      <a-form layout="vertical" :model="form" @finish="onFinish">
        <a-row :gutter="16">
          <a-col v-for="field in def.fields" :key="field.key" :xs="24" :md="spanOf(field)">
            <a-form-item :label="field.label" :name="['fields', field.key]" :rules="rulesFor(field)">
              <a-textarea
                v-if="field.kind === 'textarea'"
                v-model:value="form.fields[field.key]"
                :rows="4"
                :placeholder="field.placeholder || `请输入${field.label}`"
              />
              <a-select
                v-else-if="field.kind === 'select'"
                v-model:value="form.fields[field.key]"
                show-search
                option-filter-prop="label"
                :placeholder="`请选择${field.label}`"
                :options="(field.options ?? []).map((value) => ({ value, label: value }))"
              />
              <a-date-picker
                v-else-if="field.kind === 'date'"
                v-model:value="form.fields[field.key]"
                value-format="YYYY-MM-DD"
                style="width: 100%"
                placeholder="选择日期"
              />
              <a-input
                v-else
                v-model:value="form.fields[field.key]"
                :placeholder="field.placeholder || `请输入${field.label}`"
                :suffix="field.suffix"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" html-type="submit">{{ editing ? "保存修改" : def.createLabel }}</a-button>
      </a-form>
    </a-card>
  </section>
</template>

<style scoped>
.form-card {
  max-width: 980px;
}
</style>

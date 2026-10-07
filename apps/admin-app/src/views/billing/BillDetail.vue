<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { screenHref } from "@park/shared";
import { billStatusColor, paidOf, remainOf, statusOf } from "@/data/bills";
import { useAppStore } from "@/stores/app";
import { useBillStore } from "@/stores/bills";
import { formatYuan } from "@/utils/storage";

const route = useRoute();
const router = useRouter();
const app = useAppStore();
const store = useBillStore();
const screenLink = computed(() => screenHref("/overview", { from: route.path, park: app.parkKey }));

const item = computed(() => store.byId(String(route.params.id)));
const paid = computed(() => (item.value ? paidOf(item.value) : 0));
const remain = computed(() => (item.value ? remainOf(item.value) : 0));
const status = computed(() => (item.value ? statusOf(item.value) : "待缴费"));
</script>

<template>
  <section class="page-stack">
    <a-result v-if="!item" status="404" title="账单不存在" sub-title="可能已被恢复示例数据覆盖。">
      <template #extra>
        <a-button type="primary" @click="router.push('/billing')">返回列表</a-button>
      </template>
    </a-result>

    <template v-else>
      <header class="page-hero">
        <div>
          <div class="eyebrow">{{ item.code }} · {{ item.period }}</div>
          <h1>{{ item.company }}</h1>
          <p>{{ item.building }} · {{ item.room }} · {{ item.type }}</p>
        </div>
        <a-space wrap>
          <a-tag :color="billStatusColor(status)">{{ status }}</a-tag>
          <a-button :href="screenLink">收费态势</a-button>
          <a-button @click="router.push('/billing')">返回列表</a-button>
          <a-button v-if="status !== '已缴清'" type="primary" @click="router.push(`/billing/${item.id}/pay`)">登记收款</a-button>
        </a-space>
      </header>

      <div class="kpi-grid">
        <article class="kpi">
          <span>应收</span>
          <strong>¥ {{ formatYuan(item.amount) }}</strong>
        </article>
        <article class="kpi">
          <span>已收</span>
          <strong class="green">¥ {{ formatYuan(paid) }}</strong>
        </article>
        <article class="kpi">
          <span>未收</span>
          <strong :class="remain > 0 ? 'red' : 'green'">¥ {{ formatYuan(remain) }}</strong>
        </article>
        <article class="kpi">
          <span>到期日</span>
          <strong>{{ item.dueDate }}</strong>
        </article>
      </div>

      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :lg="10">
          <a-card class="glow-card" :bordered="false" title="账单说明">
            <a-descriptions :column="1" bordered size="middle">
              <a-descriptions-item label="联系人">{{ item.contact }} · {{ item.phone }}</a-descriptions-item>
              <a-descriptions-item label="开立时间">{{ item.createdAt }}</a-descriptions-item>
              <a-descriptions-item label="备注">{{ item.remark || "无" }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
        <a-col :xs="24" :lg="14">
          <a-card class="glow-card" :bordered="false" title="收款记录">
            <a-empty v-if="item.payments.length === 0" description="还没有收款" />
            <a-timeline v-else>
              <a-timeline-item v-for="pay in [...item.payments].reverse()" :key="pay.id" color="green">
                <div class="pay-title">¥ {{ formatYuan(pay.amount) }} · {{ pay.method }}</div>
                <div class="pay-meta">{{ pay.paidAt }} · {{ pay.operator }}</div>
                <div class="pay-meta">付款方 {{ pay.payer }}{{ pay.remark ? ` · ${pay.remark}` : "" }}</div>
              </a-timeline-item>
            </a-timeline>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </section>
</template>

<style scoped>
.pay-title {
  font-weight: 650;
}
.pay-meta {
  color: rgba(15, 23, 42, 0.62);
  font-size: 13px;
  line-height: 1.6;
}
</style>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { parkBuildings, parkCompanies } from "@/data/workorders";
import { billTypes, emptyBillDraft, payMethods, remainOf, type BillDraft, type PayMethod } from "@/data/bills";
import { useBillStore } from "@/stores/bills";
import { useSessionStore } from "@/stores/session";
import { formatYuan } from "@/utils/storage";

const route = useRoute();
const router = useRouter();
const store = useBillStore();
const session = useSessionStore();

const paying = computed(() => route.name === "bill-pay");
const bill = computed(() => (paying.value ? store.byId(String(route.params.id)) : undefined));
const remain = computed(() => (bill.value ? remainOf(bill.value) : 0));

const draft = reactive<BillDraft>(emptyBillDraft());
const payment = reactive({
  amount: null as number | null,
  method: "对公转账" as PayMethod,
  payer: "",
  remark: "",
});

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

watch(
  () => route.fullPath,
  () => {
    Object.assign(draft, emptyBillDraft());
    payment.amount = bill.value ? remain.value : null;
    payment.method = "对公转账";
    payment.payer = bill.value?.contact ?? "";
    payment.remark = "";
  },
  { immediate: true },
);

function submitCreate() {
  if (draft.amount == null || draft.amount <= 0) {
    message.warning("请填写大于 0 的应收金额");
    return;
  }
  const created = store.create({ ...draft, amount: draft.amount });
  message.success(`已开立 ${created.code}`);
  router.push(`/billing/${created.id}`);
}

function submitPay() {
  if (!bill.value) return;
  if (payment.amount == null || payment.amount <= 0) {
    message.warning("请填写收款金额");
    return;
  }
  if (payment.amount - remain.value > 0.001) {
    message.warning(`收款不能超过未收 ¥ ${formatYuan(remain.value)}`);
    return;
  }
  const saved = store.pay(
    bill.value.id,
    {
      amount: payment.amount,
      method: payment.method,
      payer: payment.payer,
      remark: payment.remark,
    },
    session.user?.displayName ?? "演示用户",
  );
  if (!saved) {
    message.error("收款没有写入");
    return;
  }
  message.success("收款已登记");
  router.push(`/billing/${saved.id}`);
}
</script>

<template>
  <section class="page-stack">
    <a-result v-if="paying && !bill" status="404" title="无法收款" sub-title="账单不存在。">
      <template #extra>
        <a-button type="primary" @click="router.push('/billing')">返回列表</a-button>
      </template>
    </a-result>

    <a-result v-else-if="paying && bill && remain <= 0" status="success" title="账单已缴清" sub-title="不需要再登记收款。">
      <template #extra>
        <a-button type="primary" @click="router.push(`/billing/${bill.id}`)">返回详情</a-button>
      </template>
    </a-result>

    <template v-else-if="paying && bill">
      <header class="page-hero">
        <div>
          <div class="eyebrow">{{ bill.code }}</div>
          <h1>登记收款</h1>
          <p>{{ bill.company }} · {{ bill.type }} · {{ bill.period }} · 未收 ¥ {{ formatYuan(remain) }}</p>
        </div>
        <a-button @click="router.push(`/billing/${bill.id}`)">取消</a-button>
      </header>

      <a-card class="glow-card form-card" :bordered="false">
        <a-form layout="vertical" :model="payment" @finish="submitPay">
          <a-form-item label="本次收款" name="amount" :rules="[{ required: true, message: '请填写金额' }]">
            <a-input-number v-model:value="payment.amount" :min="0.01" :max="remain" :precision="2" style="width: 100%" prefix="¥" />
          </a-form-item>
          <a-form-item label="方式" name="method" :rules="[{ required: true, message: '请选择方式' }]">
            <a-select v-model:value="payment.method" :options="toOptions(payMethods)" />
          </a-form-item>
          <a-form-item label="付款方" name="payer" :rules="[{ required: true, message: '请填写付款方' }]">
            <a-input v-model:value="payment.payer" />
          </a-form-item>
          <a-form-item label="备注" name="remark">
            <a-textarea v-model:value="payment.remark" :rows="3" placeholder="回单号、到账说明，可留空" />
          </a-form-item>
          <a-button type="primary" html-type="submit">确认收款</a-button>
        </a-form>
      </a-card>
    </template>

    <template v-else>
      <header class="page-hero">
        <div>
          <div class="eyebrow">物业服务</div>
          <h1>开立账单</h1>
          <p>生成一条待缴账单。到账后从详情进入收款。</p>
        </div>
        <a-button @click="router.push('/billing')">取消</a-button>
      </header>

      <a-card class="glow-card form-card" :bordered="false">
        <a-form layout="vertical" :model="draft" @finish="submitCreate">
          <a-row :gutter="16">
            <a-col :xs="24" :md="12">
              <a-form-item label="企业" name="company" :rules="[{ required: true, message: '请选择企业' }]">
                <a-select v-model:value="draft.company" show-search option-filter-prop="label" :options="toOptions(parkCompanies)" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="楼宇" name="building" :rules="[{ required: true, message: '请选择楼宇' }]">
                <a-select v-model:value="draft.building" :options="toOptions(parkBuildings)" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="房间 / 点位" name="room" :rules="[{ required: true, message: '请填写房间' }]">
                <a-input v-model:value="draft.room" placeholder="例如 A-1208" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="费用类型" name="type" :rules="[{ required: true, message: '请选择类型' }]">
                <a-select v-model:value="draft.type" :options="toOptions(billTypes)" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item
                label="账期"
                name="period"
                :rules="[
                  { required: true, message: '请填写账期' },
                  { pattern: /^\d{4}-\d{2}$/, message: '格式如 2026-10' },
                ]"
              >
                <a-input v-model:value="draft.period" placeholder="2026-10" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item label="应收金额" name="amount" :rules="[{ required: true, message: '请填写金额' }]">
                <a-input-number v-model:value="draft.amount" :min="0.01" :precision="2" style="width: 100%" prefix="¥" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item label="到期日" name="dueDate" :rules="[{ required: true, message: '请选择到期日' }]">
                <a-date-picker v-model:value="draft.dueDate" value-format="YYYY-MM-DD" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item label="联系人" name="contact" :rules="[{ required: true, message: '请填写联系人' }]">
                <a-input v-model:value="draft.contact" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="12">
              <a-form-item
                label="手机"
                name="phone"
                :rules="[
                  { required: true, message: '请填写手机' },
                  { pattern: /^1\d{10}$/, message: '请输入 11 位手机号' },
                ]"
              >
                <a-input v-model:value="draft.phone" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注" name="remark">
                <a-textarea v-model:value="draft.remark" :rows="3" placeholder="计费口径、合同条款，可留空" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-button type="primary" html-type="submit">生成账单</a-button>
        </a-form>
      </a-card>
    </template>
  </section>
</template>

<style scoped>
.form-card {
  max-width: 880px;
}
</style>

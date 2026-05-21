<script lang="ts" setup>
import type { RegisterApplyResp } from '@/api/labor/registerApply'
import { onMounted, ref } from 'vue'
import { approveRegisterApply, getRegisterApply, rejectRegisterApply } from '@/api/labor/registerApply'
import { navigateBackPlus } from '@/utils'
import DetailCard from '../../components/detail-card.vue'
import { display, formatDateRangeText, formatDateTimeMinute } from '../../utils'

const props = defineProps<{
  id?: number | string
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const detail = ref<RegisterApplyResp>()
const loading = ref(false)
const actionLoading = ref(false)
const rejectVisible = ref(false)
const rejectReason = ref('')

function handleBack() {
  navigateBackPlus('/pages-labor/register-apply/index')
}

function getRegisterTypeText(type?: number) {
  const map: Record<number, string> = {
    1: '个人',
    2: '企业',
  }
  return type === undefined || type === null ? '-' : map[type] || '未知'
}

function getStatusText(status?: number) {
  const map: Record<number, string> = {
    0: '待审核',
    1: '审核通过',
    2: '审核驳回',
  }
  return status === undefined || status === null ? '-' : map[status] || '未知'
}

function getStatusTagType(status?: number) {
  const map: Record<number, 'warning' | 'success' | 'danger'> = {
    0: 'warning',
    1: 'success',
    2: 'danger',
  }
  return status === undefined || status === null ? 'default' : map[status] || 'default'
}

async function getDetail() {
  const id = Number(props.id)
  if (!id) {
    return
  }
  loading.value = true
  try {
    detail.value = await getRegisterApply(id)
  } catch {
    uni.showToast({ title: '详情加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function backAfterSuccess(title: string) {
  uni.showToast({ title, icon: 'success' })
  setTimeout(() => {
    handleBack()
  }, 500)
}

function handleApprove() {
  if (!detail.value || actionLoading.value) {
    return
  }
  uni.showModal({
    title: '提示',
    content: '确认审核通过该注册申请吗？',
    success: async (res) => {
      if (!res.confirm || !detail.value) {
        return
      }
      actionLoading.value = true
      try {
        await approveRegisterApply(detail.value.id)
        backAfterSuccess('审核通过')
      } finally {
        actionLoading.value = false
      }
    },
  })
}

function openRejectPopup() {
  rejectReason.value = ''
  rejectVisible.value = true
}

async function handleReject() {
  if (!detail.value || actionLoading.value) {
    return
  }
  const reason = rejectReason.value.trim()
  if (!reason) {
    uni.showToast({ title: '请填写驳回原因', icon: 'none' })
    return
  }
  actionLoading.value = true
  try {
    await rejectRegisterApply({
      id: detail.value.id,
      rejectReason: reason,
    })
    rejectVisible.value = false
    backAfterSuccess('已驳回')
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <view class="yd-page-container">
    <wd-navbar
      title="注册审核详情"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <view v-if="loading && !detail" class="flex justify-center py-100rpx">
      <wd-loading />
    </view>
    <view
      v-else-if="detail"
      class="p-24rpx"
      :class="{ 'pb-180rpx': detail.status === 0 }"
    >
      <DetailCard
        title="账号信息"
        :items="[
          { label: '用户名', value: detail.username },
          { label: '昵称', value: detail.nickname },
          { label: '邮箱', value: detail.email },
          { label: '注册类型', value: getRegisterTypeText(detail.registerType) },
          { label: '租户名称', value: detail.tenantName },
        ]"
      />
      <DetailCard
        title="企业信息"
        :items="[
          { label: '企业名称', value: detail.enterpriseName },
          { label: '统一社会信用代码', value: detail.unifiedSocialCreditCode },
          { label: '注册地址', value: detail.registrationAddress },
          { label: '联系方式', value: detail.contactInfo },
          { label: '法定代表人', value: detail.legalRepresentative },
          { label: '资质等级', value: detail.laborSubcontractingQualificationLevel },
          { label: '资质有效期', value: formatDateRangeText(detail.qualificationValidityStart, detail.qualificationValidityEnd) },
          { label: '开户银行', value: detail.bankName },
          { label: '银行账号', value: detail.bankAccount },
        ]"
      />
      <DetailCard title="审核信息">
        <wd-cell title="状态">
          <wd-tag :type="getStatusTagType(detail.status)" plain>
            {{ getStatusText(detail.status) }}
          </wd-tag>
        </wd-cell>
        <wd-cell title="驳回原因" :value="display(detail.rejectReason)" />
        <wd-cell title="审核人" :value="display(detail.reviewUserId)" />
        <wd-cell title="审核时间" :value="formatDateTimeMinute(detail.reviewTime)" />
        <wd-cell title="申请时间" :value="formatDateTimeMinute(detail.createTime)" />
      </DetailCard>
    </view>
    <view v-else class="py-100rpx text-center">
      <wd-status-tip image="content" tip="暂无详情数据" />
    </view>

    <view
      v-if="detail?.status === 0"
      class="safe-area-inset-bottom fixed bottom-0 left-0 right-0 z-10 flex gap-24rpx bg-white p-24rpx"
    >
      <wd-button
        class="flex-1"
        type="primary"
        :loading="actionLoading"
        :disabled="actionLoading"
        @click="handleApprove"
      >
        审核通过
      </wd-button>
      <wd-button
        class="flex-1"
        type="error"
        plain
        :disabled="actionLoading"
        @click="openRejectPopup"
      >
        驳回
      </wd-button>
    </view>

    <wd-popup v-model="rejectVisible" position="bottom" custom-style="border-radius: 24rpx 24rpx 0 0;">
      <view class="safe-area-inset-bottom p-24rpx">
        <view class="mb-24rpx flex items-center justify-between">
          <text class="text-32rpx text-[#333] font-semibold">
            驳回原因
          </text>
          <wd-icon name="close" size="36rpx" @click="rejectVisible = false" />
        </view>
        <wd-textarea
          v-model="rejectReason"
          placeholder="请输入驳回原因"
          :maxlength="200"
          show-word-limit
          clearable
        />
        <view class="mt-32rpx flex gap-24rpx">
          <wd-button class="flex-1" plain :disabled="actionLoading" @click="rejectVisible = false">
            取消
          </wd-button>
          <wd-button class="flex-1" type="error" :loading="actionLoading" @click="handleReject">
            确认驳回
          </wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style lang="scss" scoped>
</style>

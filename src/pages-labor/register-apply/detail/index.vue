<script lang="ts" setup>
import type { RegisterApplyResp } from '@/api/labor/registerApply'
import { onMounted, ref } from 'vue'
import { approveRegisterApply, getRegisterApply, rejectRegisterApply } from '@/api/labor/registerApply'
import { navigateBackPlus } from '@/utils'
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
  <view class="yd-page-container min-h-screen bg-[#f5f6f8]">
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
      class="detail-page safe-area-inset-bottom px-24rpx pt-24rpx"
      :class="{ 'pb-180rpx': detail.status === 0, 'pb-40rpx': detail.status !== 0 }"
    >
      <view class="labor-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="p-24rpx">
          <view class="flex items-start justify-between gap-20rpx">
            <view class="min-w-0 flex-1">
              <view class="truncate text-36rpx text-[#1f2a37] font-semibold leading-46rpx">
                {{ display(detail.username) }}
              </view>
              <view class="mt-8rpx truncate text-26rpx text-[#7b8794] leading-38rpx">
                {{ display(detail.nickname) }}
              </view>
            </view>
            <wd-tag :type="getStatusTagType(detail.status)" plain>
              {{ getStatusText(detail.status) }}
            </wd-tag>
          </view>

          <view class="mt-22rpx rounded-16rpx bg-[#f7f9f8] px-22rpx py-20rpx">
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                注册类型
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ getRegisterTypeText(detail.registerType) }}
              </text>
            </view>
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                企业名称
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(detail.enterpriseName) }}
              </text>
            </view>
            <view class="flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                申请时间
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ formatDateTimeMinute(detail.createTime) }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>申请信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">用户名</text>
            <text class="detail-value">{{ display(detail.username) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">昵称</text>
            <text class="detail-value">{{ display(detail.nickname) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">邮箱</text>
            <text class="detail-value">{{ display(detail.email) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">注册类型</text>
            <text class="detail-value">{{ getRegisterTypeText(detail.registerType) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">租户名称</text>
            <text class="detail-value">{{ display(detail.tenantName) }}</text>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>企业信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">企业名称</text>
            <text class="detail-value">{{ display(detail.enterpriseName) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">信用代码</text>
            <text class="detail-value">{{ display(detail.unifiedSocialCreditCode) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">注册地址</text>
            <text class="detail-value">{{ display(detail.registrationAddress) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">联系方式</text>
            <text class="detail-value">{{ display(detail.contactInfo) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">法定代表人</text>
            <text class="detail-value">{{ display(detail.legalRepresentative) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">资质等级</text>
            <text class="detail-value">{{ display(detail.laborSubcontractingQualificationLevel) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">资质有效期</text>
            <text class="detail-value">{{ formatDateRangeText(detail.qualificationValidityStart, detail.qualificationValidityEnd) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">开户银行</text>
            <text class="detail-value">{{ display(detail.bankName) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">银行账号</text>
            <text class="detail-value">{{ display(detail.bankAccount) }}</text>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>审核信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">状态</text>
            <view class="min-w-0 flex-1">
              <wd-tag :type="getStatusTagType(detail.status)" plain>
                {{ getStatusText(detail.status) }}
              </wd-tag>
            </view>
          </view>
          <view class="detail-row">
            <text class="detail-label">驳回原因</text>
            <text class="detail-value">{{ display(detail.rejectReason) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">审核人</text>
            <text class="detail-value">{{ display(detail.reviewUserId) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">审核时间</text>
            <text class="detail-value">{{ formatDateTimeMinute(detail.reviewTime) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">申请时间</text>
            <text class="detail-value">{{ formatDateTimeMinute(detail.createTime) }}</text>
          </view>
        </view>
      </view>
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
.labor-card,
.detail-card {
  box-shadow: 0 10rpx 30rpx rgba(31, 42, 55, 0.08);
}

.detail-card-title {
  display: flex;
  align-items: center;
  padding: 24rpx 24rpx 8rpx;
  color: #1f2a37;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 44rpx;

  &::before {
    width: 6rpx;
    height: 28rpx;
    margin-right: 12rpx;
    border-radius: 999rpx;
    background: #018d71;
    content: '';
  }
}

.detail-row {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eef1f4;
  font-size: 28rpx;
  line-height: 40rpx;

  &:last-child {
    border-bottom: 0;
  }
}

.detail-label {
  width: 180rpx;
  flex-shrink: 0;
  color: #8a949e;
}

.detail-value {
  min-width: 0;
  flex: 1;
  color: #26323d;
  overflow-wrap: anywhere;
  word-break: break-all;
}
</style>

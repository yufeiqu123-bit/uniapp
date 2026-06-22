<script lang="ts" setup>
import type { EnterpriseCooperationResp } from '@/api/labor/enterpriseCooperation'
import { onMounted, ref } from 'vue'
import {
  getCooperationProjectListByCompanyId,
  getCurrentProjectListByCompanyId,
  getEnterpriseCooperation,
} from '@/api/labor/enterpriseCooperation'
import { navigateBackPlus } from '@/utils'
import SubListCard from '../../components/sub-list-card.vue'
import { display, formatDateRangeText } from '../../utils'

const props = defineProps<{
  id?: number | string
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const detail = ref<EnterpriseCooperationResp>()
const currentProjects = ref<Record<string, any>[]>([])
const cooperationProjects = ref<Record<string, any>[]>([])
const loading = ref(false)

const projectTitleKeys = ['projectName', 'projectDeptName', 'name', 'project']
const projectFields = [
  { label: '项目编号', keys: ['projectCode', 'code'] },
  { label: '项目名称', keys: ['projectName', 'projectDeptName', 'name', 'project'] },
  { label: '开始日期', keys: ['startDate', 'cooperationStartDate', 'beginDate'], type: 'date' as const },
  { label: '结束日期', keys: ['endDate', 'cooperationEndDate', 'finishDate'], type: 'date' as const },
  { label: '备注', keys: ['remark', 'description'] },
]

function handleBack() {
  navigateBackPlus('/pages-labor/enterprise-cooperation/index')
}

async function getDetail() {
  const id = Number(props.id)
  if (!id) {
    return
  }
  loading.value = true
  try {
    detail.value = await getEnterpriseCooperation(id)
    const companyId = detail.value?.id || id
    const [currentList, historyList] = await Promise.all([
      getCurrentProjectListByCompanyId(companyId),
      getCooperationProjectListByCompanyId(companyId),
    ])
    currentProjects.value = currentList || []
    cooperationProjects.value = historyList || []
  } catch {
    uni.showToast({ title: '详情加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <view class="yd-page-container min-h-screen bg-[#f5f6f8]">
    <wd-navbar
      title="企业合作详情"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <view v-if="loading && !detail" class="flex justify-center py-100rpx">
      <wd-loading />
    </view>
    <view v-else-if="detail" class="detail-page safe-area-inset-bottom px-24rpx pb-40rpx pt-24rpx">
      <view class="labor-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="p-24rpx">
          <view class="flex items-start justify-between gap-20rpx">
            <view class="min-w-0 flex-1 truncate text-36rpx text-[#1f2a37] font-semibold leading-46rpx">
              {{ display(detail.enterpriseName) }}
            </view>
            <view class="shrink-0 rounded-full bg-[#e8f6f2] px-18rpx py-6rpx text-24rpx text-[#018d71] font-medium leading-34rpx">
              合作企业
            </view>
          </view>

          <view class="mt-8rpx break-all text-26rpx text-[#7b8794] leading-38rpx">
            统一社会信用代码：{{ display(detail.unifiedSocialCreditCode) }}
          </view>

          <view class="mt-22rpx rounded-16rpx bg-[#f7f9f8] px-22rpx py-20rpx">
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                代理人
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(detail.agentName) }}
              </text>
            </view>
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                联系电话
              </text>
              <text class="min-w-0 flex-1 break-all text-[#26323d]">
                {{ display(detail.agentPhone) }}
              </text>
            </view>
            <view class="flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                授权期限
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ formatDateRangeText(detail.authorizationStartDate, detail.authorizationEndDate) }}
              </text>
            </view>
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
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>代理信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">代理人</text>
            <text class="detail-value">{{ display(detail.agentName) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">代理人电话</text>
            <text class="detail-value">{{ display(detail.agentPhone) }}</text>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>授权信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">授权有效期</text>
            <text class="detail-value">{{ formatDateRangeText(detail.authorizationStartDate, detail.authorizationEndDate) }}</text>
          </view>
        </view>
      </view>

      <view class="sub-list-card">
        <SubListCard
          title="当前合作项目"
          :list="currentProjects"
          :title-keys="projectTitleKeys"
          :fields="projectFields"
          item-prefix="项目"
        />
      </view>
      <view class="sub-list-card">
        <SubListCard
          title="历史合作项目"
          :list="cooperationProjects"
          :title-keys="projectTitleKeys"
          :fields="projectFields"
          item-prefix="项目"
        />
      </view>
    </view>
    <view v-else class="py-100rpx text-center">
      <wd-status-tip image="content" tip="暂无详情数据" />
    </view>
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

.sub-list-card {
  :deep(> view) {
    border-radius: 20rpx;
    box-shadow: 0 10rpx 30rpx rgba(31, 42, 55, 0.08);
  }

  :deep(> view > view:first-child) {
    display: flex;
    align-items: center;
    padding: 24rpx 24rpx 8rpx;
    border-bottom: 0;
  }

  :deep(> view > view:first-child::before) {
    width: 6rpx;
    height: 28rpx;
    margin-right: 12rpx;
    border-radius: 999rpx;
    background: #018d71;
    content: '';
  }

  :deep(> view > view:first-child text) {
    color: #1f2a37;
    font-size: 32rpx;
    line-height: 44rpx;
  }

  :deep(> view > view:nth-child(2)) {
    padding: 20rpx 24rpx 24rpx;
  }

  :deep(> view > view:nth-child(2) > view) {
    border-radius: 16rpx;
    background: #f7f9f8;
  }

  :deep(> view > view:nth-child(2) > view > view text:last-child) {
    text-align: left;
    overflow-wrap: anywhere;
    word-break: break-all;
  }
}
</style>

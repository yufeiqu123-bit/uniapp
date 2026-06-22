<script lang="ts" setup>
import type { TeamInfoResp } from '@/api/labor/teamInfo'
import { computed, onMounted, ref } from 'vue'
import {
  getCertifiedStatsByTeamId,
  getTeamConstructionRecordListByTeamId,
  getTeamInfo,
  getTeamProjectPerformanceListByTeamId,
} from '@/api/labor/teamInfo'
import { navigateBackPlus } from '@/utils'
import SubListCard from '../../components/sub-list-card.vue'
import { display } from '../../utils'

const props = defineProps<{
  id?: number | string
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const detail = ref<TeamInfoResp>()
const certifiedStats = ref<Record<string, any>>()
const constructionRecords = ref<Record<string, any>[]>([])
const projectPerformances = ref<Record<string, any>[]>([])
const loading = ref(false)

const constructionRecordTitleKeys = ['projectName', 'currentProject', 'constructionProject', 'name']
const constructionRecordFields = [
  { label: '项目名称', keys: ['projectName', 'currentProject', 'constructionProject', 'name'] },
  { label: '施工内容', keys: ['constructionContent', 'content', 'description'] },
  { label: '施工日期', keys: ['constructionDate', 'startDate', 'createTime'], type: 'date' as const },
  { label: '备注', keys: ['remark'] },
]
const performanceTitleKeys = ['projectName', 'performanceName', 'name']
const performanceFields = [
  { label: '项目名称', keys: ['projectName', 'performanceName', 'name'] },
  { label: '建设单位', keys: ['constructionUnit', 'unitName', 'builder'] },
  { label: '开始日期', keys: ['startDate', 'beginDate'], type: 'date' as const },
  { label: '结束日期', keys: ['endDate', 'finishDate'], type: 'date' as const },
  { label: '备注', keys: ['remark', 'description'] },
]

const certifiedStatsItems = computed(() => {
  const stats = certifiedStats.value || {}
  const knownItems = [
    { label: '持证人数', value: stats.certifiedCount ?? stats.certifiedNum ?? stats.holdCertificateCount },
    { label: '总人数', value: stats.totalCount ?? stats.totalNum ?? stats.laborCount },
    { label: '持证率', value: stats.certifiedRate ?? stats.rate },
  ]
  if (knownItems.some(item => item.value !== undefined && item.value !== null && item.value !== '')) {
    return knownItems
  }
  const dynamicItems = Object.keys(stats)
    .filter(key => ['string', 'number', 'boolean'].includes(typeof stats[key]))
    .slice(0, 6)
    .map(key => ({ label: key, value: stats[key] }))
  return dynamicItems.length > 0 ? dynamicItems : [{ label: '统计数据', value: '暂无数据' }]
})

function handleBack() {
  navigateBackPlus('/pages-labor/team-info/index')
}

async function getDetail() {
  const id = Number(props.id)
  if (!id) {
    return
  }
  loading.value = true
  try {
    detail.value = await getTeamInfo(id)
    const teamId = detail.value?.id || id
    const [stats, records, performances] = await Promise.all([
      getCertifiedStatsByTeamId(teamId),
      getTeamConstructionRecordListByTeamId(teamId),
      getTeamProjectPerformanceListByTeamId(teamId),
    ])
    certifiedStats.value = stats || {}
    constructionRecords.value = records || []
    projectPerformances.value = performances || []
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
      title="班组详情"
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
              {{ display(detail.teamName) }}
            </view>
            <view class="max-w-220rpx shrink-0 truncate rounded-full bg-[#e8f6f2] px-18rpx py-6rpx text-24rpx text-[#018d71] font-medium leading-34rpx">
              {{ display(detail.constructionType) }}
            </view>
          </view>

          <view class="mt-8rpx text-26rpx text-[#7b8794] leading-38rpx">
            负责人：{{ display(detail.leaderName) }}
          </view>
          <view class="mt-2rpx break-all text-26rpx text-[#7b8794] leading-38rpx">
            电话：{{ display(detail.leaderPhone) }}
          </view>

          <view class="mt-22rpx rounded-16rpx bg-[#f7f9f8] px-22rpx py-20rpx">
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                当前项目
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(detail.currentProject) }}
              </text>
            </view>
            <view class="flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                最大规模
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(detail.largestScale) }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>施工能力</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">从事行业</text>
            <text class="detail-value">{{ display(detail.engagedIndustry) }}</text>
          </view>
          <view class="detail-row border-0">
            <text class="detail-label">自有施工机具</text>
            <text class="detail-value">{{ display(detail.constructionMachinery) }}</text>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>持证人员统计</text>
        </view>
        <view class="px-24rpx">
          <view
            v-for="item in certifiedStatsItems"
            :key="item.label"
            class="detail-row"
          >
            <text class="detail-label">{{ item.label }}</text>
            <text class="detail-value">{{ display(item.value) }}</text>
          </view>
        </view>
      </view>

      <view class="sub-list-card">
        <SubListCard
          title="施工记录"
          :list="constructionRecords"
          :title-keys="constructionRecordTitleKeys"
          :fields="constructionRecordFields"
          item-prefix="施工记录"
        />
      </view>
      <view class="sub-list-card">
        <SubListCard
          title="近三年主要业绩"
          :list="projectPerformances"
          :title-keys="performanceTitleKeys"
          :fields="performanceFields"
          item-prefix="业绩"
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

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
import DetailCard from '../../components/detail-card.vue'
import SubListCard from '../../components/sub-list-card.vue'

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
  <view class="yd-page-container">
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
    <view v-else-if="detail" class="p-24rpx">
      <DetailCard
        title="基本信息"
        :items="[
          { label: '班组名称', value: detail.teamName },
          { label: '负责人', value: detail.leaderName },
          { label: '联系电话', value: detail.leaderPhone },
        ]"
      />
      <DetailCard
        title="施工能力"
        :items="[
          { label: '从事行业', value: detail.engagedIndustry },
          { label: '施工类别', value: detail.constructionType },
          { label: '最大组织规模', value: detail.largestScale },
          { label: '自有施工机具', value: detail.constructionMachinery },
        ]"
      />
      <DetailCard
        title="项目信息"
        :items="[
          { label: '所在项目', value: detail.currentProject },
        ]"
      />
      <DetailCard title="持证人员统计" :items="certifiedStatsItems" />
      <SubListCard
        title="施工记录"
        :list="constructionRecords"
        :title-keys="constructionRecordTitleKeys"
        :fields="constructionRecordFields"
        item-prefix="施工记录"
      />
      <SubListCard
        title="近三年主要业绩"
        :list="projectPerformances"
        :title-keys="performanceTitleKeys"
        :fields="performanceFields"
        item-prefix="业绩"
      />
    </view>
    <view v-else class="py-100rpx text-center">
      <wd-status-tip image="content" tip="暂无详情数据" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>

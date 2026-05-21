<script lang="ts" setup>
import type { EnterpriseCooperationResp } from '@/api/labor/enterpriseCooperation'
import { onMounted, ref } from 'vue'
import {
  getCooperationProjectListByCompanyId,
  getCurrentProjectListByCompanyId,
  getEnterpriseCooperation,
} from '@/api/labor/enterpriseCooperation'
import { navigateBackPlus } from '@/utils'
import DetailCard from '../../components/detail-card.vue'
import SubListCard from '../../components/sub-list-card.vue'
import { formatDateRangeText } from '../../utils'

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
  <view class="yd-page-container">
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
    <view v-else-if="detail" class="p-24rpx">
      <DetailCard
        title="基本信息"
        :items="[
          { label: '企业名称', value: detail.enterpriseName },
          { label: '统一社会信用代码', value: detail.unifiedSocialCreditCode },
        ]"
      />
      <DetailCard
        title="代理信息"
        :items="[
          { label: '代理人', value: detail.agentName },
          { label: '代理人电话', value: detail.agentPhone },
          { label: '授权有效期', value: formatDateRangeText(detail.authorizationStartDate, detail.authorizationEndDate) },
        ]"
      />
      <SubListCard
        title="当前合作项目"
        :list="currentProjects"
        :title-keys="projectTitleKeys"
        :fields="projectFields"
        item-prefix="项目"
      />
      <SubListCard
        title="历史合作项目"
        :list="cooperationProjects"
        :title-keys="projectTitleKeys"
        :fields="projectFields"
        item-prefix="项目"
      />
    </view>
    <view v-else class="py-100rpx text-center">
      <wd-status-tip image="content" tip="暂无详情数据" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>

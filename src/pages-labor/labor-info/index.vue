<script lang="ts" setup>
import type { LaborInfoPageReq, LaborInfoResp } from '@/api/labor/laborInfo'
import type { LoadMoreState } from '@/http/types'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getLaborInfoPage } from '@/api/labor/laborInfo'
import { navigateBackPlus } from '@/utils'
import SearchForm from '../components/search-form.vue'
import { display } from '../utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
  },
})

const searchFields = [
  { key: 'name', label: '姓名', placeholder: '请输入姓名' },
  { key: 'phone', label: '手机号', placeholder: '请输入手机号' },
  { key: 'workType', label: '工种', placeholder: '请输入工种' },
]

const total = ref(0)
const list = ref<LaborInfoResp[]>([])
const loading = ref(false)
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref<LaborInfoPageReq>({
  pageNo: 1,
  pageSize: 10,
})

function handleBack() {
  navigateBackPlus()
}

async function getList() {
  if (loading.value) {
    return
  }
  loading.value = true
  loadMoreState.value = 'loading'
  try {
    const data = await getLaborInfoPage(queryParams.value)
    list.value = queryParams.value.pageNo === 1 ? data.list : [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch {
    queryParams.value.pageNo = queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
    loadMoreState.value = 'error'
    uni.showToast({ title: '加载失败，请稍后重试', icon: 'none' })
  } finally {
    loading.value = false
    uni.stopPullDownRefresh()
  }
}

function handleQuery(data?: Record<string, any>) {
  queryParams.value = {
    ...data,
    pageNo: 1,
    pageSize: queryParams.value.pageSize,
  }
  list.value = []
  getList()
}

function handleReset() {
  handleQuery()
}

function loadMore() {
  if (loading.value || loadMoreState.value === 'finished') {
    return
  }
  queryParams.value.pageNo++
  getList()
}

function handleDetail(item: LaborInfoResp) {
  uni.navigateTo({
    url: `/pages-labor/labor-info/detail/index?id=${item.id}`,
  })
}

onReachBottom(() => {
  loadMore()
})

onPullDownRefresh(() => {
  queryParams.value.pageNo = 1
  list.value = []
  getList()
})

onMounted(() => {
  getList()
})
</script>

<template>
  <view class="yd-page-container">
    <wd-navbar
      title="劳务人员管理"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <SearchForm
      :fields="searchFields"
      placeholder="搜索劳务人员"
      @search="handleQuery"
      @reset="handleReset"
    />

    <view class="p-24rpx">
      <view
        v-for="item in list"
        :key="item.id"
        class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm"
        @click="handleDetail(item)"
      >
        <view class="p-24rpx">
          <view class="mb-16rpx flex items-start justify-between">
            <view class="text-32rpx text-[#333] font-semibold">
              {{ display(item.name) }}
            </view>
            <wd-tag type="primary" plain>
              {{ display(item.workType) }}
            </wd-tag>
          </view>
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">
              手机号：
            </text>
            <text class="mr-24rpx">{{ display(item.phone) }}</text>
            <text class="mr-8rpx text-[#999]">
              性别：
            </text>
            <text>{{ display(item.gender) }}</text>
          </view>
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">
              当前项目：
            </text>
            <text>{{ display(item.currentProject) }}</text>
          </view>
          <view class="flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">
              所属班组：
            </text>
            <text>{{ display(item.teamName || item.teamId) }}</text>
          </view>
        </view>
      </view>

      <view v-if="loading && list.length === 0" class="flex justify-center py-100rpx">
        <wd-loading />
      </view>
      <view v-else-if="list.length === 0" class="py-100rpx text-center">
        <wd-status-tip image="content" tip="暂无劳务人员数据" />
      </view>
      <wd-loadmore
        v-if="list.length > 0"
        :state="loadMoreState"
        @reload="loadMore"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>

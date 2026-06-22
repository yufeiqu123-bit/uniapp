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
  <view class="yd-page-container min-h-screen bg-[#f5f6f8]">
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

    <view class="safe-area-inset-bottom px-24rpx pb-40rpx pt-24rpx">
      <view
        v-for="item in list"
        :key="item.id"
        class="labor-card mb-24rpx overflow-hidden rounded-20rpx bg-white"
        @click="handleDetail(item)"
      >
        <view class="p-24rpx">
          <view class="flex items-start justify-between gap-20rpx">
            <view class="min-w-0 flex-1 truncate text-34rpx text-[#1f2a37] font-semibold leading-44rpx">
              {{ display(item.name) }}
            </view>
            <view class="max-w-220rpx shrink-0 truncate rounded-full bg-[#e8f6f2] px-18rpx py-6rpx text-24rpx text-[#018d71] font-medium leading-34rpx">
              {{ display(item.workType, '未填写') }}
            </view>
          </view>

          <view class="mt-8rpx text-26rpx text-[#7b8794] leading-38rpx">
            {{ display(item.phone) }}
          </view>

          <view class="mt-22rpx rounded-16rpx bg-[#f7f9f8] px-22rpx py-20rpx">
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                当前项目
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(item.currentProject) }}
              </text>
            </view>
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                所属班组
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(item.teamName || item.teamId) }}
              </text>
            </view>
            <view class="flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                性别
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(item.gender) }}
              </text>
            </view>
          </view>

          <view class="mt-24rpx flex justify-end border-t border-[#eef1f4] pt-18rpx">
            <text class="text-28rpx text-[#018d71] font-medium leading-40rpx">
              查看详情 &gt;
            </text>
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
.labor-card {
  box-shadow: 0 10rpx 30rpx rgba(31, 42, 55, 0.08);
}
</style>

<script lang="ts" setup>
import type { TeamInfoPageReq, TeamInfoResp } from '@/api/labor/teamInfo'
import type { LoadMoreState } from '@/http/types'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getTeamInfoPage } from '@/api/labor/teamInfo'
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
  { key: 'teamName', label: '班组名称', placeholder: '请输入班组名称' },
  { key: 'leaderName', label: '负责人', placeholder: '请输入负责人' },
]

const total = ref(0)
const list = ref<TeamInfoResp[]>([])
const loading = ref(false)
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref<TeamInfoPageReq>({
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
    const data = await getTeamInfoPage(queryParams.value)
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

function handleDetail(item: TeamInfoResp) {
  uni.navigateTo({
    url: `/pages-labor/team-info/detail/index?id=${item.id}`,
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
      title="劳务班组管理"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <SearchForm
      :fields="searchFields"
      placeholder="搜索班组"
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
              {{ display(item.teamName) }}
            </view>
            <view class="max-w-220rpx shrink-0 truncate rounded-full bg-[#e8f6f2] px-18rpx py-6rpx text-24rpx text-[#018d71] font-medium leading-34rpx">
              {{ display(item.constructionType, '未填写') }}
            </view>
          </view>

          <view class="mt-8rpx text-26rpx text-[#7b8794] leading-38rpx">
            <text>
              负责人：{{ display(item.leaderName) }}
            </text>
          </view>
          <view class="mt-2rpx text-26rpx text-[#7b8794] leading-38rpx">
            <text>
              电话：{{ display(item.leaderPhone) }}
            </text>
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
            <view class="flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                最大规模
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(item.largestScale) }}
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
        <wd-status-tip image="content" tip="暂无班组数据" />
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

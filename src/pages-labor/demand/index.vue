<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="劳务需求"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 搜索组件 -->
    <SearchForm @search="handleQuery" @reset="handleReset" />

    <!-- 需求列表 -->
    <view class="p-24rpx">
      <view
        v-for="item in list"
        :key="item.id"
        class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm"
        @click="handleDetail(item)"
      >
        <view class="p-24rpx">
          <!-- 头部：编号 + 状态 -->
          <view class="mb-16rpx flex items-center justify-between">
            <view class="text-32rpx text-[#333] font-semibold">
              {{ item.code }}
            </view>
            <view
              class="rounded-8rpx px-16rpx py-4rpx text-24rpx"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusText(item.status) }}
            </view>
          </view>

          <!-- 项目部 -->
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">发起项目部：</text>
            <text>{{ item.projectName }}</text>
          </view>

          <!-- 工种 + 人数 -->
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">所需工种：</text>
            <text class="mr-24rpx">{{ item.trade }}</text>
            <text class="mr-8rpx text-[#999]">需求人数：</text>
            <text class="text-[#1890ff]">{{ item.needNum }}人</text>
          </view>

          <!-- 工期 -->
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">工期：</text>
            <text>{{ formatDate(item.startDate) }} 至 {{ formatDate(item.endDate) }}</text>
          </view>

          <!-- 工龄要求 -->
          <view class="flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">工龄要求：</text>
            <text>{{ item.workAge ? `${item.workAge}年以上` : '不限' }}</text>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="loadMoreState !== 'loading' && list.length === 0" class="py-100rpx text-center">
        <wd-status-tip image="content" tip="暂无需求数据" />
      </view>
      <wd-loadmore
        v-if="list.length > 0"
        :state="loadMoreState"
        @reload="loadMore"
      />
    </view>

    <!-- 新增按钮 -->
    <wd-fab
      position="right-bottom"
      type="primary"
      :expandable="false"
      @click="handleAdd"
    />
  </view>
</template>

<script lang="ts" setup>
import type { DemandVO } from '@/api/labor/demand'
import type { LoadMoreState } from '@/http/types'
import { onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getDemandPage } from '@/api/labor/demand'
import { navigateBackPlus } from '@/utils'
import SearchForm from './components/search-form.vue'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const total = ref(0)
const list = ref<DemandVO[]>([])
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
})

/** 返回上一页 */
function handleBack() {
  navigateBackPlus()
}

/** 状态样式 */
function getStatusClass(status: number) {
  const map: Record<number, string> = {
    0: 'bg-[#e6f7ff] text-[#1890ff]', // 待处理
    1: 'bg-[#f6ffed] text-[#52c41a]', // 已完成
    2: 'bg-[#fff7e6] text-[#fa8c16]', // 匹配中
    3: 'bg-[#f5f5f5] text-[#999]', // 已关闭
  }
  return map[status] || 'bg-[#f5f5f5] text-[#999]'
}

/** 状态文本 */
function getStatusText(status: number) {
  const map: Record<number, string> = {
    0: '待处理',
    1: '已完成',
    2: '匹配中',
    3: '已关闭',
  }
  return map[status] || '未知'
}

/** 格式化日期 */
function formatDate(dateStr: string) {
  if (!dateStr)
    return '-'
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** 查询列表 */
async function getList() {
  loadMoreState.value = 'loading'
  try {
    const params = { ...queryParams.value }
    if ((params as any).status === -1) {
      delete (params as any).status
    }
    const data = await getDemandPage(params)
    list.value = [...list.value, ...data.list]
    total.value = data.total
    loadMoreState.value = list.value.length >= total.value ? 'finished' : 'loading'
  } catch {
    queryParams.value.pageNo = queryParams.value.pageNo > 1 ? queryParams.value.pageNo - 1 : 1
    loadMoreState.value = 'error'
  }
}

/** 搜索按钮操作 */
function handleQuery(data?: Record<string, any>) {
  queryParams.value = {
    ...data,
    pageNo: 1,
    pageSize: queryParams.value.pageSize,
  }
  list.value = []
  getList()
}

/** 重置按钮操作 */
function handleReset() {
  handleQuery()
}

/** 加载更多 */
function loadMore() {
  if (loadMoreState.value === 'finished') {
    return
  }
  queryParams.value.pageNo++
  getList()
}

/** 新增需求 */
function handleAdd() {
  uni.navigateTo({
    url: '/pages-labor/demand/form/index',
  })
}

/** 查看详情 */
function handleDetail(item: DemandVO) {
  uni.navigateTo({
    url: `/pages-labor/demand/detail/index?id=${item.id}`,
  })
}

/** 触底加载更多 */
onReachBottom(() => {
  loadMore()
})

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
</style>

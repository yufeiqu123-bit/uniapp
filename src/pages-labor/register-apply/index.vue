<script lang="ts" setup>
import type { RegisterApplyPageReq, RegisterApplyResp } from '@/api/labor/registerApply'
import type { LoadMoreState } from '@/http/types'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getRegisterApplyPage } from '@/api/labor/registerApply'
import { navigateBackPlus } from '@/utils'
import SearchForm from '../components/search-form.vue'
import { display, formatDateTimeMinute } from '../utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
  },
})

const searchFields = [
  { key: 'username', label: '用户名', placeholder: '请输入用户名' },
  { key: 'enterpriseName', label: '企业名称', placeholder: '请输入企业名称' },
  {
    key: 'status',
    label: '审核状态',
    type: 'radio' as const,
    defaultValue: -1,
    options: [
      { label: '全部', value: -1 },
      { label: '待审核', value: 0 },
      { label: '审核通过', value: 1 },
      { label: '审核驳回', value: 2 },
    ],
  },
]

const total = ref(0)
const list = ref<RegisterApplyResp[]>([])
const loading = ref(false)
const loadMoreState = ref<LoadMoreState>('loading')
const queryParams = ref<RegisterApplyPageReq>({
  pageNo: 1,
  pageSize: 10,
})

function handleBack() {
  navigateBackPlus()
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

async function getList() {
  if (loading.value) {
    return
  }
  loading.value = true
  loadMoreState.value = 'loading'
  try {
    const data = await getRegisterApplyPage(queryParams.value)
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

function handleDetail(item: RegisterApplyResp) {
  uni.navigateTo({
    url: `/pages-labor/register-apply/detail/index?id=${item.id}`,
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
      title="注册信息审核"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <SearchForm
      :fields="searchFields"
      placeholder="搜索注册申请"
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
            <view class="min-w-0 flex-1">
              <view class="truncate text-34rpx text-[#1f2a37] font-semibold leading-44rpx">
                {{ display(item.username) }}
              </view>
              <view class="mt-8rpx truncate text-26rpx text-[#7b8794] leading-38rpx">
                {{ display(item.nickname) }}
              </view>
            </view>
            <wd-tag :type="getStatusTagType(item.status)" plain>
              {{ getStatusText(item.status) }}
            </wd-tag>
          </view>

          <view class="mt-22rpx rounded-16rpx bg-[#f7f9f8] px-22rpx py-20rpx">
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                注册类型
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ getRegisterTypeText(item.registerType) }}
              </text>
            </view>
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                企业名称
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(item.enterpriseName) }}
              </text>
            </view>
            <view class="flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                申请时间
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ formatDateTimeMinute(item.createTime) }}
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
        <wd-status-tip image="content" tip="暂无注册申请" />
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

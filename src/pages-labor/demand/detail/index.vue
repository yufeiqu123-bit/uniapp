<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="需求详情"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 详情内容 -->
    <view v-if="detail" class="p-24rpx pb-200rpx">
      <!-- 基本信息卡片 -->
      <view class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm">
        <view class="border-b border-[#f5f5f5] px-24rpx py-20rpx">
          <text class="text-32rpx text-[#333] font-semibold">基本信息</text>
        </view>
        <view class="p-24rpx">
          <view class="mb-20rpx flex items-center justify-between">
            <text class="text-28rpx text-[#999]">需求编号</text>
            <text class="text-28rpx text-[#333]">{{ detail.code }}</text>
          </view>
          <view class="mb-20rpx flex items-center justify-between">
            <text class="text-28rpx text-[#999]">发起项目部</text>
            <text class="text-28rpx text-[#333]">{{ detail.projectName }}</text>
          </view>
          <view class="flex items-center justify-between">
            <text class="text-28rpx text-[#999]">状态</text>
            <view
              class="rounded-8rpx px-16rpx py-4rpx text-24rpx"
              :class="getStatusClass(detail.status)"
            >
              {{ getStatusText(detail.status) }}
            </view>
          </view>
        </view>
      </view>

      <!-- 需求信息卡片 -->
      <view class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm">
        <view class="border-b border-[#f5f5f5] px-24rpx py-20rpx">
          <text class="text-32rpx text-[#333] font-semibold">需求信息</text>
        </view>
        <view class="p-24rpx">
          <view class="mb-20rpx flex items-center justify-between">
            <text class="text-28rpx text-[#999]">所需工种</text>
            <text class="text-28rpx text-[#333]">{{ detail.trade }}</text>
          </view>
          <view class="mb-20rpx flex items-center justify-between">
            <text class="text-28rpx text-[#999]">需求人数</text>
            <text class="text-28rpx text-[#1890ff] font-semibold">{{ detail.needNum }}人</text>
          </view>
          <view class="mb-20rpx flex items-center justify-between">
            <text class="text-28rpx text-[#999]">工龄要求</text>
            <text class="text-28rpx text-[#333]">{{ detail.workAge ? `${detail.workAge}年以上` : '不限' }}</text>
          </view>
          <view class="mb-20rpx flex items-center justify-between">
            <text class="text-28rpx text-[#999]">工期开始</text>
            <text class="text-28rpx text-[#333]">{{ formatDate(detail.startDate) }}</text>
          </view>
          <view class="flex items-center justify-between">
            <text class="text-28rpx text-[#999]">工期结束</text>
            <text class="text-28rpx text-[#333]">{{ formatDate(detail.endDate) }}</text>
          </view>
        </view>
      </view>

      <!-- 时间信息卡片 -->
      <view class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm">
        <view class="border-b border-[#f5f5f5] px-24rpx py-20rpx">
          <text class="text-32rpx text-[#333] font-semibold">其他信息</text>
        </view>
        <view class="p-24rpx">
          <view class="flex items-center justify-between">
            <text class="text-28rpx text-[#999]">创建时间</text>
            <text class="text-28rpx text-[#333]">{{ formatDateTime(detail.createTime) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-else class="flex items-center justify-center py-100rpx">
      <wd-loading />
    </view>

    <!-- 底部操作按钮 -->
    <view v-if="detail" class="safe-area-inset-bottom fixed bottom-0 left-0 right-0 flex gap-24rpx bg-white p-24rpx">
      <wd-button
        v-if="detail.status === 0"
        block
        type="primary"
        @click="handleMatch"
      >
        人员匹配
      </wd-button>
      <wd-button
        v-if="detail.status === 0"
        block
        type="info"
        @click="handleEdit"
      >
        编辑
      </wd-button>
      <wd-button
        v-if="detail.status === 0"

        type="error"
        plain block
        @click="handleDelete"
      >
        删除
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { DemandVO } from '@/api/labor/demand'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { deleteDemand, getDemand } from '@/api/labor/demand'
import { navigateBackPlus } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const id = ref<number>(0)
const detail = ref<DemandVO | null>(null)

/** 返回上一页 */
function handleBack() {
  navigateBackPlus()
}

/** 状态样式 */
function getStatusClass(status: number) {
  const map: Record<number, string> = {
    0: 'bg-[#e6f7ff] text-[#1890ff]',
    1: 'bg-[#f6ffed] text-[#52c41a]',
    2: 'bg-[#fff7e6] text-[#fa8c16]',
    3: 'bg-[#f5f5f5] text-[#999]',
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

/** 格式化日期时间 */
function formatDateTime(dateStr: string) {
  if (!dateStr)
    return '-'
  const date = new Date(dateStr)
  return `${formatDate(dateStr)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** 获取详情 */
async function getDetail() {
  try {
    detail.value = await getDemand(id.value)
  } catch (e) {
    console.error('获取详情失败', e)
  }
}

/** 人员匹配 */
function handleMatch() {
  uni.navigateTo({
    url: `/pages-labor/match/result/index?demandId=${id.value}`,
  })
}

/** 编辑 */
function handleEdit() {
  uni.navigateTo({
    url: `/pages-labor/demand/form/index?id=${id.value}`,
  })
}

/** 删除 */
function handleDelete() {
  uni.showModal({
    title: '提示',
    content: '确定要删除该需求吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteDemand(id.value)
          uni.showToast({ title: '删除成功', icon: 'success' })
          setTimeout(() => {
            navigateBackPlus()
          }, 1500)
        } catch (e) {
          console.error('删除失败', e)
        }
      }
    },
  })
}

/** 页面加载 */
onLoad((options) => {
  if (options?.id) {
    id.value = Number(options.id)
    getDetail()
  }
})
</script>

<style lang="scss" scoped>
</style>

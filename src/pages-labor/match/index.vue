<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="人员匹配"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 提示信息 -->
    <view class="bg-[#e6f7ff] px-24rpx py-20rpx">
      <text class="text-26rpx text-[#1890ff]">请选择需要匹配人员的劳务需求</text>
    </view>

    <!-- 需求列表 -->
    <view class="p-24rpx">
      <view
        v-for="item in list"
        :key="item.id"
        class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm"
        @click="handleMatch(item)"
      >
        <view class="p-24rpx">
          <!-- 头部：编号 -->
          <view class="mb-16rpx flex items-center justify-between">
            <view class="text-32rpx text-[#333] font-semibold">
              {{ item.code }}
            </view>
            <view class="flex items-center text-[#1890ff]">
              <text class="text-26rpx">去匹配</text>
              <text class="ml-8rpx text-28rpx">→</text>
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
            <text class="mr-24rpx text-[#333] font-medium">{{ item.trade }}</text>
            <text class="mr-8rpx text-[#999]">需求人数：</text>
            <text class="text-[#1890ff] font-semibold">{{ item.needNum }}人</text>
          </view>

          <!-- 工期 -->
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">工期：</text>
            <text>{{ item.startDate }} 至 {{ item.endDate }}</text>
          </view>

          <!-- 工龄要求 -->
          <view class="flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">工龄要求：</text>
            <text>{{ item.workAge ? `${item.workAge}年以上` : '不限' }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="py-100rpx text-center">
        <wd-status-tip image="content" tip="暂无待匹配的需求" />
      </view>

      <!-- 加载中 -->
      <view v-if="loading" class="flex items-center justify-center py-100rpx">
        <wd-loading />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { MatchDemandVO } from '@/api/labor/match'
import { onMounted, ref } from 'vue'
import { getMatchDemandList } from '@/api/labor/match'
import { navigateBackPlus } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const loading = ref(false)
const list = ref<MatchDemandVO[]>([])

/** 返回上一页 */
function handleBack() {
  navigateBackPlus()
}

/** 获取待匹配需求列表 */
async function getList() {
  loading.value = true
  try {
    list.value = await getMatchDemandList()
  } catch (e) {
    console.error('获取列表失败', e)
  } finally {
    loading.value = false
  }
}

/** 去匹配 */
function handleMatch(item: MatchDemandVO) {
  uni.navigateTo({
    url: `/pages-labor/match/result/index?demandId=${item.id}`,
  })
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
</style>

<template>
  <view class="reminder-card mx-20rpx mt-20rpx rounded-20rpx bg-white px-24rpx py-22rpx" @click="handleClick">
    <view class="flex items-start justify-between">
      <view class="min-w-0 flex flex-1 items-start">
        <view class="reminder-icon h-68rpx w-68rpx flex items-center justify-center rounded-18rpx">
          <wd-icon name="notification" size="36rpx" color="#018d71" />
        </view>
        <view class="ml-18rpx min-w-0 flex-1">
          <view class="flex items-center">
            <text class="text-30rpx text-#222 font-600">
              今日提醒
            </text>
            <text class="ml-12rpx rounded-full bg-#e8f7f2 px-12rpx py-4rpx text-20rpx text-#018d71">
              {{ reminderItems.length }}项
            </text>
          </view>
          <view class="mt-12rpx">
            <view
              v-for="item in reminderItems"
              :key="item"
              class="reminder-line flex items-center"
            >
              <view class="mr-10rpx h-8rpx w-8rpx flex-shrink-0 rounded-full bg-#018d71" />
              <text class="text-25rpx text-#666">
                {{ item }}
              </text>
            </view>
          </view>
        </view>
      </view>
      <view class="ml-16rpx flex items-center pt-6rpx text-24rpx text-#018d71">
        查看
        <wd-icon name="arrow-right" size="26rpx" color="#018d71" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'HomeBanner',
})

const reminderItems = [
  '有注册信息待审核，请及时处理',
  '有劳务需求待调配',
]

/** 处理点击 */
function handleClick() {
  console.log('查看今日提醒')
}
</script>

<style lang="scss" scoped>
.reminder-card {
  box-shadow: 0 8rpx 22rpx rgba(15, 35, 31, 0.05);
}

.reminder-icon {
  background: #eefaf6;
}

.reminder-line + .reminder-line {
  margin-top: 8rpx;
}
</style>

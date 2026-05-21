<script lang="ts" setup>
import { display } from '../utils'

interface DetailItem {
  label: string
  value?: any
}

defineProps<{
  title: string
  items?: DetailItem[]
}>()
</script>

<template>
  <view class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm">
    <view class="border-b border-[#f5f5f5] px-24rpx py-20rpx">
      <text class="text-32rpx text-[#333] font-semibold">
        {{ title }}
      </text>
    </view>
    <wd-cell-group border>
      <wd-cell
        v-for="item in items"
        :key="item.label"
        :title="item.label"
        :value="display(item.value)"
      />
      <slot />
    </wd-cell-group>
  </view>
</template>

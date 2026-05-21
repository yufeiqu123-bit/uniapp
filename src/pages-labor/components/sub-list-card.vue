<script lang="ts" setup>
import { display, formatDateText, formatDateTimeMinute, getItemTitle, getValue } from '../utils'

interface SubListField {
  label: string
  keys: string[]
  type?: 'date' | 'datetime'
}

const props = withDefaults(defineProps<{
  title: string
  list?: Record<string, any>[]
  fields: SubListField[]
  titleKeys: string[]
  itemPrefix?: string
}>(), {
  list: () => [],
  itemPrefix: '记录',
})

function formatField(item: Record<string, any>, field: SubListField) {
  const value = getValue(item, field.keys)
  if (field.type === 'date') {
    return formatDateText(value)
  }
  if (field.type === 'datetime') {
    return formatDateTimeMinute(value)
  }
  return display(value)
}

function getTitle(item: Record<string, any>, index: number) {
  return getItemTitle(item, props.titleKeys, index, props.itemPrefix)
}
</script>

<template>
  <view class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm">
    <view class="border-b border-[#f5f5f5] px-24rpx py-20rpx">
      <text class="text-32rpx text-[#333] font-semibold">
        {{ title }}
      </text>
    </view>
    <view class="p-24rpx">
      <view v-if="list.length === 0" class="py-32rpx text-center text-26rpx text-[#999]">
        暂无数据
      </view>
      <view
        v-for="(item, index) in list"
        :key="item.id || index"
        class="mb-20rpx rounded-8rpx bg-[#f8f9fb] p-20rpx last:mb-0"
      >
        <view class="mb-12rpx text-28rpx text-[#333] font-semibold">
          {{ getTitle(item, index) }}
        </view>
        <view
          v-for="field in fields"
          :key="field.label"
          class="mb-8rpx flex items-start justify-between text-26rpx last:mb-0"
        >
          <text class="mr-24rpx shrink-0 text-[#999]">
            {{ field.label }}
          </text>
          <text class="min-w-0 flex-1 text-right text-[#333]">
            {{ formatField(item, field) }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

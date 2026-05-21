<template>
  <view class="bg-white px-24rpx py-16rpx">
    <!-- 搜索框 -->
    <wd-search
      v-model="searchValue"
      placeholder="搜索需求编号/项目部"
      hide-cancel
      @search="handleSearch"
      @clear="handleClear"
    />

    <!-- 筛选条件 -->
    <view class="mt-16rpx flex items-center gap-16rpx">
      <!-- 状态筛选 -->
      <wd-drop-menu>
        <wd-drop-menu-item
          v-model="status"
          :options="statusOptions"
          @change="handleStatusChange"
        />
      </wd-drop-menu>

      <!-- 工种筛选 -->
      <wd-drop-menu>
        <wd-drop-menu-item
          v-model="trade"
          :options="tradeOptions"
          @change="handleTradeChange"
        />
      </wd-drop-menu>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'search', data: Record<string, any>): void
  (e: 'reset'): void
}>()

const searchValue = ref('')
const status = ref(-1)
const trade = ref('')

/** 状态选项 */
const statusOptions = [
  { label: '全部状态', value: -1 },
  { label: '待处理', value: 0 },
  { label: '匹配中', value: 2 },
  { label: '已完成', value: 1 },
  { label: '已关闭', value: 3 },
]

/** 工种选项 */
const tradeOptions = [
  { label: '全部工种', value: '' },
  { label: '钢筋工', value: '钢筋工' },
  { label: '木工', value: '木工' },
  { label: '混凝土工', value: '混凝土工' },
  { label: '架子工', value: '架子工' },
  { label: '电焊工', value: '电焊工' },
  { label: '水电工', value: '水电工' },
  { label: '瓦工', value: '瓦工' },
  { label: '油漆工', value: '油漆工' },
]

/** 执行搜索 */
function doSearch() {
  const params: Record<string, any> = {}
  if (searchValue.value) {
    params.code = searchValue.value
    params.projectName = searchValue.value
  }
  if (status.value !== -1) {
    params.status = status.value
  }
  if (trade.value) {
    params.trade = trade.value
  }
  emit('search', params)
}

/** 搜索框搜索 */
function handleSearch() {
  doSearch()
}

/** 清空搜索 */
function handleClear() {
  searchValue.value = ''
  doSearch()
}

/** 状态变化 */
function handleStatusChange() {
  doSearch()
}

/** 工种变化 */
function handleTradeChange() {
  doSearch()
}
</script>

<style lang="scss" scoped>
</style>

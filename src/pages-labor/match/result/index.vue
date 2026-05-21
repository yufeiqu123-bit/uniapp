<template>
  <view class="yd-page-container pb-150rpx">
    <!-- 顶部导航栏 -->
    <wd-navbar
      title="匹配结果"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 筛选条件 -->
    <view class="bg-white px-24rpx py-16rpx">
      <view class="flex items-center gap-16rpx">
        <!-- 诚信等级筛选 -->
        <wd-drop-menu>
          <wd-drop-menu-item
            v-model="creditLevel"
            :options="creditLevelOptions"
            @change="handleFilter"
          />
        </wd-drop-menu>

        <!-- 调配时间筛选 -->
        <wd-drop-menu>
          <wd-drop-menu-item
            v-model="deployTime"
            :options="deployTimeOptions"
            @change="handleFilter"
          />
        </wd-drop-menu>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="bg-[#f6ffed] px-24rpx py-16rpx">
      <text class="text-26rpx text-[#52c41a]">
        共匹配到 {{ list.length }} 人，已选择 {{ selectedIds.length }} 人
      </text>
    </view>

    <!-- 人员列表 -->
    <view class="p-24rpx">
      <view
        v-for="item in list"
        :key="item.id"
        class="mb-24rpx overflow-hidden rounded-12rpx bg-white shadow-sm"
        :class="{ 'ring-2 ring-[#1890ff]': selectedIds.includes(item.idCard) }"
        @click="toggleSelect(item)"
      >
        <view class="p-24rpx">
          <!-- 头部：姓名 + 状态 -->
          <view class="mb-16rpx flex items-center justify-between">
            <view class="flex items-center">
              <!-- 选中状态 -->
              <view
                class="mr-16rpx h-40rpx w-40rpx flex items-center justify-center border-2 rounded-full"
                :class="selectedIds.includes(item.idCard)
                  ? 'border-[#1890ff] bg-[#1890ff]'
                  : 'border-[#ddd] bg-white'"
              >
                <text v-if="selectedIds.includes(item.idCard)" class="text-24rpx text-white">✓</text>
              </view>
              <text class="text-32rpx text-[#333] font-semibold">{{ item.name }}</text>
            </view>
            <view
              class="rounded-8rpx px-16rpx py-4rpx text-24rpx"
              :class="item.status === 1 ? 'bg-[#f6ffed] text-[#52c41a]' : 'bg-[#fff7e6] text-[#fa8c16]'"
            >
              {{ item.statusText }}
            </view>
          </view>

          <!-- 身份证号 -->
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">身份证号：</text>
            <text>{{ item.idCard }}</text>
          </view>

          <!-- 诚信等级 + 可调配时间 -->
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">诚信等级：</text>
            <text class="mr-24rpx text-[#52c41a]">{{ item.creditLevel }}</text>
            <text class="mr-8rpx text-[#999]">可调配：</text>
            <text>{{ item.deployTime }}</text>
          </view>

          <!-- 特种证书 -->
          <view class="mb-12rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">特种证编号：</text>
            <text>{{ item.specialWorkCertNo || '无' }}</text>
          </view>

          <!-- 当前所属项目 -->
          <view class="mb-16rpx flex items-center text-28rpx text-[#666]">
            <text class="mr-8rpx text-[#999]">当前项目：</text>
            <text>{{ item.currentProject }}</text>
          </view>

          <!-- 技能匹配标签 -->
          <view class="flex flex-wrap gap-12rpx">
            <view
              v-for="(skill, index) in item.skillMatch"
              :key="index"
              class="rounded-8rpx px-16rpx py-8rpx text-24rpx"
              :class="skill.match ? 'bg-[#f6ffed] text-[#52c41a]' : 'bg-[#fff1f0] text-[#ff4d4f]'"
            >
              {{ skill.name }}
              <text class="ml-4rpx">{{ skill.match ? '✓' : '✗' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="py-100rpx text-center">
        <wd-status-tip image="content" tip="暂无匹配的人员" />
      </view>

      <!-- 加载中 -->
      <view v-if="loading" class="flex items-center justify-center py-100rpx">
        <wd-loading />
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="safe-area-inset-bottom fixed bottom-0 left-0 right-0 flex items-center gap-24rpx bg-white p-24rpx">
      <view class="flex-1">
        <wd-checkbox v-model="isSelectAll" @change="handleSelectAll">
          全选
        </wd-checkbox>
      </view>
      <wd-button
        type="primary"
        :disabled="selectedIds.length === 0"
        :loading="submitting"
        @click="handleDeploy"
      >
        确认调配 ({{ selectedIds.length }})
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import type { MatchPersonVO } from '@/api/labor/match'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { deployPersons, getMatchPersons } from '@/api/labor/match'
import { navigateBackPlus } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const demandId = ref<number>(0)
const loading = ref(false)
const submitting = ref(false)
const list = ref<MatchPersonVO[]>([])
const selectedIds = ref<string[]>([])

// 筛选条件
const creditLevel = ref('')
const deployTime = ref('')

/** 诚信等级选项 */
const creditLevelOptions = [
  { label: '全部等级', value: '' },
  { label: 'A级', value: 'A级' },
  { label: 'B级', value: 'B级' },
  { label: 'C级', value: 'C级' },
]

/** 调配时间选项 */
const deployTimeOptions = [
  { label: '全部时间', value: '' },
  { label: '立即可调', value: '立即' },
  { label: '待定', value: '待定' },
]

/** 是否全选 */
const isSelectAll = computed({
  get: () => list.value.length > 0 && selectedIds.value.length === list.value.length,
  set: () => {},
})

/** 返回上一页 */
function handleBack() {
  navigateBackPlus()
}

/** 获取匹配人员列表 */
async function getList() {
  loading.value = true
  try {
    const params: any = { demandId: demandId.value }
    if (creditLevel.value) {
      params.creditLevel = creditLevel.value
    }
    if (deployTime.value) {
      params.deployTime = deployTime.value
    }
    list.value = await getMatchPersons(params)
    selectedIds.value = []
  } catch (e) {
    console.error('获取匹配人员失败', e)
  } finally {
    loading.value = false
  }
}

/** 筛选变化 */
function handleFilter() {
  getList()
}

/** 切换选中 */
function toggleSelect(item: MatchPersonVO) {
  const index = selectedIds.value.indexOf(item.idCard)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(item.idCard)
  }
}

/** 全选/取消全选 */
function handleSelectAll() {
  if (isSelectAll.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = list.value.map(item => item.idCard)
  }
}

/** 确认调配 */
async function handleDeploy() {
  if (selectedIds.value.length === 0) {
    uni.showToast({ title: '请选择要调配的人员', icon: 'none' })
    return
  }

  uni.showModal({
    title: '确认调配',
    content: `确定将选中的 ${selectedIds.value.length} 人调配到该项目吗？`,
    success: async (res) => {
      if (res.confirm) {
        submitting.value = true
        try {
          await deployPersons({
            demandId: demandId.value,
            personIdCards: selectedIds.value,
          })
          uni.showToast({ title: '调配成功', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack({ delta: 2 })
          }, 1500)
        } catch (e) {
          console.error('调配失败', e)
        } finally {
          submitting.value = false
        }
      }
    },
  })
}

/** 页面加载 */
onLoad((options) => {
  if (options?.demandId) {
    demandId.value = Number(options.demandId)
    getList()
  }
})
</script>

<style lang="scss" scoped>
</style>

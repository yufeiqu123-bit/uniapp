<template>
  <view class="business-header mx-20rpx mt-20rpx overflow-hidden rounded-24rpx">
    <view class="p-28rpx">
      <view class="flex items-start justify-between">
        <view class="min-w-0 flex-1">
          <view class="platform-title">
            劳务管理平台
          </view>
          <view class="mt-12rpx text-28rpx text-white">
            {{ greeting }}，{{ displayName }}
          </view>
          <view class="platform-subtitle mt-8rpx text-24rpx">
            高效管理劳务人员、班组与企业信息
          </view>
        </view>
        <view class="platform-icon ml-20rpx h-76rpx w-76rpx flex items-center justify-center rounded-20rpx">
          <wd-icon name="usergroup" size="42rpx" color="#ffffff" />
        </view>
      </view>

      <view class="overview-list mt-28rpx flex">
        <view
          v-for="item in overviewItems"
          :key="item.label"
          class="overview-card flex-1 rounded-18rpx px-16rpx py-18rpx"
        >
          <view class="text-36rpx text-white font-600">
            {{ item.value }}
          </view>
          <view class="overview-label mt-6rpx text-22rpx">
            {{ item.label }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { getLaborHomeOverview } from '@/api/labor/home'
import { useUserStore } from '@/store'

defineOptions({
  name: 'UserHeader',
})

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const displayName = computed(() => userInfo.value.nickname || userInfo.value.username || '管理员')

const overview = ref({
  pendingReviewCount: 0,
  laborPersonCount: 0,
  cooperationEnterpriseCount: 0,
})

const overviewItems = computed(() => [
  { label: '待审核', value: overview.value.pendingReviewCount },
  { label: '劳务人员', value: overview.value.laborPersonCount },
  { label: '合作企业', value: overview.value.cooperationEnterpriseCount },
])

function normalizeCount(value: unknown) {
  const count = Number(value)
  return Number.isFinite(count) ? count : 0
}

async function loadOverview() {
  try {
    const data = await getLaborHomeOverview()
    overview.value = {
      pendingReviewCount: normalizeCount(data?.pendingReviewCount),
      laborPersonCount: normalizeCount(data?.laborPersonCount),
      cooperationEnterpriseCount: normalizeCount(data?.cooperationEnterpriseCount),
    }
  } catch (error) {
    console.error('获取劳务首页统计失败', error)
  }
}

/** 根据时间获取问候语 */
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) {
    return '凌晨好'
  } else if (hour < 9) {
    return '早上好'
  } else if (hour < 12) {
    return '上午好'
  } else if (hour < 14) {
    return '中午好'
  } else if (hour < 17) {
    return '下午好'
  } else if (hour < 19) {
    return '傍晚好'
  } else {
    return '晚上好'
  }
})

onMounted(() => {
  loadOverview()
})
</script>

<style lang="scss" scoped>
.business-header {
  background: linear-gradient(135deg, #018d71 0%, #12b088 58%, #45c7a1 100%);
  box-shadow: 0 12rpx 28rpx rgba(1, 141, 113, 0.22);
}

.platform-title {
  color: #ffffff;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 1.25;
}

.platform-icon {
  background: rgba(255, 255, 255, 0.18);
}

.platform-subtitle,
.overview-label {
  color: rgba(255, 255, 255, 0.84);
}

.overview-card {
  background: rgba(255, 255, 255, 0.16);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.overview-card + .overview-card {
  margin-left: 14rpx;
}
</style>

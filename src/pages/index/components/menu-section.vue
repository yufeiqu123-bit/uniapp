<template>
  <scroll-view class="min-h-0 flex-1" scroll-y scroll-with-animation>
    <!-- 常用分组 -->
    <view class="menu-card mx-20rpx mt-20rpx overflow-hidden rounded-20rpx bg-white">
      <view class="section-header flex items-center justify-between px-24rpx pb-8rpx pt-22rpx">
        <view>
          <view class="flex items-center">
            <view class="section-mark mr-10rpx h-26rpx w-6rpx rounded-full" />
            <text class="text-30rpx text-#222 font-600">常用</text>
          </view>
          <view class="mt-6rpx text-22rpx text-#8a8f94">
            高频入口一键直达
          </view>
        </view>
        <view class="rounded-full bg-#f5f7f8 p-10rpx" @click="handleGotoFavoriteSettings">
          <wd-icon name="setting" size="32rpx" color="#999" />
        </view>
      </view>
      <MenuGrid v-if="favoriteMenuItems.length > 0" :menus="favoriteMenuItems" />
      <view
        v-else
        class="empty-favorite mx-24rpx mb-18rpx mt-10rpx flex items-center justify-center rounded-14rpx border-dashed px-20rpx py-12rpx"
        @click="handleGotoFavoriteSettings"
      >
        <wd-icon name="add" size="28rpx" color="#8ba39d" />
        <text class="pl-8rpx text-25rpx text-#8ba39d">添加我常用的</text>
      </view>
    </view>

    <!-- 菜单分组 -->
    <view
      v-for="group in menuGroups"
      :key="group.key"
      class="menu-card mx-20rpx mt-20rpx overflow-hidden rounded-20rpx bg-white"
      :class="{ 'priority-menu-card': isPriorityGroup(group.key) }"
    >
      <view class="section-header flex items-start justify-between px-24rpx pb-8rpx pt-22rpx">
        <view class="min-w-0 flex-1">
          <view class="flex items-center">
            <view v-if="isPriorityGroup(group.key)" class="section-mark mr-10rpx h-26rpx w-6rpx rounded-full" />
            <text class="section-title">{{ group.name }}</text>
          </view>
          <view class="section-desc mt-8rpx">
            {{ getGroupDescription(group.key) }}
          </view>
        </view>
        <view
          v-if="isPriorityGroup(group.key)"
          class="ml-16rpx rounded-full bg-#e8f7f2 px-14rpx py-6rpx text-20rpx text-#018d71"
        >
          核心
        </view>
      </view>
      <MenuGrid :menus="group.menus" :layout="getMenuLayout(group)" />
    </view>

    <!-- 底部安全区域 -->
    <view class="bottom-safe-space" />
  </scroll-view>
</template>

<script lang="ts" setup>
import type { MenuGroup, MenuItem } from '../index'
import { useUserStore } from '@/store/user'
import { getMenuGroups, getMenuItemByKey } from '../index'
import MenuGrid from './menu-grid.vue'

defineOptions({
  name: 'MenuSection',
})

const userStore = useUserStore()

const groupDescriptions: Record<string, string> = {
  labor: '需求、调配与业务处理',
  laborBase: '企业、班组、人员基础信息',
  bpm: '审批、待办与流程流转',
  system: '用户、角色与组织配置',
  infra: '日志、配置与运维工具',
}

/** 菜单分组列表 */
const menuGroups = ref<MenuGroup[]>([])

/** 常用服务菜单（从 store 中计算得出） */
const favoriteMenuItems = computed<MenuItem[]>(() => {
  const keys = userStore.favoriteMenus
  if (!keys || keys.length === 0) {
    return []
  }
  return keys.map(key => getMenuItemByKey(key)).filter(Boolean) as MenuItem[]
})

/** 初始化数据 */
function initData() {
  menuGroups.value = getMenuGroups()
}

function isPriorityGroup(key: string) {
  return key === 'labor' || key === 'laborBase'
}

function getGroupDescription(key: string) {
  return groupDescriptions[key] || '业务功能入口'
}

function getMenuLayout(group: MenuGroup) {
  return group.menus.length <= 2 ? 'card' : 'grid'
}

/** 跳转到常用服务设置页面 */
function handleGotoFavoriteSettings() {
  uni.navigateTo({
    url: '/pages/index/settings/index',
  })
}

/**
 * 初始化
 *
 * 不使用 onMounted 的原因是：登录后，页面可能已经挂载，但数据需要重新初始化
 */
onShow(() => {
  initData()
})
</script>

<style lang="scss" scoped>
.menu-card {
  box-shadow: 0 8rpx 22rpx rgba(15, 35, 31, 0.04);
}

.section-header {
  min-height: 86rpx;
}

.section-title {
  color: #222;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.25;
}

.section-desc {
  color: #8a8f94;
  font-size: 22rpx;
  line-height: 1.35;
}

.priority-menu-card {
  border: 1rpx solid rgba(1, 141, 113, 0.14);
  box-shadow: 0 10rpx 26rpx rgba(1, 141, 113, 0.08);
}

.section-mark {
  background: #018d71;
}

.empty-favorite {
  background: #fcfefd;
  border: 1rpx dashed #e4eeeb;
}

.bottom-safe-space {
  height: calc(132rpx + constant(safe-area-inset-bottom));
  height: calc(132rpx + env(safe-area-inset-bottom));
}
</style>

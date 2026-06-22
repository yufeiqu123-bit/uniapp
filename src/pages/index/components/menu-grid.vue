<template>
  <view class="menu-grid">
    <view v-if="isCardLayout" class="quick-card-list flex">
      <view
        v-for="menu in menus"
        :key="menu.key"
        class="quick-card flex flex-1 items-center rounded-18rpx bg-#f8fbfa px-20rpx py-22rpx"
        @click="handleClick(menu)"
      >
        <view
          class="menu-icon h-72rpx w-72rpx flex flex-shrink-0 items-center justify-center rounded-18rpx"
          :style="getIconStyle(menu)"
        >
          <wd-icon :name="menu.icon" size="40rpx" :color="menu.iconColor" />
        </view>
        <view class="ml-16rpx min-w-0 flex-1">
          <view class="quick-card-title">
            {{ menu.name }}
          </view>
          <view class="mt-6rpx text-22rpx text-#9aa3a0">
            快速进入
          </view>
        </view>
      </view>
    </view>

    <wd-grid v-else :column="4" clickable :border="false">
      <wd-grid-item
        v-for="menu in menus"
        :key="menu.key"
        :text="menu.name"
        @itemclick="handleClick(menu)"
      >
        <template #icon>
          <view
            class="menu-icon h-76rpx w-76rpx flex items-center justify-center rounded-20rpx"
            :style="getIconStyle(menu)"
          >
            <wd-icon :name="menu.icon" size="42rpx" :color="menu.iconColor" />
          </view>
        </template>
      </wd-grid-item>
    </wd-grid>
  </view>
</template>

<script lang="ts" setup>
import type { MenuItem } from '../index'
import { useToast } from 'wot-design-uni'
import { isTabBarPage } from '@/tabbar/config'
import { parseUrl, setTabParams } from '@/utils/url'

defineOptions({
  name: 'MenuGrid',
})

const props = withDefaults(defineProps<{
  menus: MenuItem[] // 菜单列表
  layout?: 'grid' | 'card'
}>(), {
  layout: 'grid',
})

const toast = useToast()

const isCardLayout = computed(() => props.layout === 'card' && props.menus.length > 0 && props.menus.length <= 2)

/** 处理菜单点击 */
function handleClick(menu: MenuItem) {
  console.log('点击菜单：', menu)
  if (!menu.url) {
    toast.show('功能开发中')
    return
  }

  // 解析 URL，提取路径和参数
  const { path, query } = parseUrl(menu.url)

  // 判断是否是 tabBar 页面
  if (isTabBarPage(path)) {
    // tabBar 页面：通过 globalData 传参，使用 switchTab 跳转
    if (Object.keys(query).length > 0) {
      setTabParams(query)
    }
    uni.switchTab({
      url: path,
      fail: () => {
        toast.show('页面不存在')
      },
    })
  } else {
    // 普通页面：使用 navigateTo 跳转
    uni.navigateTo({
      url: menu.url,
      fail: () => {
        toast.show('页面不存在')
      },
    })
  }
}

/** 获取图标样式 */
function getIconStyle(menu: MenuItem) {
  return {
    backgroundColor: menu.iconColor ? `${menu.iconColor}16` : '#f5f5f5',
    color: menu.iconColor || '#666',
  }
}
</script>

<style lang="scss" scoped>
.menu-grid {
  padding: 10rpx 6rpx 14rpx;
}

.quick-card-list {
  padding: 4rpx 18rpx 10rpx;
}

.quick-card + .quick-card {
  margin-left: 16rpx;
}

.quick-card {
  border: 1rpx solid #eef4f2;
}

.quick-card-title {
  color: #263331;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.25;
  word-break: break-all;
}

.menu-icon {
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.7);
}

:deep(.wd-grid-item__content) {
  padding: 14rpx 4rpx 12rpx;
}

:deep(.wd-grid-item__text) {
  font-size: 24rpx;
  color: #333;
  line-height: 1.25;
  max-width: 132rpx;
  min-height: 60rpx;
  overflow: hidden;
  white-space: normal !important;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>

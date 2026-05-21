<template>
  <view class="yd-page-container">
    <!-- 顶部导航栏 -->
    <wd-navbar
      :title="isEdit ? '编辑需求' : '新增需求'"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <!-- 表单内容 -->
    <view class="p-24rpx pb-150rpx">
      <wd-cell-group border>
        <!-- 发起项目部 -->
        <wd-cell
          title="发起项目部"
          required
          is-link
          :value="formData.projectName || '请选择'"
          @click="showProjectPicker = true"
        />

        <!-- 所需工种 -->
        <wd-cell
          title="所需工种"
          required
          is-link
          :value="formData.trade || '请选择'"
          @click="showTradePicker = true"
        />

        <!-- 需求人数 -->
        <wd-cell title="需求人数" required>
          <wd-input
            v-model="formData.needNum"
            type="number"
            placeholder="请输入需求人数"
            no-border
            align-right
          />
        </wd-cell>

        <!-- 工龄要求 -->
        <wd-cell title="工龄要求（年）">
          <wd-input
            v-model="formData.workAge"
            type="number"
            placeholder="请输入工龄要求"
            no-border
            align-right
          />
        </wd-cell>

        <!-- 工期开始时间 -->
        <wd-cell
          title="工期开始时间"
          required
          is-link
          :value="formData.startDate ? formatDate(formData.startDate) : '请选择'"
          @click="showStartDatePicker = true"
        />

        <!-- 工期结束时间 -->
        <wd-cell
          title="工期结束时间"
          required
          is-link
          :value="formData.endDate ? formatDate(formData.endDate) : '请选择'"
          @click="showEndDatePicker = true"
        />
      </wd-cell-group>
    </view>

    <!-- 底部按钮 -->
    <view class="safe-area-inset-bottom fixed bottom-0 left-0 right-0 bg-white p-24rpx">
      <wd-button type="primary" block :loading="loading" @click="handleSubmit">
        {{ isEdit ? '保存' : '提交' }}
      </wd-button>
    </view>

    <!-- 项目部选择器 -->
    <wd-picker
      v-model="formData.projectName"
      :columns="projectOptions"
      label="发起项目部"
      :visible="showProjectPicker"
      @confirm="showProjectPicker = false"
      @cancel="showProjectPicker = false"
    />

    <!-- 工种选择器 -->
    <wd-picker
      v-model="formData.trade"
      :columns="tradeOptions"
      label="所需工种"
      :visible="showTradePicker"
      @confirm="showTradePicker = false"
      @cancel="showTradePicker = false"
    />

    <!-- 开始日期选择器 -->
    <wd-datetime-picker
      v-model="formData.startDate"
      type="date"
      label="工期开始时间"
      :visible="showStartDatePicker"
      @confirm="showStartDatePicker = false"
      @cancel="showStartDatePicker = false"
    />

    <!-- 结束日期选择器 -->
    <wd-datetime-picker
      v-model="formData.endDate"
      type="date"
      label="工期结束时间"
      :visible="showEndDatePicker"
      @confirm="showEndDatePicker = false"
      @cancel="showEndDatePicker = false"
    />
  </view>
</template>

<script lang="ts" setup>
import type { DemandVO } from '@/api/labor/demand'
import { onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
import { createDemand, getDemand, updateDemand } from '@/api/labor/demand'
import { navigateBackPlus } from '@/utils'

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const isEdit = ref(false)
const loading = ref(false)
const formData = reactive<Partial<DemandVO>>({
  projectName: '',
  trade: '',
  needNum: undefined,
  workAge: undefined,
  startDate: '',
  endDate: '',
})

// 选择器显示状态
const showProjectPicker = ref(false)
const showTradePicker = ref(false)
const showStartDatePicker = ref(false)
const showEndDatePicker = ref(false)

/** 项目部选项 - 实际项目中应从接口获取 */
const projectOptions = [
  '第一项目部',
  '第二项目部',
  '第三项目部',
  '第四项目部',
  '第五项目部',
]

/** 工种选项 */
const tradeOptions = [
  '钢筋工',
  '木工',
  '混凝土工',
  '架子工',
  '电焊工',
  '水电工',
  '瓦工',
  '油漆工',
]

/** 返回上一页 */
function handleBack() {
  navigateBackPlus()
}

/** 格式化日期 */
function formatDate(dateStr: string | Date) {
  if (!dateStr)
    return ''
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** 表单验证 */
function validateForm() {
  if (!formData.projectName) {
    uni.showToast({ title: '请选择发起项目部', icon: 'none' })
    return false
  }
  if (!formData.trade) {
    uni.showToast({ title: '请选择所需工种', icon: 'none' })
    return false
  }
  if (!formData.needNum || formData.needNum <= 0) {
    uni.showToast({ title: '请输入有效的需求人数', icon: 'none' })
    return false
  }
  if (!formData.startDate) {
    uni.showToast({ title: '请选择工期开始时间', icon: 'none' })
    return false
  }
  if (!formData.endDate) {
    uni.showToast({ title: '请选择工期结束时间', icon: 'none' })
    return false
  }
  if (new Date(formData.endDate) < new Date(formData.startDate)) {
    uni.showToast({ title: '工期结束时间不能早于开始时间', icon: 'none' })
    return false
  }
  return true
}

/** 提交表单 */
async function handleSubmit() {
  if (!validateForm())
    return

  loading.value = true
  try {
    const data = {
      ...formData,
      needNum: Number(formData.needNum),
      workAge: formData.workAge ? Number(formData.workAge) : 0,
    }

    if (isEdit.value) {
      await updateDemand(data)
      uni.showToast({ title: '修改成功', icon: 'success' })
    } else {
      await createDemand(data)
      uni.showToast({ title: '创建成功', icon: 'success' })
    }

    setTimeout(() => {
      navigateBackPlus()
    }, 1500)
  } catch (e) {
    console.error('提交失败', e)
  } finally {
    loading.value = false
  }
}

/** 获取详情（编辑模式） */
async function getDetail(id: number) {
  try {
    const data = await getDemand(id)
    Object.assign(formData, data)
  } catch (e) {
    console.error('获取详情失败', e)
  }
}

/** 页面加载 */
onLoad((options) => {
  if (options?.id) {
    isEdit.value = true
    getDetail(Number(options.id))
  }
})
</script>

<style lang="scss" scoped>
</style>

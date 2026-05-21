<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { getNavbarHeight } from '@/utils'

interface SearchOption {
  label: string
  value: string | number
}

interface SearchField {
  key: string
  label: string
  placeholder?: string
  type?: 'input' | 'radio'
  defaultValue?: string | number
  options?: SearchOption[]
}

const props = defineProps<{
  fields: SearchField[]
  placeholder: string
}>()

const emit = defineEmits<{
  search: [data: Record<string, any>]
  reset: []
}>()

const visible = ref(false)
const formData = reactive<Record<string, any>>({})

function getDefaultValue(field: SearchField) {
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }
  return field.type === 'radio' ? -1 : undefined
}

function resetFields() {
  props.fields.forEach((field) => {
    formData[field.key] = getDefaultValue(field)
  })
}

watch(() => props.fields, resetFields, { immediate: true })

function getOptionLabel(field: SearchField, value: any) {
  return field.options?.find(option => option.value === value)?.label || value
}

const placeholderText = computed(() => {
  const conditions = props.fields
    .map((field) => {
      const value = formData[field.key]
      if (value === undefined || value === null || value === '' || value === getDefaultValue(field)) {
        return ''
      }
      return `${field.label}:${getOptionLabel(field, value)}`
    })
    .filter(Boolean)
  return conditions.length > 0 ? conditions.join(' | ') : props.placeholder
})

function getSearchData() {
  const data: Record<string, any> = {}
  props.fields.forEach((field) => {
    const value = formData[field.key]
    if (value === undefined || value === null || value === '' || value === getDefaultValue(field)) {
      return
    }
    data[field.key] = value
  })
  return data
}

function handleSearch() {
  visible.value = false
  emit('search', getSearchData())
}

function handleReset() {
  resetFields()
  visible.value = false
  emit('reset')
}
</script>

<template>
  <view @click="visible = true">
    <wd-search :placeholder="placeholderText" hide-cancel disabled />
  </view>

  <wd-popup v-model="visible" position="top" @close="visible = false">
    <view class="yd-search-form-container" :style="{ paddingTop: `${getNavbarHeight()}px` }">
      <view
        v-for="field in fields"
        :key="field.key"
        class="yd-search-form-item"
      >
        <view class="yd-search-form-label">
          {{ field.label }}
        </view>
        <wd-radio-group v-if="field.type === 'radio'" v-model="formData[field.key]" shape="button">
          <wd-radio
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </wd-radio>
        </wd-radio-group>
        <wd-input
          v-else
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          clearable
        />
      </view>
      <view class="yd-search-form-actions">
        <wd-button class="flex-1" plain @click="handleReset">
          重置
        </wd-button>
        <wd-button class="flex-1" type="primary" @click="handleSearch">
          搜索
        </wd-button>
      </view>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import type { EnterpriseRegisterResp } from '@/api/labor/enterpriseRegister'
import { onMounted, ref } from 'vue'
import { getEnterpriseRegister } from '@/api/labor/enterpriseRegister'
import { navigateBackPlus } from '@/utils'
import DetailCard from '../../components/detail-card.vue'
import { formatDateRangeText } from '../../utils'

const props = defineProps<{
  id?: number | string
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const detail = ref<EnterpriseRegisterResp>()
const loading = ref(false)

function handleBack() {
  navigateBackPlus('/pages-labor/enterprise-register/index')
}

async function getDetail() {
  const id = Number(props.id)
  if (!id) {
    return
  }
  loading.value = true
  try {
    detail.value = await getEnterpriseRegister(id)
  } catch {
    uni.showToast({ title: '详情加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <view class="yd-page-container">
    <wd-navbar
      title="企业注册详情"
      left-arrow
      placeholder
      safe-area-inset-top
      fixed
      @click-left="handleBack"
    />

    <view v-if="loading && !detail" class="flex justify-center py-100rpx">
      <wd-loading />
    </view>
    <view v-else-if="detail" class="p-24rpx">
      <DetailCard
        title="企业信息"
        :items="[
          { label: '企业名称', value: detail.enterpriseName },
          { label: '统一社会信用代码', value: detail.unifiedSocialCreditCode },
          { label: '注册地址', value: detail.registrationAddress },
          { label: '联系方式', value: detail.contactInfo },
        ]"
      />
      <DetailCard
        title="法人信息"
        :items="[
          { label: '法定代表人', value: detail.legalRepresentative },
        ]"
      />
      <DetailCard
        title="资质信息"
        :items="[
          { label: '劳务分包资质等级', value: detail.laborSubcontractingQualificationLevel },
          { label: '资质有效期', value: formatDateRangeText(detail.qualificationValidityStart, detail.qualificationValidityEnd) },
        ]"
      />
      <DetailCard
        title="银行信息"
        :items="[
          { label: '开户银行', value: detail.bankName },
          { label: '银行账号', value: detail.bankAccount },
        ]"
      />
    </view>
    <view v-else class="py-100rpx text-center">
      <wd-status-tip image="content" tip="暂无详情数据" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>

<script lang="ts" setup>
import type { LaborInfoResp } from '@/api/labor/laborInfo'
import { onMounted, ref } from 'vue'
import {
  getCertificateListByLaborId,
  getInsuranceListByLaborId,
  getLaborInfo,
  getMedicalCheckListByLaborId,
  getMemberContractListByLaborId,
  getResumeListByLaborId,
} from '@/api/labor/laborInfo'
import { navigateBackPlus } from '@/utils'
import DetailCard from '../../components/detail-card.vue'
import SubListCard from '../../components/sub-list-card.vue'

const props = defineProps<{
  id?: number | string
}>()

definePage({
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const detail = ref<LaborInfoResp>()
const memberContracts = ref<Record<string, any>[]>([])
const certificates = ref<Record<string, any>[]>([])
const medicalChecks = ref<Record<string, any>[]>([])
const insurances = ref<Record<string, any>[]>([])
const resumes = ref<Record<string, any>[]>([])
const loading = ref(false)

const contractTitleKeys = ['contractName', 'contractNo', 'name']
const contractFields = [
  { label: '合同编号', keys: ['contractNo', 'code'] },
  { label: '合同类型', keys: ['contractType', 'type'] },
  { label: '开始日期', keys: ['startDate', 'beginDate'], type: 'date' as const },
  { label: '结束日期', keys: ['endDate', 'finishDate'], type: 'date' as const },
  { label: '状态', keys: ['statusName', 'status'] },
]
const certificateTitleKeys = ['certificateName', 'certName', 'name']
const certificateFields = [
  { label: '证书编号', keys: ['certificateNo', 'certNo', 'code'] },
  { label: '证书名称', keys: ['certificateName', 'certName', 'name'] },
  { label: '发证机关', keys: ['issuingAuthority', 'issueOrg'] },
  { label: '开始日期', keys: ['validityStart', 'startDate'], type: 'date' as const },
  { label: '结束日期', keys: ['validityEnd', 'endDate'], type: 'date' as const },
]
const medicalTitleKeys = ['checkDate', 'hospital', 'name']
const medicalFields = [
  { label: '体检机构', keys: ['hospital', 'checkOrg', 'organization'] },
  { label: '体检日期', keys: ['checkDate', 'medicalDate', 'createTime'], type: 'date' as const },
  { label: '体检结果', keys: ['result', 'checkResult'] },
  { label: '备注', keys: ['remark'] },
]
const insuranceTitleKeys = ['insuranceType', 'policyNo', 'name']
const insuranceFields = [
  { label: '险种', keys: ['insuranceType', 'type', 'name'] },
  { label: '保单号', keys: ['policyNo', 'insuranceNo', 'code'] },
  { label: '保险公司', keys: ['insuranceCompany', 'companyName'] },
  { label: '开始日期', keys: ['startDate', 'beginDate'], type: 'date' as const },
  { label: '结束日期', keys: ['endDate', 'finishDate'], type: 'date' as const },
]
const resumeTitleKeys = ['companyName', 'projectName', 'name']
const resumeFields = [
  { label: '单位/项目', keys: ['companyName', 'projectName', 'name'] },
  { label: '岗位/工种', keys: ['position', 'workType', 'job'] },
  { label: '开始日期', keys: ['startDate', 'beginDate'], type: 'date' as const },
  { label: '结束日期', keys: ['endDate', 'finishDate'], type: 'date' as const },
  { label: '备注', keys: ['remark', 'description'] },
]

function handleBack() {
  navigateBackPlus('/pages-labor/labor-info/index')
}

async function getDetail() {
  const id = Number(props.id)
  if (!id) {
    return
  }
  loading.value = true
  try {
    detail.value = await getLaborInfo(id)
    const laborId = detail.value?.id || id
    const [contracts, certs, checks, insuranceList, resumeList] = await Promise.all([
      getMemberContractListByLaborId(laborId),
      getCertificateListByLaborId(laborId),
      getMedicalCheckListByLaborId(laborId),
      getInsuranceListByLaborId(laborId),
      getResumeListByLaborId(laborId),
    ])
    memberContracts.value = contracts || []
    certificates.value = certs || []
    medicalChecks.value = checks || []
    insurances.value = insuranceList || []
    resumes.value = resumeList || []
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
      title="劳务人员详情"
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
        title="基本信息"
        :items="[
          { label: '姓名', value: detail.name },
          { label: '身份证号', value: detail.idCard },
          { label: '性别', value: detail.gender },
          { label: '民族', value: detail.ethnicity },
          { label: '联系方式', value: detail.phone },
          { label: '工种', value: detail.workType },
        ]"
      />
      <DetailCard
        title="联系信息"
        :items="[
          { label: '紧急联系人', value: detail.emergencyContact },
          { label: '紧急联系人电话', value: detail.emergencyPhone },
          { label: '现住址', value: detail.currentAddress },
        ]"
      />
      <DetailCard
        title="银行信息"
        :items="[
          { label: '开户银行', value: detail.bankName },
          { label: '开户支行', value: detail.bankBranch },
          { label: '银行卡号', value: detail.bankCardNo },
          { label: '联行号', value: detail.bankCode },
        ]"
      />
      <DetailCard
        title="项目信息"
        :items="[
          { label: '当前所属项目', value: detail.currentProject },
          { label: '所属班组', value: detail.teamName || detail.teamId },
        ]"
      />
      <SubListCard
        title="合同记录"
        :list="memberContracts"
        :title-keys="contractTitleKeys"
        :fields="contractFields"
        item-prefix="合同"
      />
      <SubListCard
        title="资格证书"
        :list="certificates"
        :title-keys="certificateTitleKeys"
        :fields="certificateFields"
        item-prefix="证书"
      />
      <SubListCard
        title="体检记录"
        :list="medicalChecks"
        :title-keys="medicalTitleKeys"
        :fields="medicalFields"
        item-prefix="体检"
      />
      <SubListCard
        title="保险记录"
        :list="insurances"
        :title-keys="insuranceTitleKeys"
        :fields="insuranceFields"
        item-prefix="保险"
      />
      <SubListCard
        title="个人简历"
        :list="resumes"
        :title-keys="resumeTitleKeys"
        :fields="resumeFields"
        item-prefix="简历"
      />
    </view>
    <view v-else class="py-100rpx text-center">
      <wd-status-tip image="content" tip="暂无详情数据" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>

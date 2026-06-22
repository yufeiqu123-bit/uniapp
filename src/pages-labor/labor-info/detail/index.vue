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
import SubListCard from '../../components/sub-list-card.vue'
import { display } from '../../utils'

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
  <view class="yd-page-container min-h-screen bg-[#f5f6f8]">
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
    <view v-else-if="detail" class="detail-page safe-area-inset-bottom px-24rpx pb-40rpx pt-24rpx">
      <view class="labor-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="p-24rpx">
          <view class="flex items-start justify-between gap-20rpx">
            <view class="min-w-0 flex-1 truncate text-36rpx text-[#1f2a37] font-semibold leading-46rpx">
              {{ display(detail.name) }}
            </view>
            <view class="max-w-220rpx shrink-0 truncate rounded-full bg-[#e8f6f2] px-18rpx py-6rpx text-24rpx text-[#018d71] font-medium leading-34rpx">
              {{ display(detail.workType) }}
            </view>
          </view>

          <view class="mt-8rpx break-all text-26rpx text-[#7b8794] leading-38rpx">
            {{ display(detail.phone) }}
          </view>

          <view class="mt-22rpx rounded-16rpx bg-[#f7f9f8] px-22rpx py-20rpx">
            <view class="mb-16rpx flex items-start text-28rpx leading-40rpx">
              <text class="w-120rpx shrink-0 text-[#8a949e]">
                性别
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(detail.gender) }}
              </text>
              <text class="w-120rpx shrink-0 text-[#8a949e]">
                民族
              </text>
              <text class="min-w-0 flex-1 text-[#26323d]">
                {{ display(detail.ethnicity) }}
              </text>
            </view>
            <view class="flex items-start text-28rpx leading-40rpx">
              <text class="w-140rpx shrink-0 text-[#8a949e]">
                身份证号
              </text>
              <text class="min-w-0 flex-1 break-all text-[#26323d]">
                {{ display(detail.idCard) }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>基本信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">政治面貌</text>
            <text class="detail-value">{{ display(detail.politicalStatus) }}</text>
          </view>
          <view class="detail-row border-0">
            <text class="detail-label">学历</text>
            <text class="detail-value">{{ display(detail.educationLevel) }}</text>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>联系信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">紧急联系人</text>
            <text class="detail-value">{{ display(detail.emergencyContact) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">紧急联系人电话</text>
            <text class="detail-value">{{ display(detail.emergencyPhone) }}</text>
          </view>
          <view class="detail-row border-0">
            <text class="detail-label">现住址</text>
            <text class="detail-value">{{ display(detail.currentAddress) }}</text>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>银行信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">开户银行</text>
            <text class="detail-value">{{ display(detail.bankName) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">开户支行</text>
            <text class="detail-value">{{ display(detail.bankBranch) }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">银行卡号</text>
            <text class="detail-value">{{ display(detail.bankCardNo) }}</text>
          </view>
          <view class="detail-row border-0">
            <text class="detail-label">联行号</text>
            <text class="detail-value">{{ display(detail.bankCode) }}</text>
          </view>
        </view>
      </view>

      <view class="detail-card mb-24rpx overflow-hidden rounded-20rpx bg-white">
        <view class="detail-card-title">
          <text>项目信息</text>
        </view>
        <view class="px-24rpx">
          <view class="detail-row">
            <text class="detail-label">当前所属项目</text>
            <text class="detail-value">{{ display(detail.currentProject) }}</text>
          </view>
          <view class="detail-row border-0">
            <text class="detail-label">所属班组</text>
            <text class="detail-value">{{ display(detail.teamName || detail.teamId) }}</text>
          </view>
        </view>
      </view>

      <view class="sub-list-card">
        <SubListCard
          title="合同记录"
          :list="memberContracts"
          :title-keys="contractTitleKeys"
          :fields="contractFields"
          item-prefix="合同"
        />
      </view>
      <view class="sub-list-card">
        <SubListCard
          title="资格证书"
          :list="certificates"
          :title-keys="certificateTitleKeys"
          :fields="certificateFields"
          item-prefix="证书"
        />
      </view>
      <view class="sub-list-card">
        <SubListCard
          title="体检记录"
          :list="medicalChecks"
          :title-keys="medicalTitleKeys"
          :fields="medicalFields"
          item-prefix="体检"
        />
      </view>
      <view class="sub-list-card">
        <SubListCard
          title="保险记录"
          :list="insurances"
          :title-keys="insuranceTitleKeys"
          :fields="insuranceFields"
          item-prefix="保险"
        />
      </view>
      <view class="sub-list-card">
        <SubListCard
          title="个人简历"
          :list="resumes"
          :title-keys="resumeTitleKeys"
          :fields="resumeFields"
          item-prefix="简历"
        />
      </view>
    </view>
    <view v-else class="py-100rpx text-center">
      <wd-status-tip image="content" tip="暂无详情数据" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.labor-card,
.detail-card {
  box-shadow: 0 10rpx 30rpx rgba(31, 42, 55, 0.08);
}

.detail-card-title {
  display: flex;
  align-items: center;
  padding: 24rpx 24rpx 8rpx;
  color: #1f2a37;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 44rpx;

  &::before {
    width: 6rpx;
    height: 28rpx;
    margin-right: 12rpx;
    border-radius: 999rpx;
    background: #018d71;
    content: '';
  }
}

.detail-row {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eef1f4;
  font-size: 28rpx;
  line-height: 40rpx;
}

.detail-label {
  width: 180rpx;
  flex-shrink: 0;
  color: #8a949e;
}

.detail-value {
  min-width: 0;
  flex: 1;
  color: #26323d;
  overflow-wrap: anywhere;
  word-break: break-all;
}

.sub-list-card {
  :deep(> view) {
    border-radius: 20rpx;
    box-shadow: 0 10rpx 30rpx rgba(31, 42, 55, 0.08);
  }

  :deep(> view > view:first-child) {
    display: flex;
    align-items: center;
    padding: 24rpx 24rpx 8rpx;
    border-bottom: 0;
  }

  :deep(> view > view:first-child::before) {
    width: 6rpx;
    height: 28rpx;
    margin-right: 12rpx;
    border-radius: 999rpx;
    background: #018d71;
    content: '';
  }

  :deep(> view > view:first-child text) {
    color: #1f2a37;
    font-size: 32rpx;
    line-height: 44rpx;
  }

  :deep(> view > view:nth-child(2)) {
    padding: 20rpx 24rpx 24rpx;
  }

  :deep(> view > view:nth-child(2) > view) {
    border-radius: 16rpx;
    background: #f7f9f8;
  }

  :deep(> view > view:nth-child(2) > view > view text:last-child) {
    text-align: left;
    overflow-wrap: anywhere;
    word-break: break-all;
  }
}
</style>

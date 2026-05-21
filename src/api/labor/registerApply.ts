import type { PageResult } from '@/http/types'
import { http } from '@/http/http'

const PREFIX = '/labor/register-apply'

export interface RegisterApplyPageReq {
  pageNo: number
  pageSize: number
  username?: string
  registerType?: number
  status?: number
  enterpriseName?: string
  unifiedSocialCreditCode?: string
  createTime?: string[]
}

export interface RegisterApplyRejectReq {
  id: number
  rejectReason: string
}

export interface RegisterApplyResp {
  id: number
  username?: string
  nickname?: string
  email?: string
  registerType?: number
  tenantName?: string
  unifiedSocialCreditCode?: string
  enterpriseName?: string
  registrationAddress?: string
  contactInfo?: string
  legalRepresentative?: string
  laborSubcontractingQualificationLevel?: string
  qualificationValidityStart?: number | string
  qualificationValidityEnd?: number | string
  bankName?: string
  bankAccount?: string
  status?: number
  rejectReason?: string
  reviewUserId?: number
  reviewTime?: string
  createTime?: string
  [key: string]: any
}

export function getRegisterApplyPage(params: RegisterApplyPageReq) {
  return http.get<PageResult<RegisterApplyResp>>(`${PREFIX}/page`, params)
}

export function getRegisterApply(id: number) {
  return http.get<RegisterApplyResp>(`${PREFIX}/get`, { id })
}

export function approveRegisterApply(id: number) {
  return http.put<boolean>(`${PREFIX}/approve?id=${id}`)
}

export function rejectRegisterApply(data: RegisterApplyRejectReq) {
  return http.put<boolean>(`${PREFIX}/reject`, data)
}

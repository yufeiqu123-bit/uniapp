import type { PageResult } from '@/http/types'
import { http } from '@/http/http'

const PREFIX = '/labor/lwqyzcxx'

export interface EnterpriseRegisterResp {
  id: number
  unifiedSocialCreditCode?: string
  enterpriseName?: string
  registrationAddress?: string
  contactInfo?: string
  legalRepresentative?: string
  laborSubcontractingQualificationLevel?: string
  qualificationValidityStart?: string
  qualificationValidityEnd?: string
  bankName?: string
  bankAccount?: string
  createTime?: string
  [key: string]: any
}

export interface EnterpriseRegisterPageReq {
  pageNo: number
  pageSize: number
  unifiedSocialCreditCode?: string
  enterpriseName?: string
  createTime?: string[]
}

export interface EnterpriseRegisterSaveReq {
  id?: number
  unifiedSocialCreditCode?: string
  enterpriseName?: string
  registrationAddress?: string
  contactInfo?: string
  legalRepresentative?: string
  laborSubcontractingQualificationLevel?: string
  qualificationValidityStart?: string
  qualificationValidityEnd?: string
  bankName?: string
  bankAccount?: string
}

export function getEnterpriseRegisterPage(params: EnterpriseRegisterPageReq) {
  return http.get<PageResult<EnterpriseRegisterResp>>(`${PREFIX}/page`, params)
}

export function getEnterpriseRegister(id: number) {
  return http.get<EnterpriseRegisterResp>(`${PREFIX}/get`, { id })
}

export function createEnterpriseRegister(data: EnterpriseRegisterSaveReq) {
  return http.post<number>(`${PREFIX}/create`, data)
}

export function updateEnterpriseRegister(data: EnterpriseRegisterSaveReq) {
  return http.put<boolean>(`${PREFIX}/update`, data)
}

export function deleteEnterpriseRegister(id: number) {
  return http.delete<boolean>(`${PREFIX}/delete?id=${id}`)
}

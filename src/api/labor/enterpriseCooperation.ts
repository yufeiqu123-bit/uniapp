import type { PageResult } from '@/http/types'
import { http } from '@/http/http'

const PREFIX = '/labor/enterprise-cooperation'

export interface EnterpriseCooperationResp {
  id: number
  enterpriseName?: string
  unifiedSocialCreditCode?: string
  agentName?: string
  agentPhone?: string
  authorizationStartDate?: string
  authorizationEndDate?: string
  createTime?: string
  [key: string]: any
}

export interface EnterpriseCooperationPageReq {
  pageNo: number
  pageSize: number
  enterpriseName?: string
  unifiedSocialCreditCode?: string
  agentName?: string
  agentPhone?: string
  createTime?: string[]
}

export interface EnterpriseCooperationSaveReq {
  id?: number
  enterpriseName: string
  unifiedSocialCreditCode: string
  agentName: string
  agentPhone?: string
  authorizationStartDate?: string
  authorizationEndDate?: string
  cooperationProjects?: any[]
  currentProjects?: any[]
}

export function getEnterpriseCooperationPage(params: EnterpriseCooperationPageReq) {
  return http.get<PageResult<EnterpriseCooperationResp>>(`${PREFIX}/page`, params)
}

export function getEnterpriseCooperation(id: number) {
  return http.get<EnterpriseCooperationResp>(`${PREFIX}/get`, { id })
}

export function createEnterpriseCooperation(data: EnterpriseCooperationSaveReq) {
  return http.post<number>(`${PREFIX}/create`, data)
}

export function updateEnterpriseCooperation(data: EnterpriseCooperationSaveReq) {
  return http.put<boolean>(`${PREFIX}/update`, data)
}

export function deleteEnterpriseCooperation(id: number) {
  return http.delete<boolean>(`${PREFIX}/delete?id=${id}`)
}

export function getCooperationProjectListByCompanyId(companyId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/cooperation-project/list-by-company-id`, { companyId })
}

export function getCurrentProjectListByCompanyId(companyId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/current-project/list-by-company-id`, { companyId })
}

import type { PageResult } from '@/http/types'
import { http } from '@/http/http'

const PREFIX = '/labor/info'

export interface LaborInfoResp {
  id: number
  name?: string
  idCard?: string
  gender?: string
  ethnicity?: string
  phone?: string
  emergencyContact?: string
  emergencyPhone?: string
  currentAddress?: string
  bankName?: string
  bankBranch?: string
  bankCardNo?: string
  bankCode?: string
  workType?: string
  politicalStatus?: string
  educationLevel?: string
  currentProject?: string
  teamId?: number
  teamName?: string
  createTime?: string
  [key: string]: any
}

export interface LaborInfoPageReq {
  pageNo: number
  pageSize: number
  name?: string
  idCard?: string
  gender?: string
  ethnicity?: string
  phone?: string
  workType?: string
  politicalStatus?: string
  educationLevel?: string
  currentProject?: string
  teamId?: number
  createTime?: string[]
}

export interface LaborInfoSaveReq {
  id?: number
  name: string
  idCard: string
  gender: string
  ethnicity?: string
  phone: string
  emergencyContact?: string
  emergencyPhone?: string
  currentAddress?: string
  bankName?: string
  bankBranch?: string
  bankCardNo?: string
  bankCode?: string
  workType: string
  politicalStatus?: string
  educationLevel?: string
  currentProject?: string
  teamId: number
  memberContracts?: any[]
  certificates?: any[]
  medicalChecks?: any[]
  insurances?: any[]
  resumes?: any[]
}

export function getLaborInfoPage(params: LaborInfoPageReq) {
  return http.get<PageResult<LaborInfoResp>>(`${PREFIX}/page`, params)
}

export function getLaborInfoProjectPage(params: LaborInfoPageReq) {
  return http.get<PageResult<LaborInfoResp>>(`${PREFIX}/project-page`, params)
}

export function getLaborInfo(id: number) {
  return http.get<LaborInfoResp>(`${PREFIX}/get`, { id })
}

export function getLaborInfoListByIds(ids: number[]) {
  return http.get<LaborInfoResp[]>(`${PREFIX}/list-by-ids`, { ids: ids.join(',') })
}

export function createLaborInfo(data: LaborInfoSaveReq) {
  return http.post<number>(`${PREFIX}/create`, data)
}

export function updateLaborInfo(data: LaborInfoSaveReq) {
  return http.put<boolean>(`${PREFIX}/update`, data)
}

export function deleteLaborInfo(id: number) {
  return http.delete<boolean>(`${PREFIX}/delete?id=${id}`)
}

export function getMemberContractListByLaborId(laborId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/member-contract/list-by-labor-id`, { laborId })
}

export function getCertificateListByLaborId(laborId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/certificate/list-by-labor-id`, { laborId })
}

export function getMedicalCheckListByLaborId(laborId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/medical-check/list-by-labor-id`, { laborId })
}

export function getInsuranceListByLaborId(laborId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/insurance/list-by-labor-id`, { laborId })
}

export function getResumeListByLaborId(laborId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/resume/list-by-labor-id`, { laborId })
}

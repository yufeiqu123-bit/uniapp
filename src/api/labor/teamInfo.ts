import type { PageResult } from '@/http/types'
import { http } from '@/http/http'

const PREFIX = '/labor/team-info'

export interface TeamInfoResp {
  id: number
  teamName?: string
  leaderName?: string
  leaderPhone?: string
  engagedIndustry?: string
  constructionType?: string
  largestScale?: number
  constructionMachinery?: string
  currentProject?: string
  createTime?: string
  [key: string]: any
}

export interface TeamInfoPageReq {
  pageNo: number
  pageSize: number
  teamName?: string
  leaderName?: string
  leaderPhone?: string
  engagedIndustry?: string
  constructionType?: string
  largestScale?: number
  constructionMachinery?: string
  currentProject?: string
  createTime?: string[]
}

export interface TeamInfoSaveReq {
  id?: number
  teamName: string
  leaderName: string
  leaderPhone: string
  engagedIndustry?: string
  constructionType?: string
  largestScale?: number
  constructionMachinery?: string
  currentProject?: string
  teamProjectPerformancess?: any[]
  teamConstructionRecordss?: any[]
}

export function getTeamInfoPage(params: TeamInfoPageReq) {
  return http.get<PageResult<TeamInfoResp>>(`${PREFIX}/page`, params)
}

export function getTeamInfo(id: number) {
  return http.get<TeamInfoResp>(`${PREFIX}/get`, { id })
}

export function createTeamInfo(data: TeamInfoSaveReq) {
  return http.post<number>(`${PREFIX}/create`, data)
}

export function updateTeamInfo(data: TeamInfoSaveReq) {
  return http.put<boolean>(`${PREFIX}/update`, data)
}

export function deleteTeamInfo(id: number) {
  return http.delete<boolean>(`${PREFIX}/delete?id=${id}`)
}

export function getTeamProjectPerformanceListByTeamId(teamId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/team-project-performances/list-by-team-id`, { teamId })
}

export function getTeamConstructionRecordListByTeamId(teamId: number) {
  return http.get<Record<string, any>[]>(`${PREFIX}/team-construction-records/list-by-team-id`, { teamId })
}

export function getCertifiedStatsByTeamId(teamId: number) {
  return http.get<Record<string, any>>(`${PREFIX}/certified-stats/get-by-team-id`, { teamId })
}

/**
 * 人员匹配 API
 */
import { httpGet, httpPost } from '@/http/http'

/** 匹配需求 VO */
export interface MatchDemandVO {
  id: number // 需求ID
  code: string // 需求编号
  projectName: string // 发起项目部
  trade: string // 所需工种
  needNum: number // 需求人数
  startDate: string // 工期开始时间
  endDate: string // 工期结束时间
  workAge: number // 工龄要求
}

/** 技能匹配 VO */
export interface SkillMatchVO {
  name: string // 技能名称
  match: boolean // 是否匹配
}

/** 匹配人员 VO */
export interface MatchPersonVO {
  id: number // 人员id
  name: string // 人员名称
  idCard: string // 身份证号
  status: number // 状态：1-闲置中 2-待调配
  statusText: string // 状态文本
  deployTime: string // 可调配时间
  creditLevel: string // 诚信等级
  skillMatch: SkillMatchVO[] // 技能匹配情况
  specialWorkCertNo: string // 特种证编号
  specialWorkEndDate: string // 特种证有效期
  currentProject: string // 所属原项目部
}

/** 获取待匹配需求列表 */
export function getMatchDemandList() {
  return httpGet<MatchDemandVO[]>('/api/labor/match/list')
}

/** 获取匹配人员结果 */
export function getMatchPersons(params: {
  demandId: number
  creditLevel?: string
  deployTime?: string
}) {
  return httpGet<MatchPersonVO[]>('/api/labor/match/result', params)
}

/** 发起劳务调配申请 */
export function deployPersons(data: {
  demandId: number
  personIdCards: string[]
}) {
  return httpPost<boolean>('/api/labor/match/deploy', data)
}

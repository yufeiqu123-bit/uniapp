/**
 * 劳务需求 API
 */
import { httpDelete, httpGet, httpPost, httpPut } from '@/http/http'

/** 劳务需求 VO */
export interface DemandVO {
  id: number // 主键ID
  code: string // 需求编号
  projectName: string // 发起项目部
  trade: string // 所需工种
  needNum: number // 需求人数
  startDate: string // 工期开始时间
  endDate: string // 工期结束时间
  workAge: number // 工龄要求
  status: number // 状态
  createTime: string // 创建时间
}

/** 分页查询参数 */
export interface DemandPageQuery {
  pageNo: number
  pageSize: number
  code?: string // 需求编号
  projectName?: string // 发起项目部
  trade?: string // 所需工种
  status?: number // 状态
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[]
  total: number
}

/** 查询劳务需求分页 */
export function getDemandPage(params: DemandPageQuery) {
  return httpGet<PageResult<DemandVO>>('/labor/demand/page', params)
}

/** 查询劳务需求详情 */
export function getDemand(id: number) {
  return httpGet<DemandVO>('/labor/demand/get', { id })
}

/** 新增劳务需求 */
export function createDemand(data: Partial<DemandVO>) {
  return httpPost<number>('/labor/demand/create', data)
}

/** 修改劳务需求 */
export function updateDemand(data: Partial<DemandVO>) {
  return httpPut<boolean>('/labor/demand/update', data)
}

/** 删除劳务需求 */
export function deleteDemand(id: number) {
  return httpDelete<boolean>('/labor/demand/delete', { id })
}

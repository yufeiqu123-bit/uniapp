import { http } from '@/http/http'

const PREFIX = '/labor/home'

export interface LaborHomeOverviewResp {
  pendingReviewCount?: number
  laborPersonCount?: number
  cooperationEnterpriseCount?: number
}

export function getLaborHomeOverview() {
  return http.get<LaborHomeOverviewResp>(`${PREFIX}/overview`)
}

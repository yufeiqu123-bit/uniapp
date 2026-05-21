import { http } from '@/http/http'

const PREFIX = '/api/options'

export interface LaborOption {
  label?: string
  value?: string | number
  name?: string
  id?: string | number
  [key: string]: any
}

export function getTeamOptions() {
  return http.get<LaborOption[]>(`${PREFIX}/getTeam`)
}

export function getLaborCompanyOptions() {
  return http.get<LaborOption[]>(`${PREFIX}/getLaborCompany`)
}

export function getProjectOptions() {
  return http.get<LaborOption[]>(`${PREFIX}/getProject`)
}

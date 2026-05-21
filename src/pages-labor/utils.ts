import { formatDate } from '@/utils/date'

type DateValue = Date | number | string | null | undefined

function normalizeTime(value: DateValue) {
  if (typeof value === 'number' && value > 0 && value < 10000000000) {
    return value * 1000
  }
  return value
}

export function display(value: any, fallback = '-') {
  if (value === undefined || value === null || value === '') {
    return fallback
  }
  return String(value)
}

export function formatDateText(value: DateValue) {
  if (!value) {
    return '-'
  }
  return display(formatDate(normalizeTime(value), 'YYYY-MM-DD'))
}

export function formatDateTimeMinute(value: DateValue) {
  if (!value) {
    return '-'
  }
  return display(formatDate(normalizeTime(value), 'YYYY-MM-DD HH:mm'))
}

export function formatDateRangeText(start?: DateValue, end?: DateValue) {
  const startText = formatDateText(start)
  const endText = formatDateText(end)
  if (startText === '-' && endText === '-') {
    return '-'
  }
  return `${startText} 至 ${endText}`
}

export function getValue(record: Record<string, any>, keys: string[]) {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return undefined
}

export function getItemTitle(record: Record<string, any>, keys: string[], index: number, prefix = '记录') {
  return display(getValue(record, keys), `${prefix}${index + 1}`)
}

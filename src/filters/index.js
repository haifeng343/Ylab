// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const statusOptions = {
  0: { name: '未开始', type: 'info' },
  1: { name: '进行中', type: 'warning' },
  2: { name: '已取消', type: 'danger' },
  3: { name: '已暂停', type: 'danger' },
  4: { name: '已完成', type: 'success' },
  5: { name: '审核中', type: 'primary' },
  6: { name: '采购中', type: 'warning' },
  7: { name: '未通过', type: 'info' },
  8: { name: '采购中', type: 'warning' },
  9: { name: '采购中', type: 'warning' },
  10: { name: '采购中', type: 'warning' }
  // 模拟采购中
  // 8: { name: '采购中', type: 'primary' },
  // 入库中停止
  // 9: { name: '已停止', type: 'danger' }
}
// 状态名称
export function statusFilter(type) {
  if (statusOptions[type]) {
    return statusOptions[type].name
  }
  return ''
}
// 状态类型
export function statusTypeFilter(type) {
  if (statusOptions[type]) {
    return statusOptions[type].type
  }
  return ''
}

const columnTypeMap = {
  text: '文本',
  select: '选项',
  employee: '人员',
  date: '日期'
}
// 状态类型
export function columnTypeFilter(type) {
  return columnTypeMap[type]
}
// 金额分转元
export function moneyFilter(money) {
  if (!money) {
    if (money === 0) {
      let result
      const num = money * 0.01
      const numStr = num.toString()
      const index = numStr.indexOf('.')
      if (index !== -1) {
        result = numStr.slice(0, index + 3)
      } else {
        result = numStr
      }
      return Math.round(Number(result))
    }
    return ''
  }
  let result
  const num = money * 0.01
  const numStr = num.toString()
  const index = numStr.indexOf('.')
  if (index !== -1) {
    result = numStr.slice(0, index + 3)
  } else {
    result = numStr
  }
  return Math.round(Number(result))
}

import { MenuItem, DiffType, DiffResult, FieldChange, DiffStatistics } from '../types/menu'

/**
 * 需要忽略的字段（不参与差异比较）
 */
const IGNORED_FIELDS = ['children']

/**
 * 深度比较两个值是否相等
 */
function isEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (a == null || b == null) return a === b

  if (typeof a !== typeof b) return false

  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false

    if (Array.isArray(a)) {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) return false
      }
      return true
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (!keysB.includes(key)) return false
      if (!isEqual(a[key], b[key])) return false
    }

    return true
  }

  return false
}

/**
 * 菜单差异计算器
 */
export class MenuDiffCalculator {
  /**
   * 计算两个菜单数据的差异
   */
  static calculateDiff(menuA: MenuItem[], menuB: MenuItem[]): DiffResult[] {
    const result: DiffResult[] = []

    // 创建ID映射，便于快速查找
    const mapA = this.createMenuMap(menuA)
    const mapB = this.createMenuMap(menuB)

    // 获取所有唯一ID
    const allIds = new Set([...Array.from(mapA.keys()), ...Array.from(mapB.keys())])

    for (const id of Array.from(allIds)) {
      const itemA = mapA.get(id)
      const itemB = mapB.get(id)

      if (!itemA && itemB) {
        // 新增项
        result.push({
          id,
          type: DiffType.ADDED,
          item: itemB,
          children: this.calculateDiff([], itemB.children || []),
        })
      } else if (itemA && !itemB) {
        // 删除项
        result.push({
          id,
          type: DiffType.REMOVED,
          item: itemA,
          children: this.calculateDiff(itemA.children || [], []),
        })
      } else if (itemA && itemB) {
        // 可能修改的项
        const changes = this.findFieldChanges(itemA, itemB)
        const childrenDiff = this.calculateDiff(itemA.children || [], itemB.children || [])

        const diffType = changes.length > 0 ? DiffType.MODIFIED : DiffType.UNCHANGED

        result.push({
          id,
          type: diffType,
          item: itemB,
          changes: changes.length > 0 ? changes : undefined,
          children: childrenDiff,
        })
      }
    }

    return result.sort((a, b) => a.item.sort - b.item.sort)
  }

  /**
   * 创建菜单ID映射
   */
  private static createMenuMap(menus: MenuItem[]): Map<number, MenuItem> {
    const map = new Map<number, MenuItem>()

    const traverse = (items: MenuItem[]) => {
      for (const item of items) {
        map.set(item.id, item)
        if (item.children && item.children.length > 0) {
          traverse(item.children)
        }
      }
    }

    traverse(menus)
    return map
  }

  /**
   * 查找两个菜单项之间的字段变更
   */
  private static findFieldChanges(itemA: MenuItem, itemB: MenuItem): FieldChange[] {
    const changes: FieldChange[] = []

    // 获取所有字段
    const allFields = new Set([...Object.keys(itemA), ...Object.keys(itemB)])

    for (const field of Array.from(allFields)) {
      // 跳过忽略的字段
      if (IGNORED_FIELDS.includes(field)) {
        continue
      }

      const valueA = (itemA as any)[field]
      const valueB = (itemB as any)[field]

      // 使用自定义的深度比较
      if (!isEqual(valueA, valueB)) {
        changes.push({
          field,
          oldValue: valueA,
          newValue: valueB,
        })
      }
    }

    return changes
  }

  /**
   * 计算差异统计信息
   */
  static calculateStatistics(diffResults: DiffResult[]): DiffStatistics {
    const stats: DiffStatistics = {
      added: 0,
      removed: 0,
      modified: 0,
      total: 0,
    }

    const traverse = (results: DiffResult[]) => {
      for (const result of results) {
        switch (result.type) {
          case DiffType.ADDED:
            stats.added++
            break
          case DiffType.REMOVED:
            stats.removed++
            break
          case DiffType.MODIFIED:
            stats.modified++
            break
        }

        stats.total++

        if (result.children && result.children.length > 0) {
          traverse(result.children)
        }
      }
    }

    traverse(diffResults)
    return stats
  }

  /**
   * 过滤差异结果（仅显示有变更的项）
   */
  static filterChanges(diffResults: DiffResult[]): DiffResult[] {
    const filtered: DiffResult[] = []

    for (const result of diffResults) {
      const filteredChildren = result.children ? this.filterChanges(result.children) : []

      // 如果当前项有变更，或者子项有变更，则保留
      if (result.type !== DiffType.UNCHANGED || filteredChildren.length > 0) {
        filtered.push({
          ...result,
          children: filteredChildren,
        })
      }
    }

    return filtered
  }

  /**
   * 根据关键词搜索差异结果
   */
  static searchDiffResults(diffResults: DiffResult[], keyword: string): DiffResult[] {
    if (!keyword.trim()) {
      return diffResults
    }

    const lowerKeyword = keyword.toLowerCase()
    const filtered: DiffResult[] = []

    for (const result of diffResults) {
      const item = result.item
      const matches =
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.name.toLowerCase().includes(lowerKeyword) ||
        item.path.toLowerCase().includes(lowerKeyword)

      const filteredChildren = result.children ? this.searchDiffResults(result.children, keyword) : []

      if (matches || filteredChildren.length > 0) {
        filtered.push({
          ...result,
          children: filteredChildren,
        })
      }
    }

    return filtered
  }
}

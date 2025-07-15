/**
 * 菜单项数据结构
 */
export interface MenuItem {
  id: number
  name: string
  menuType: number
  parentId: number
  path: string
  title: string
  hidden: boolean
  component: string
  sort: number
  activeName: string
  keepAlive: boolean
  defaultMenu: boolean
  icon: string
  closeTab: boolean
  showSidebar: boolean
  microApp: boolean
  appIcon: string
  skipPage: string
  role: number
  showInMyApp: boolean
  blank: boolean
  permission: boolean
  dataPermission: boolean
  tabName: string
  bindMenu: number
  children: MenuItem[]
}

/**
 * 差异类型枚举
 */
export enum DiffType {
  ADDED = 'added', // 新增
  REMOVED = 'removed', // 删除
  MODIFIED = 'modified', // 修改
  UNCHANGED = 'unchanged', // 未变更
}

/**
 * 字段变更信息
 */
export interface FieldChange {
  field: string
  oldValue: any
  newValue: any
}

/**
 * 差异结果
 */
export interface DiffResult {
  id: number
  type: DiffType
  item: MenuItem
  changes?: FieldChange[]
  children?: DiffResult[]
}

/**
 * 差异统计
 */
export interface DiffStatistics {
  added: number
  removed: number
  modified: number
  total: number
}

/**
 * 树节点数据
 */
export interface TreeNodeData {
  key: string
  title: string
  diffType: DiffType
  item: MenuItem
  changes?: FieldChange[]
  children?: TreeNodeData[]
}

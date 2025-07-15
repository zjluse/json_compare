import { DiffResult, DiffType, DiffStatistics, FieldChange } from '../types/menu'

/**
 * 下载文件的原生实现
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 报告生成器
 */
export class ReportGenerator {
  /**
   * 生成HTML差异报告
   */
  static generateHTMLReport(diffResults: DiffResult[], stats: DiffStatistics): string {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>菜单差异报告</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            padding: 20px;
            background: #fafafa;
            border-radius: 6px;
        }
        .stat-item {
            text-align: center;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #666;
            font-size: 14px;
        }
        .added { color: #52c41a; }
        .removed { color: #ff4d4f; text-decoration: line-through; }
        .modified { color: #1890ff; }
        .tree {
            margin-left: 0;
        }
        .tree-item {
            margin: 8px 0;
            padding: 8px;
            border-radius: 4px;
            border-left: 4px solid transparent;
        }
        .tree-item.added {
            background-color: #f6ffed;
            border-left-color: #52c41a;
        }
        .tree-item.removed {
            background-color: #fff2f0;
            border-left-color: #ff4d4f;
        }
        .tree-item.modified {
            background-color: #e6f7ff;
            border-left-color: #1890ff;
        }
        .tree-item.unchanged {
            background-color: #fafafa;
            border-left-color: #d9d9d9;
        }
        .item-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .item-path {
            color: #666;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .changes {
            margin-top: 10px;
            padding: 8px;
            background: rgba(0,0,0,0.02);
            border-radius: 4px;
        }
        .change-item {
            margin: 3px 0;
            font-size: 12px;
        }
        .old-value {
            color: #ff4d4f;
            text-decoration: line-through;
        }
        .new-value {
            color: #52c41a;
        }
        .children {
            margin-left: 20px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>菜单差异报告</h1>
            <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div class="stat-number added">${stats.added}</div>
                <div class="stat-label">新增</div>
            </div>
            <div class="stat-item">
                <div class="stat-number removed">${stats.removed}</div>
                <div class="stat-label">删除</div>
            </div>
            <div class="stat-item">
                <div class="stat-number modified">${stats.modified}</div>
                <div class="stat-label">修改</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">总计</div>
            </div>
        </div>
        
        <div class="tree">
            ${this.renderDiffTree(diffResults)}
        </div>
    </div>
</body>
</html>`

    return html
  }

  /**
   * 渲染差异树
   */
  private static renderDiffTree(diffResults: DiffResult[]): string {
    return diffResults.map((result) => this.renderDiffItem(result)).join('')
  }

  /**
   * 渲染单个差异项
   */
  private static renderDiffItem(result: DiffResult): string {
    const { item, type, changes, children } = result
    const typeClass = type.toLowerCase()

    let changesHtml = ''
    if (changes && changes.length > 0) {
      changesHtml = `
        <div class="changes">
          <strong>变更详情:</strong>
          ${changes
            .map(
              (change) => `
            <div class="change-item">
              <strong>${change.field}:</strong>
              <span class="old-value">${this.formatValue(change.oldValue)}</span>
              →
              <span class="new-value">${this.formatValue(change.newValue)}</span>
            </div>
          `,
            )
            .join('')}
        </div>
      `
    }

    let childrenHtml = ''
    if (children && children.length > 0) {
      childrenHtml = `
        <div class="children">
          ${this.renderDiffTree(children)}
        </div>
      `
    }

    return `
      <div class="tree-item ${typeClass}">
        <div class="item-title ${typeClass}">${item.title}</div>
        <div class="item-path">${item.path}</div>
        ${changesHtml}
        ${childrenHtml}
      </div>
    `
  }

  /**
   * 格式化值显示
   */
  private static formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '空'
    }
    if (typeof value === 'boolean') {
      return value ? '是' : '否'
    }
    if (typeof value === 'string' && value === '') {
      return '空字符串'
    }
    return String(value)
  }

  /**
   * 导出HTML报告文件
   */
  static exportHTMLReport(diffResults: DiffResult[], stats: DiffStatistics): void {
    const html = this.generateHTMLReport(diffResults, stats)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    downloadFile(html, `菜单差异报告_${new Date().toISOString().slice(0, 10)}.html`, 'text/html;charset=utf-8')
  }

  /**
   * 导出JSON报告
   */
  static exportJSONReport(diffResults: DiffResult[], stats: DiffStatistics): void {
    const report = {
      timestamp: new Date().toISOString(),
      statistics: stats,
      differences: diffResults,
    }

    const json = JSON.stringify(report, null, 2)
    downloadFile(json, `菜单差异报告_${new Date().toISOString().slice(0, 10)}.json`, 'application/json;charset=utf-8')
  }

  /**
   * 导出CSV报告
   */
  static exportCSVReport(diffResults: DiffResult[]): void {
    const csvData: string[] = ['ID,标题,路径,差异类型,变更字段,旧值,新值']

    const flattenResults = (results: DiffResult[], level = 0): void => {
      for (const result of results) {
        const { item, type, changes } = result
        const prefix = '  '.repeat(level)

        if (changes && changes.length > 0) {
          for (const change of changes) {
            csvData.push(
              [
                item.id,
                `${prefix}${item.title}`,
                item.path,
                this.getDiffTypeLabel(type),
                change.field,
                `"${this.formatValue(change.oldValue)}"`,
                `"${this.formatValue(change.newValue)}"`,
              ].join(','),
            )
          }
        } else {
          csvData.push(
            [item.id, `${prefix}${item.title}`, item.path, this.getDiffTypeLabel(type), '', '', ''].join(','),
          )
        }

        if (result.children && result.children.length > 0) {
          flattenResults(result.children, level + 1)
        }
      }
    }

    flattenResults(diffResults)

    const csv = csvData.join('\n')
    downloadFile('\ufeff' + csv, `菜单差异报告_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8')
  }

  /**
   * 获取差异类型标签
   */
  private static getDiffTypeLabel(type: DiffType): string {
    switch (type) {
      case DiffType.ADDED:
        return '新增'
      case DiffType.REMOVED:
        return '删除'
      case DiffType.MODIFIED:
        return '修改'
      case DiffType.UNCHANGED:
        return '未变更'
      default:
        return '未知'
    }
  }
}

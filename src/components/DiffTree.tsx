import React, { useState, useMemo } from 'react';
import { Tree, Tag, Tooltip, Input, Space, Typography } from 'antd';
import { SearchOutlined, PlusOutlined, MinusOutlined, EditOutlined } from '@ant-design/icons';
import { DiffResult, DiffType, FieldChange } from '../types/menu';
import { MenuDiffCalculator } from '../utils/diffCalculator';

const { Search } = Input;
const { Text } = Typography;

interface DiffTreeProps {
  diffResults: DiffResult[];
  showUnchanged?: boolean;
}

interface TreeNodeData {
  key: string;
  title: React.ReactNode;
  children?: TreeNodeData[];
  diffType: DiffType;
  item: any;
  changes?: FieldChange[];
}

/**
 * 差异树形组件
 */
export const DiffTree: React.FC<DiffTreeProps> = ({
  diffResults,
  showUnchanged = false
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 过滤和搜索结果
  const filteredResults = useMemo(() => {
    let results = diffResults;

    // 根据showUnchanged参数过滤
    if (!showUnchanged) {
      results = MenuDiffCalculator.filterChanges(results);
    }

    // 根据搜索关键词过滤
    if (searchKeyword.trim()) {
      results = MenuDiffCalculator.searchDiffResults(results, searchKeyword);
    }

    return results;
  }, [diffResults, showUnchanged, searchKeyword]);

  // 转换为Tree组件需要的数据结构
  const treeData = useMemo(() => {
    return convertToTreeData(filteredResults);
  }, [filteredResults]);

  // 获取所有节点的key，用于展开
  const allKeys = useMemo(() => {
    const keys: string[] = [];
    const collectKeys = (nodes: TreeNodeData[]) => {
      nodes.forEach(node => {
        keys.push(node.key);
        if (node.children) {
          collectKeys(node.children);
        }
      });
    };
    collectKeys(treeData);
    return keys;
  }, [treeData]);

  // 展开所有节点
  const handleExpandAll = () => {
    setExpandedKeys(allKeys);
  };

  // 折叠所有节点
  const handleCollapseAll = () => {
    setExpandedKeys([]);
  };

  return (
    <div className="diff-tree">
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Search
          placeholder="搜索菜单项（标题、名称、路径）"
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
        />
        <Space>
          <a onClick={handleExpandAll}>展开全部</a>
          <a onClick={handleCollapseAll}>折叠全部</a>
        </Space>
      </Space>

      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={(expandedKeys) => setExpandedKeys(expandedKeys as string[])}
        showLine
        showIcon={false}
        style={{ fontSize: 14 }}
      />
    </div>
  );
};

/**
 * 转换差异结果为树形数据
 */
function convertToTreeData(diffResults: DiffResult[]): TreeNodeData[] {
  return diffResults.map(result => ({
    key: `${result.id}`,
    title: renderTreeNodeTitle(result),
    children: result.children ? convertToTreeData(result.children) : undefined,
    diffType: result.type,
    item: result.item,
    changes: result.changes
  }));
}

/**
 * 渲染树节点标题
 */
function renderTreeNodeTitle(result: DiffResult): React.ReactNode {
  const { item, type, changes } = result;

  return (
    <div className="tree-node-content">
      <div className="node-header">
        <Space>
          {/* 差异类型图标 */}
          {renderDiffIcon(type)}

          {/* 菜单标题 */}
          <span
            className={`node-title ${type}`}
            style={{
              color: getDiffColor(type),
              textDecoration: type === DiffType.REMOVED ? 'line-through' : 'none'
            }}
          >
            {item.title}
          </span>

          {/* 差异类型标签 */}
          <Tag color={getDiffTagColor(type)}>
            {getDiffLabel(type)}
          </Tag>
        </Space>
      </div>

      {/* 路径信息 */}
      <div className="node-path" style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
        {item.path}
      </div>

      {/* 变更详情 */}
      {changes && changes.length > 0 && (
        <Tooltip title={renderChangesTooltip(changes)} placement="right">
          <div className="node-changes" style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              变更了 {changes.length} 个字段
            </Text>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

/**
 * 渲染差异类型图标
 */
function renderDiffIcon(type: DiffType): React.ReactNode {
  switch (type) {
    case DiffType.ADDED:
      return <PlusOutlined style={{ color: '#52c41a' }} />;
    case DiffType.REMOVED:
      return <MinusOutlined style={{ color: '#ff4d4f' }} />;
    case DiffType.MODIFIED:
      return <EditOutlined style={{ color: '#1890ff' }} />;
    default:
      return null;
  }
}

/**
 * 获取差异类型颜色
 */
function getDiffColor(type: DiffType): string {
  switch (type) {
    case DiffType.ADDED:
      return '#52c41a';
    case DiffType.REMOVED:
      return '#ff4d4f';
    case DiffType.MODIFIED:
      return '#1890ff';
    default:
      return '#000';
  }
}

/**
 * 获取差异标签颜色
 */
function getDiffTagColor(type: DiffType): string {
  switch (type) {
    case DiffType.ADDED:
      return 'success';
    case DiffType.REMOVED:
      return 'error';
    case DiffType.MODIFIED:
      return 'processing';
    default:
      return 'default';
  }
}

/**
 * 获取差异类型标签
 */
function getDiffLabel(type: DiffType): string {
  switch (type) {
    case DiffType.ADDED:
      return '新增';
    case DiffType.REMOVED:
      return '删除';
    case DiffType.MODIFIED:
      return '修改';
    default:
      return '未变更';
  }
}

/**
 * 渲染变更详情提示框
 */
function renderChangesTooltip(changes: FieldChange[]): React.ReactNode {
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>变更详情:</div>
      {changes.map((change, index) => (
        <div key={index} style={{ marginBottom: 4 }}>
          <div style={{ fontWeight: 'bold' }}>{change.field}:</div>
          <div>
            <span style={{ color: '#ff4d4f', textDecoration: 'line-through' }}>
              {formatValue(change.oldValue)}
            </span>
            {' → '}
            <span style={{ color: '#52c41a' }}>
              {formatValue(change.newValue)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 格式化值显示
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '空';
  }
  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }
  if (typeof value === 'string' && value === '') {
    return '空字符串';
  }
  return String(value);
} 
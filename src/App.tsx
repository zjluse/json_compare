import React, { useState, useMemo } from 'react';
import { Layout, Row, Col, Button, Space, Switch, Divider, Typography, message } from 'antd';
import { DownloadOutlined, SwapOutlined } from '@ant-design/icons';
import { JsonInput } from './components/JsonInput';
import { StatisticsPanel } from './components/StatisticsPanel';
import { DiffTree } from './components/DiffTree';
import { MenuDiffCalculator } from './utils/diffCalculator';
import { ReportGenerator } from './utils/reportGenerator';
import { MenuItem, DiffResult, DiffStatistics } from './types/menu';
import './App.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  // 状态管理
  const [menuA, setMenuA] = useState<string>('');
  const [menuB, setMenuB] = useState<string>('');
  const [parsedMenuA, setParsedMenuA] = useState<MenuItem[]>([]);
  const [parsedMenuB, setParsedMenuB] = useState<MenuItem[]>([]);
  const [showUnchanged, setShowUnchanged] = useState<boolean>(false);

  // 计算差异结果
  const diffResults: DiffResult[] = useMemo(() => {
    if (parsedMenuA.length === 0 && parsedMenuB.length === 0) {
      return [];
    }
    return MenuDiffCalculator.calculateDiff(parsedMenuA, parsedMenuB);
  }, [parsedMenuA, parsedMenuB]);

  // 计算统计信息
  const statistics: DiffStatistics = useMemo(() => {
    return MenuDiffCalculator.calculateStatistics(diffResults);
  }, [diffResults]);

  // 处理菜单A输入
  const handleMenuAChange = (value: string, parsed?: MenuItem[]) => {
    setMenuA(value);
    setParsedMenuA(parsed || []);
  };

  // 处理菜单B输入
  const handleMenuBChange = (value: string, parsed?: MenuItem[]) => {
    setMenuB(value);
    setParsedMenuB(parsed || []);
  };

  // 导出HTML报告
  const handleExportHTML = () => {
    if (diffResults.length === 0) {
      message.warning('请先输入菜单数据进行比较');
      return;
    }
    ReportGenerator.exportHTMLReport(diffResults, statistics);
    message.success('HTML报告导出成功');
  };

  // 导出JSON报告
  const handleExportJSON = () => {
    if (diffResults.length === 0) {
      message.warning('请先输入菜单数据进行比较');
      return;
    }
    ReportGenerator.exportJSONReport(diffResults, statistics);
    message.success('JSON报告导出成功');
  };

  // 导出CSV报告
  const handleExportCSV = () => {
    if (diffResults.length === 0) {
      message.warning('请先输入菜单数据进行比较');
      return;
    }
    ReportGenerator.exportCSVReport(diffResults);
    message.success('CSV报告导出成功');
  };

  const hasData = parsedMenuA.length > 0 || parsedMenuB.length > 0;

  return (
    <Layout className="app">
      <Header className="app-header">
        <div className="header-content">
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            菜单差异可视化工具
          </Title>
          <Paragraph style={{ color: '#f0f0f0', margin: 0 }}>
            比对两个环境的菜单按钮JSON数据，清晰展示新增、删除、修改的菜单项
          </Paragraph>
        </div>
      </Header>

      <Content className="app-content">
        {/* 数据输入区域 */}
        <div className="input-section">
          <Row gutter={16}>
            <Col span={12}>
              <JsonInput
                title="菜单A（如：测试环境）"
                placeholder="请输入或上传菜单A的JSON数据..."
                value={menuA}
                onChange={handleMenuAChange}
              />
            </Col>
            <Col span={12}>
              <JsonInput
                title="菜单B（如：生产环境）"
                placeholder="请输入或上传菜单B的JSON数据..."
                value={menuB}
                onChange={handleMenuBChange}
              />
            </Col>
          </Row>
        </div>

        {hasData && (
          <>
            <Divider />

            {/* 统计信息 */}
            <div className="statistics-section">
              <StatisticsPanel statistics={statistics} />
            </div>

            <Divider />

            {/* 操作区域 */}
            <div className="actions-section">
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <span>显示未变更项:</span>
                    <Switch
                      checked={showUnchanged}
                      onChange={setShowUnchanged}
                    />
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={handleExportHTML}
                    >
                      导出HTML报告
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleExportJSON}
                    >
                      导出JSON
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleExportCSV}
                    >
                      导出CSV
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* 差异树形展示 */}
            <div className="tree-section">
              <DiffTree
                diffResults={diffResults}
                showUnchanged={showUnchanged}
              />
            </div>
          </>
        )}

        {!hasData && (
          <div className="empty-state">
            <SwapOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
            <Title level={3} style={{ color: '#999', marginTop: 16 }}>
              请输入菜单数据开始比较
            </Title>
            <Paragraph style={{ color: '#666' }}>
              在上方输入框中粘贴或上传两个环境的菜单JSON数据，系统将自动分析差异
            </Paragraph>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default App; 
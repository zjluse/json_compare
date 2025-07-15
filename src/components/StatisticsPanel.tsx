import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { DiffStatistics } from '../types/menu';

interface StatisticsPanelProps {
  statistics: DiffStatistics;
}

/**
 * 差异统计面板组件
 */
export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ statistics }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card>
          <Statistic
            title="新增项"
            value={statistics.added}
            valueStyle={{ color: '#52c41a' }}
            prefix={<PlusOutlined />}
          />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic
            title="删除项"
            value={statistics.removed}
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<MinusOutlined />}
          />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic
            title="修改项"
            value={statistics.modified}
            valueStyle={{ color: '#1890ff' }}
            prefix={<EditOutlined />}
          />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic
            title="总计"
            value={statistics.total}
            valueStyle={{ color: '#333' }}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}; 
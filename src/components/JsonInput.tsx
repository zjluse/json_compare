import React, { useState } from 'react';
import { Card, Input, Button, Upload, message, Space, Typography } from 'antd';
import { UploadOutlined, ClearOutlined } from '@ant-design/icons';
import { MenuItem } from '../types/menu';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface JsonInputProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string, parsed?: MenuItem[]) => void;
}

/**
 * JSON输入组件
 */
export const JsonInput: React.FC<JsonInputProps> = ({
  title,
  placeholder,
  value,
  onChange
}) => {
  const [error, setError] = useState<string>('');

  // 处理文本变更
  const handleTextChange = (e: any) => {
    const text = e.target.value;
    onChange(text);

    // 验证JSON格式
    if (text.trim()) {
      try {
        const parsed = JSON.parse(text);
        setError('');
        onChange(text, Array.isArray(parsed) ? parsed : [parsed]);
      } catch (err) {
        setError('JSON格式错误');
      }
    } else {
      setError('');
    }
  };

  // 处理文件上传
  const handleFileUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const text = e.target.result;
        const parsed = JSON.parse(text);
        onChange(text, Array.isArray(parsed) ? parsed : [parsed]);
        message.success('文件上传成功');
        setError('');
      } catch (err) {
        message.error('文件格式错误，请确保是有效的JSON文件');
        setError('文件格式错误');
      }
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 清空内容
  const handleClear = () => {
    onChange('');
    setError('');
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
          {error && <Text type="danger">({error})</Text>}
        </Space>
      }
      extra={
        <Space>
          <Upload
            accept=".json"
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} size="small">
              上传文件
            </Button>
          </Upload>
          <Button
            icon={<ClearOutlined />}
            size="small"
            onClick={handleClear}
          >
            清空
          </Button>
        </Space>
      }
      style={{ height: '100%' }}
    >
      <TextArea
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
        rows={20}
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: 12
        }}
        status={error ? 'error' : ''}
      />
    </Card>
  );
}; 
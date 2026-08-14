import { useState } from 'react';
import { Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

export interface FilterField {
  key: string;
  label: string;
  type: 'keyword' | 'select' | 'dateRange' | 'custom';
  placeholder?: string;
  options?: { label: string; value: string }[];
  width?: number;
  /** Render custom filter control */
  render?: (value: unknown, onChange: (value: unknown) => void) => React.ReactNode;
}

export interface FilterValues {
  [key: string]: unknown;
}

interface AdvancedFilterPanelProps {
  fields: FilterField[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
  /** Show collapse for advanced filters */
  advancedFields?: FilterField[];
}

export default function AdvancedFilterPanel({
  fields,
  values,
  onChange,
  onSearch,
  onReset,
  loading = false,
  advancedFields,
}: AdvancedFilterPanelProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleFieldChange = (key: string, value: unknown) => {
    onChange({ ...values, [key]: value });
  };

  const renderField = (field: FilterField) => {
    const value = values[field.key];

    switch (field.type) {
      case 'keyword':
        return (
          <Input.Search
            key={field.key}
            placeholder={field.placeholder || `搜索${field.label}`}
            allowClear
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            onSearch={onSearch}
            style={{ width: field.width || 240 }}
            prefix={<SearchOutlined />}
          />
        );

      case 'select':
        return (
          <Select
            key={field.key}
            placeholder={field.placeholder || `选择${field.label}`}
            allowClear
            value={(value as string) || undefined}
            onChange={(v) => handleFieldChange(field.key, v)}
            options={field.options}
            style={{ width: field.width || 160 }}
          />
        );

      case 'dateRange':
        return (
          <RangePicker
            key={field.key}
            placeholder={['开始日期', '结束日期']}
            value={(value as [Dayjs, Dayjs]) || undefined}
            onChange={(dates) => handleFieldChange(field.key, dates)}
            style={{ width: field.width || 260 }}
          />
        );

      case 'custom':
        if (field.render) {
          return field.render(value, (v) => handleFieldChange(field.key, v));
        }
        return null;

      default:
        return null;
    }
  };

  const hasAdvanced = advancedFields && advancedFields.length > 0;

  return (
    <div className="admin-filter-bar" style={{ marginBottom: 16 }}>
      <Row gutter={[12, 12]} align="middle">
        {fields.map((field) => (
          <Col key={field.key}>{renderField(field)}</Col>
        ))}

        <Col>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              loading={loading}
              onClick={onSearch}
            >
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              重置
            </Button>
            {hasAdvanced && (
              <Button
                icon={advancedOpen ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setAdvancedOpen(!advancedOpen)}
                type={advancedOpen ? 'primary' : 'default'}
              >
                高级筛选
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {hasAdvanced && advancedOpen && (
        <Row gutter={[12, 12]} align="middle" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
          {advancedFields!.map((field) => (
            <Col key={field.key}>{renderField(field)}</Col>
          ))}
        </Row>
      )}
    </div>
  );
}
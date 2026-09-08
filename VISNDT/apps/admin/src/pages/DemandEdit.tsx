import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Spin,
  Alert,
  Space,
  message,
  Typography,
  Select,
  Switch,
  Tag,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { demandService, parameterDefinitionService, categoriesService, apiClient } from '../api';
import type { Demand, DemandParameter } from '../types';
import type {
  ParameterDefinition,
  ParameterOption,
} from '../types/parameter-definition.types';
import type { ProductCategory } from '../types/category.types';

const { Title } = Typography;
const { TextArea } = Input;

type PageState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: Demand };

interface DemandFormValues {
  title: string;
  description?: string;
  categoryId?: string;
  budgetRange?: string;
  quantity?: number;
  quantityUnit?: string;
  expectedDeliveryDate?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status?: string;
  contactVisible?: boolean;
}

interface DemandParamDraft {
  key: string;
  id?: string;
  parameterDefinitionId: string;
  value?: string;
  valueMin?: number | null;
  valueMax?: number | null;
  required: boolean;
  priority: number;
}

const PRIORITY_OPTIONS = [
  { value: 0, label: '普通' },
  { value: 1, label: '重要' },
  { value: 2, label: '关键' },
];

export default function DemandEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<DemandFormValues>();

  const [parameterDefinitions, setParameterDefinitions] = useState<ParameterDefinition[]>([]);
  const [originalParameters, setOriginalParameters] = useState<DemandParameter[]>([]);
  const [parameterDrafts, setParameterDrafts] = useState<DemandParamDraft[]>([]);
  const [parameterError, setParameterError] = useState('');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryError, setCategoryError] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      const list = await categoriesService.getList();
      setCategories(list);
    } catch {
      setCategoryError('加载分类失败，分类字段暂不可用。');
    }
  }, []);

  const loadDemand = useCallback(async () => {
    if (!id) return;
    setPageState({ status: 'loading' });
    try {
      const data = await demandService.getById(id);
      setPageState({ status: 'ready', data });
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载需求失败';
      setPageState({ status: 'error', message });
    }
  }, [id]);

  const loadParameterData = useCallback(async () => {
    if (!id) return;
    setParameterError('');
    try {
      const [defRes, params] = await Promise.all([
        parameterDefinitionService.getList({ page: 1, pageSize: 200 }),
        demandService.getParameters(id),
      ]);

      const defs = defRes.data ?? [];
      const enumIds = defs
        .filter((d) => d.dataType === 'ENUM')
        .map((d) => d.id);
      const details = await Promise.all(
        enumIds.map((did) =>
          parameterDefinitionService.getById(did).catch(() => null),
        ),
      );
      const optionsMap = new Map<string, ParameterOption[]>();
      for (const d of details) {
        if (d) optionsMap.set(d.id, d.options ?? []);
      }

      setParameterDefinitions(
        defs.map((d) => ({
          ...d,
          options: optionsMap.get(d.id) ?? d.options ?? [],
        })),
      );
      setOriginalParameters(params);
      setParameterDrafts(
        params.map((p) => ({
          key: p.id,
          id: p.id,
          parameterDefinitionId: p.parameterDefinitionId,
          value: p.value ?? '',
          valueMin: p.valueMin ?? null,
          valueMax: p.valueMax ?? null,
          required: p.required,
          priority: p.priority,
        })),
      );
    } catch {
      setParameterError('加载参数定义或需求参数失败，参数管理暂不可用。');
    }
  }, [id]);

  useEffect(() => {
    loadDemand();
  }, [loadDemand]);

  useEffect(() => {
    loadParameterData();
  }, [loadParameterData]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (values: DemandFormValues) => {
    if (!id) return;
    setSubmitting(true);
    try {
      const { status: newStatus, contactVisible, ...rest } = values;
      const hasStatusChange = newStatus && newStatus !== demand.status;

      // If status is changing, update other fields first, then status separately
      // (backend enforces: lifecycle status changes must be separate from generic field updates)
      if (hasStatusChange) {
        await apiClient.patch(`/demands/${id}`, { ...rest, contactVisible });
        await apiClient.patch(`/demands/${id}`, { status: newStatus });
      } else {
        await apiClient.patch(`/demands/${id}`, { ...rest, contactVisible });
      }

      // Parameter diff: add / update / delete
      const originalById = new Map(originalParameters.map((p) => [p.id, p]));
      const draftIds = new Set(
        parameterDrafts
          .map((d) => d.id)
          .filter((x): x is string => Boolean(x)),
      );

      for (const draft of parameterDrafts) {
        const payload = {
          value: draft.value?.trim() || undefined,
          valueMin: draft.valueMin ?? undefined,
          valueMax: draft.valueMax ?? undefined,
          required: draft.required,
          priority: draft.priority,
        };
        if (draft.id && originalById.has(draft.id)) {
          await demandService.updateParameter(id, draft.id, payload);
        } else {
          await demandService.addParameter(id, {
            parameterDefinitionId: draft.parameterDefinitionId,
            ...payload,
          });
        }
      }

      for (const original of originalParameters) {
        if (!draftIds.has(original.id)) {
          await demandService.deleteParameter(id, original.id);
        }
      }

      message.success('需求更新成功');
      navigate(`/demands/${id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '更新需求失败';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (pageState.status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (pageState.status === 'error') {
    return (
      <Alert
        type="error"
        message="加载需求失败"
        description={pageState.message}
        showIcon
        action={
          <Space>
            <Button onClick={loadDemand}>重试</Button>
            <Button onClick={() => navigate(`/demands/${id}`)} icon={<ArrowLeftOutlined />}>
              返回详情
            </Button>
          </Space>
        }
      />
    );
  }

  const demand = pageState.data;

  const paramIsEnabled = demand.status === 'DRAFT';

  const defById = new Map(
    parameterDefinitions.map((d) => [d.id, d]),
  );

  const addParamDraft = (definitionId: string) => {
    const def = defById.get(definitionId);
    if (!def) return;
    setParameterDrafts((prev) => [
      ...prev,
      {
        key: `__new_${Date.now()}`,
        parameterDefinitionId: def.id,
        value: def.dataType === 'BOOLEAN' ? 'true' : '',
        valueMin: null,
        valueMax: null,
        required: Boolean(def.required),
        priority: 0,
      },
    ]);
  };

  const updateParamDraft = (
    key: string,
    patch: Partial<DemandParamDraft>,
  ) => {
    setParameterDrafts((prev) =>
      prev.map((d) => (d.key === key ? { ...d, ...patch } : d)),
    );
  };

  const removeParamDraft = (key: string) => {
    setParameterDrafts((prev) => prev.filter((d) => d.key !== key));
  };

  const renderParamValueInput = (draft: DemandParamDraft) => {
    const def = defById.get(draft.parameterDefinitionId);
    if (!def) return null;
    const disabled = !paramIsEnabled;

    if (def.dataType === 'NUMBER') {
      return (
        <Space size="middle" align="baseline">
          <div>
            <span className="ant-form-text" style={{ fontSize: 12 }}>单值(可选)</span>
            <InputNumber
              style={{ width: 120 }}
              placeholder="精确值"
              value={draft.value === '' ? null : (draft.value as unknown as number)}
              disabled={disabled}
              onChange={(v) =>
                updateParamDraft(draft.key, {
                  value: v == null ? '' : String(v),
                })
              }
            />
          </div>
          <div>
            <span className="ant-form-text" style={{ fontSize: 12 }}>最小值</span>
            <InputNumber
              style={{ width: 120 }}
              placeholder="不限"
              value={draft.valueMin}
              disabled={disabled}
              onChange={(v) =>
                updateParamDraft(draft.key, {
                  valueMin: v == null ? null : Number(v),
                })
              }
            />
          </div>
          <div>
            <span className="ant-form-text" style={{ fontSize: 12 }}>最大值</span>
            <InputNumber
              style={{ width: 120 }}
              placeholder="不限"
              value={draft.valueMax}
              disabled={disabled}
              onChange={(v) =>
                updateParamDraft(draft.key, {
                  valueMax: v == null ? null : Number(v),
                })
              }
            />
          </div>
          {def.unit ? (
            <span className="ant-form-text" style={{ fontSize: 12, color: '#94a3b8' }}>
              {def.unit}
            </span>
          ) : null}
        </Space>
      );
    }

    if (def.dataType === 'ENUM') {
      const options = (def.options ?? []).map((o) => ({
        value: o.value,
        label: o.label,
      }));
      return (
        <Space size="small">
          <Select
            style={{ minWidth: 160 }}
            placeholder="请选择"
            allowClear
            value={draft.value || undefined}
            disabled={disabled}
            options={options}
            onChange={(v) => updateParamDraft(draft.key, { value: v ?? '' })}
          />
          {def.unit ? (
            <span className="ant-form-text" style={{ fontSize: 12, color: '#94a3b8' }}>
              {def.unit}
            </span>
          ) : null}
        </Space>
      );
    }

    if (def.dataType === 'BOOLEAN') {
      return (
        <Select
          style={{ minWidth: 120 }}
          value={draft.value ?? 'true'}
          disabled={disabled}
          onChange={(v) => updateParamDraft(draft.key, { value: v })}
          options={[
            { value: 'true', label: '是' },
            { value: 'false', label: '否' },
          ]}
        />
      );
    }

    // STRING
    return (
      <Input
        style={{ maxWidth: 320 }}
        placeholder="请输入要求值"
        value={draft.value ?? ''}
        disabled={disabled}
        onChange={(e) => updateParamDraft(draft.key, { value: e.target.value })}
      />
    );
  };

  const renderParameterSection = () => {
    const usedIds = new Set(parameterDrafts.map((d) => d.parameterDefinitionId));
    const availableDefs = parameterDefinitions.filter(
      (d) => !usedIds.has(d.id),
    );
    return (
      <Card style={{ marginTop: 24 }} title="技术参数">
        {parameterError ? (
          <Alert type="warning" showIcon message={parameterError} />
        ) : null}

        {parameterDrafts.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 14 }}>
            尚未添加技术参数。可从下方选择参数定义添加。
          </p>
        ) : (
          parameterDrafts.map((draft) => {
            const def = defById.get(draft.parameterDefinitionId);
            return (
              <div
                key={draft.key}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Space>
                    <span style={{ fontWeight: 500 }}>{def?.name}</span>
                    {def?.required ? (
                      <Tag color="red">必填</Tag>
                    ) : null}
                  </Space>
                  <Button
                    danger
                    size="small"
                    type="text"
                    ghost
                    icon={<DeleteOutlined />}
                    disabled={!paramIsEnabled}
                    onClick={() => removeParamDraft(draft.key)}
                  >
                    移除
                  </Button>
                </div>

                {renderParamValueInput(draft)}

                <Space
                  size="large"
                  style={{ marginTop: 8 }}
                  align="center"
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={draft.required}
                      disabled={!paramIsEnabled}
                      onChange={(e) =>
                        updateParamDraft(draft.key, {
                          required: e.target.checked,
                        })
                      }
                    />
                    <span style={{ fontSize: 13 }}>必填</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13 }}>重要度</span>
                    <Select
                      value={draft.priority}
                      disabled={!paramIsEnabled}
                      onChange={(v) =>
                        updateParamDraft(draft.key, { priority: v })
                      }
                      options={PRIORITY_OPTIONS}
                      style={{ width: 96 }}
                    />
                  </label>
                </Space>
              </div>
            );
          })
        )}

        {paramIsEnabled && availableDefs.length > 0 ? (
          <div
            style={{
              border: '1px dashed #cbd5e1',
              borderRadius: 8,
              padding: 12,
              marginTop: 8,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
              添加技术参数
            </p>
            <Space wrap>
              {availableDefs.map((def) => (
                <Button
                  key={def.id}
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => addParamDraft(def.id)}
                >
                  {def.name}
                  {def.required ? <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span> : null}
                </Button>
              ))}
            </Space>
          </div>
        ) : null}
        {!paramIsEnabled ? (
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>
            需求已离开草稿状态，技术参数不再开放编辑。
          </p>
        ) : null}
      </Card>
    );
  };

  // Compute legal status transitions based on current demand status
  const legalStatusOptions = (() => {
    const current = demand.status;
    const allStatuses = [
      { value: 'DRAFT', label: '草稿' },
      { value: 'PUBLISHED', label: '已发布' },
      { value: 'SUBMITTED', label: '已提交' },
      { value: 'PROCESSING', label: '处理中' },
      { value: 'CLOSED', label: '已关闭' },
      { value: 'CANCELLED', label: '已取消' },
    ];
    if (current === 'CLOSED' || current === 'CANCELLED') return [];
    return allStatuses.filter((s) => {
      if (s.value === current) return false;
      if (s.value === 'PUBLISHED' && current === 'DRAFT') return true;
      if (s.value === 'CLOSED' && (current === 'PUBLISHED' || current === 'PROCESSING')) return true;
      return false;
    });
  })();

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/demands/${id}`)}>
          返回详情
        </Button>
      </Space>

      <Title level={3}>编辑需求</Title>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: demand.title,
            description: demand.description,
            categoryId: demand.categoryId ?? undefined,
            budgetRange: demand.budgetRange,
            quantity: demand.quantity,
            quantityUnit: demand.quantityUnit,
            expectedDeliveryDate: demand.expectedDeliveryDate,
            contactName: demand.contactName,
            contactEmail: demand.contactEmail,
            contactPhone: demand.contactPhone,
            status: demand.status,
            contactVisible: demand.contactVisible ?? false,
          }}
          onFinish={handleSubmit}
          style={{ maxWidth: 720 }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入需求标题' }]}
          >
            <Input placeholder="请输入需求标题" />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <TextArea rows={4} placeholder="请输入需求描述（可选）" />
          </Form.Item>

          <Form.Item
            label="产品分类"
            name="categoryId"
            extra={categoryError || undefined}
          >
            <Select
              placeholder="请选择需求所属产品分类"
              allowClear
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </Form.Item>

          <Form.Item label="预算范围" name="budgetRange">
            <Input placeholder="例如：10000-50000" />
          </Form.Item>

          <Space size="large" style={{ display: 'flex' }} align="start">
            <Form.Item label="数量" name="quantity">
              <InputNumber min={0} style={{ width: 160 }} placeholder="请输入数量" />
            </Form.Item>

            <Form.Item label="数量单位" name="quantityUnit">
              <Input placeholder="例如：个、件、套" style={{ width: 160 }} />
            </Form.Item>
          </Space>

          <Form.Item
            label="预计交付日期"
            name="expectedDeliveryDate"
            getValueFromEvent={(date: dayjs.Dayjs | null) =>
              date ? date.format('YYYY-MM-DD') : undefined
            }
            getValueProps={(value: string | undefined) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker style={{ width: 240 }} />
          </Form.Item>

          <Form.Item label="联系人" name="contactName">
            <Input placeholder="请输入联系人姓名（可选）" />
          </Form.Item>

          <Form.Item label="联系人邮箱" name="contactEmail">
            <Input placeholder="请输入联系人邮箱（可选）" />
          </Form.Item>

          <Form.Item label="联系人电话" name="contactPhone">
            <Input placeholder="请输入联系人电话（可选）" />
          </Form.Item>

          <Form.Item label="需求状态" name="status">
            <Select
              placeholder={legalStatusOptions.length === 0 ? '当前状态不可变更' : '选择状态'}
              disabled={legalStatusOptions.length === 0}
              options={legalStatusOptions}
            />
          </Form.Item>

          <Form.Item
            label="联系人信息可见性"
            name="contactVisible"
            valuePropName="checked"
            extra="开启后，联系人信息将对供应商公开可见"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => navigate(`/demands/${id}`)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {renderParameterSection()}
    </div>
  );
}
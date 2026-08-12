import { useEffect, useState } from 'react';
import { DatePicker, Button, Space, Tag, Alert, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { Content } from '../../types';
import { contentService } from '../../api';

interface ContentScheduledPublishProps {
  content: Content;
  onChanged: () => void;
}

/**
 * Scheduled publish configuration panel.
 * Only applicable while the content is under REVIEW (DRAFT / PUBLISHED / ARCHIVED
 * must not set or clear a schedule). The scheduler scans `status=REVIEW AND
 * scheduledPublishAt <= now()` and auto-publishes via the existing Content publish flow.
 */
export default function ContentScheduledPublish({
  content,
  onChanged,
}: ContentScheduledPublishProps) {
  const [value, setValue] = useState<Dayjs | null>(
    content.scheduledPublishAt ? dayjs(content.scheduledPublishAt) : null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(content.scheduledPublishAt ? dayjs(content.scheduledPublishAt) : null);
  }, [content.scheduledPublishAt]);

  const isReview = content.status === 'REVIEW';

  const setSchedule = async () => {
    if (!value) return;
    setLoading(true);
    try {
      await contentService.update(content.id, {
        scheduledPublishAt: value.toISOString(),
      });
      message.success('定时发布时间已设置');
      onChanged();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '设置定时发布失败');
    } finally {
      setLoading(false);
    }
  };

  const clearSchedule = async () => {
    setLoading(true);
    try {
      await contentService.update(content.id, { scheduledPublishAt: null });
      message.success('定时发布时间已清除');
      onChanged();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '清除定时发布失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {content.scheduledPublishAt && (
        <Tag color="blue">
          计划发布时间：{dayjs(content.scheduledPublishAt).format('YYYY-MM-DD HH:mm:ss')}
        </Tag>
      )}
      {!isReview ? (
        <Alert
          type="info"
          showIcon
          message="定时发布仅可在审核中（REVIEW）状态配置"
          description="请先将内容提交审核，再设置自动发布时间。"
        />
      ) : (
        <Space wrap>
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={value}
            onChange={(v) => setValue(v)}
            placeholder="选择自动发布时间"
            disabled={loading}
          />
          <Button type="primary" onClick={setSchedule} loading={loading} disabled={!value}>
            设置定时发布
          </Button>
          {content.scheduledPublishAt && (
            <Button danger onClick={clearSchedule} loading={loading}>
              清除定时发布
            </Button>
          )}
        </Space>
      )}
    </Space>
  );
}
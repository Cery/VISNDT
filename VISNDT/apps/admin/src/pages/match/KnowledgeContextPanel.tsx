/**
 * KnowledgeContextPanel — Admin Match Detail Knowledge Context
 *
 * M23.0 — Read-side Knowledge Context display for admin match review.
 * Knowledge ≠ Score Input. Display only: Context, Reference, Learning.
 */

import { useEffect, useState, useCallback } from 'react';
import { Card, Spin, Alert, Tag, Typography, Empty, Divider } from 'antd';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { matchService } from '../../api';
import type { KnowledgeContext, KnowledgeEntryRef } from '../../types';

const { Text, Paragraph } = Typography;

interface KnowledgeContextPanelProps {
  matchId: string;
}

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: KnowledgeContext };

export default function KnowledgeContextPanel({
  matchId,
}: KnowledgeContextPanelProps) {
  const [state, setState] = useState<LoadState>({ status: 'idle' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = await matchService.getKnowledgeContext(matchId);
      setState({ status: 'success', data });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : '加载知识上下文失败';
      setState({ status: 'error', message: msg });
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <Card
        title={
          <span>
            <BookOutlined style={{ marginRight: 8 }} />
            知识上下文
          </span>
        }
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (state.status === 'error') {
    return (
      <Card
        title={
          <span>
            <BookOutlined style={{ marginRight: 8 }} />
            知识上下文
          </span>
        }
      >
        <Alert
          type="warning"
          message="加载失败"
          description={state.message}
          showIcon
          action={
            <a onClick={load} style={{ fontSize: 13 }}>
              重试
            </a>
          }
        />
      </Card>
    );
  }

  const ctx = state.data;
  const hasDomain = ctx.domain !== null;
  const hasRelevant = ctx.relevantEntries.length > 0;
  const hasPrerequisite = ctx.prerequisiteKnowledge.length > 0;
  const hasRelated = ctx.relatedKnowledge.length > 0;
  const hasFollowup = ctx.followupKnowledge.length > 0;
  const isEmpty =
    !hasDomain && !hasRelevant && !hasPrerequisite && !hasRelated && !hasFollowup;

  return (
    <Card
      title={
        <span>
          <BookOutlined style={{ marginRight: 8 }} />
          知识上下文
        </span>
      }
    >
      {isEmpty ? (
        <Empty
          description="暂无相关知识上下文"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div>
          {/* Domain & Category */}
          {hasDomain && (
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                检测领域
              </Text>
              <div style={{ marginTop: 4 }}>
                <Tag color="blue">{ctx.domain!.name}</Tag>
                {ctx.category && (
                  <Tag>{ctx.category.name}</Tag>
                )}
              </div>
            </div>
          )}

          {/* Relevant Knowledge Entries */}
          {hasRelevant && (
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                相关技术资料
              </Text>
              <div style={{ marginTop: 8 }}>
                {ctx.relevantEntries.map((entry: KnowledgeEntryRef) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: 6,
                      marginBottom: 8,
                      border: '1px solid #f0f0f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <LinkOutlined style={{ color: '#999', fontSize: 12 }} />
                      <Text strong style={{ fontSize: 13 }}>
                        {entry.title}
                      </Text>
                    </div>
                    {entry.summary && (
                      <Paragraph
                        type="secondary"
                        style={{
                          fontSize: 12,
                          margin: '4px 0 0 20px',
                          marginBottom: 0,
                        }}
                        ellipsis={{ rows: 2 }}
                      >
                        {entry.summary}
                      </Paragraph>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Divider style={{ margin: '12px 0' }} />

          {/* Prerequisite Knowledge */}
          {hasPrerequisite && (
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                前置知识
              </Text>
              <div style={{ marginTop: 4 }}>
                {ctx.prerequisiteKnowledge.map((entry: KnowledgeEntryRef) => (
                  <Tag key={entry.id} color="blue" style={{ marginBottom: 4 }}>
                    {entry.title}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Related Knowledge */}
          {hasRelated && (
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                相关知识
              </Text>
              <div style={{ marginTop: 4 }}>
                {ctx.relatedKnowledge.map((entry: KnowledgeEntryRef) => (
                  <Tag key={entry.id} style={{ marginBottom: 4 }}>
                    {entry.title}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Knowledge */}
          {hasFollowup && (
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                进阶学习
              </Text>
              <div style={{ marginTop: 4 }}>
                {ctx.followupKnowledge.map((entry: KnowledgeEntryRef) => (
                  <Tag key={entry.id} color="green" style={{ marginBottom: 4 }}>
                    {entry.title}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          <Divider style={{ margin: '12px 0' }} />

          {/* Footer note */}
          <Text type="secondary" style={{ fontSize: 11, fontStyle: 'italic' }}>
            以上为匹配背景信息与技术资料参考，不影响匹配评分。
          </Text>
        </div>
      )}
    </Card>
  );
}
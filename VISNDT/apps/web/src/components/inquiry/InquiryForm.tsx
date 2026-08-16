'use client';

import { useState } from 'react';
import { createInquiry } from '@/services/inquiry.service';
import type { InquiryResponse } from '@/types/inquiry';
import { trackEvent } from '@/lib/analytics/tracker';
import { buildEvent } from '@/lib/analytics/events';

interface InquiryFormProps {
  productId: string;
  productName: string;
  offerId: string;
  organizationId: string;
  /** 供应商名称（用于展示询价对象） */
  organizationName?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function InquiryForm({
  productId,
  productName,
  offerId,
  organizationId,
  organizationName,
}: InquiryFormProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<InquiryResponse | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await createInquiry({
        productId,
        offerId,
        organizationId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      });

      setResult(res);
      setStatus('success');
      setFormData(INITIAL_FORM);

      trackEvent(
        buildEvent('inquiry_submit', {
          source: 'inquiry_form',
          targetId: productId,
          metadata: {
            productName,
            offerId,
            organizationName,
          },
        }),
      );
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : '提交咨询失败，请重试。',
      );
    }
  };

  // === Success State ===
  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <div className="flex items-center gap-3 mb-3">
          <svg
            className="w-6 h-6 text-green-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-semibold text-green-800">
            咨询已提交
          </h3>
        </div>
        <p className="text-sm text-green-700 mb-1">
          您已成功提交关于 <span className="font-medium">{productName}</span> 的咨询。
        </p>
        <p className="text-xs text-green-600">
          供应商将通过{' '}
          <span className="font-medium">
            {result?.inquiry.visitorEmail || formData.email}
          </span>
          {' '}与您联系，提供技术方案与报价建议。
        </p>
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => {
              setStatus('idle');
              setResult(null);
            }}
            className="text-sm text-green-700 hover:text-green-800 underline"
          >
            继续咨询
          </button>
          <a
            href={typeof window !== 'undefined' ? window.location.pathname : `/products/${productId}`}
            className="text-sm text-green-700 hover:text-green-800 underline"
          >
            返回产品详情
          </a>
        </div>
      </div>
    );
  }

  // === Idle / Submitting / Error State ===
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-slate-500">
        {organizationName
          ? `请填写以下信息，${organizationName} 将为您提供 ${productName} 的技术方案与报价建议。`
          : `请填写以下信息，我们将为您提供 ${productName} 的技术方案与报价建议。`}
      </p>

      {/* Error Banner */}
      {status === 'error' && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700 mb-2">{errorMsg}</p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="text-xs text-red-600 hover:text-red-800 underline"
          >
            重新填写
          </button>
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="inq-name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          id="inq-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          disabled={status === 'submitting'}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
          placeholder="您的姓名"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="inq-email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          邮箱 <span className="text-red-500">*</span>
        </label>
        <input
          id="inq-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={status === 'submitting'}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
          placeholder="请输入邮箱"
        />
      </div>

      {/* Phone (optional) */}
      <div>
        <label
          htmlFor="inq-phone"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          电话 <span className="text-slate-400 text-xs">（选填）</span>
        </label>
        <input
          id="inq-phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          maxLength={30}
          disabled={status === 'submitting'}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
          placeholder="+86-13800138000"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="inq-message"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          留言 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="inq-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          maxLength={2000}
          rows={4}
          disabled={status === 'submitting'}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400 transition-colors resize-y"
          placeholder="请描述您的检测需求、应用场景或技术问题，以便我们提供更精准的方案。"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-2.5 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'submitting' ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            提交中...
          </span>
        ) : (
          '咨询此设备'
        )}
      </button>
    </form>
  );
}
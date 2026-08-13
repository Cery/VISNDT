'use client';

import { useState } from 'react';
import { createInquiry } from '@/services/inquiry.service';
import type { InquiryResponse } from '@/types/inquiry';

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
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : '提交询价失败，请重试。',
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
            感谢您的询价，已成功提交。
          </h3>
        </div>
        <p className="text-sm text-green-700">
          我们的团队将尽快通过{' '}
          <span className="font-medium">
            {result?.inquiry.visitorEmail || formData.email}
          </span>
          {' '}关于 {productName}.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setResult(null);
          }}
          className="mt-4 text-sm text-green-700 hover:text-green-800 underline"
        >
          提交另一个询价
        </button>
      </div>
    );
  }

  // === Idle / Submitting / Error State ===
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-sm text-slate-900">
        发送询价
      </h3>
      <p className="text-xs text-slate-500">
        {organizationName
          ? `向 ${organizationName} 询价 ${productName}。填写以下表单，我们将尽快回复。`
          : `对 ${productName} 感兴趣？填写以下表单，我们将尽快回复。`}
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
          placeholder="我对该产品感兴趣，请提供更多详情。"
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
          '提交询价'
        )}
      </button>
    </form>
  );
}
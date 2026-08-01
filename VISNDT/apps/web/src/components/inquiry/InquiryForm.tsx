'use client';

import { useState } from 'react';
import { createInquiry } from '@/services/inquiry.service';
import type { InquiryResponse } from '@/types/inquiry';

interface InquiryFormProps {
  productId: string;
  productName: string;
  offerId: string;
  organizationId: string;
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
          : 'Unable to submit inquiry. Please try again.',
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
            Thank you. Your inquiry has been submitted.
          </h3>
        </div>
        <p className="text-sm text-green-700">
          Our team will contact you shortly at{' '}
          <span className="font-medium">
            {result?.inquiry.visitorEmail || formData.email}
          </span>
          {' '}regarding {productName}.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setResult(null);
          }}
          className="mt-4 text-sm text-green-700 hover:text-green-800 underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  // === Idle / Submitting / Error State ===
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-sm text-slate-900">
        Send Inquiry
      </h3>
      <p className="text-xs text-slate-500">
        Interested in {productName}? Fill out the form below and we will get
        back to you.
      </p>

      {/* Error Banner */}
      {status === 'error' && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="inq-name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Name <span className="text-red-500">*</span>
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
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="inq-email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email <span className="text-red-500">*</span>
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
          placeholder="your@email.com"
        />
      </div>

      {/* Phone (optional) */}
      <div>
        <label
          htmlFor="inq-phone"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Phone <span className="text-slate-400 text-xs">(optional)</span>
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
          Message <span className="text-red-500">*</span>
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
          placeholder="I am interested in this product. Please provide more details."
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
            Submitting...
          </span>
        ) : (
          'Submit Inquiry'
        )}
      </button>
    </form>
  );
}
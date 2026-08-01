'use client';

import { useState } from 'react';
import { createInquiry } from '@/lib/api/inquiries';
import type { InquiryResponse } from '@/types/inquiry';

interface InquiryFormProps {
  productId: string;
  productName: string;
  offerId?: string;
  organizationId?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function InquiryForm({
  productId,
  productName,
  offerId = '',
  organizationId = '',
}: InquiryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
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
        offerId: offerId || productId, // fallback: use productId if no offerId
        organizationId: organizationId || productId, // fallback: use productId if no orgId
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      });

      setResult(res);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.',
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <h3 className="font-semibold text-green-800 mb-2">Inquiry Submitted!</h3>
        <p className="text-sm text-green-700">
          Thank you for your interest in {productName}. Our team will contact you
          shortly at {result?.inquiry.visitorEmail || formData.email}.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-sm">Send Inquiry</h3>
      <p className="text-xs text-muted-foreground">
        Interested in {productName}? Fill out the form below and we will get back to you.
      </p>

      {status === 'error' && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div>
        <label htmlFor="inq-name" className="block text-sm font-medium mb-1">
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
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="inq-email" className="block text-sm font-medium mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="inq-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="inq-phone" className="block text-sm font-medium mb-1">
          Phone
        </label>
        <input
          id="inq-phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          maxLength={30}
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="+86-13800138000"
        />
      </div>

      <div>
        <label htmlFor="inq-message" className="block text-sm font-medium mb-1">
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
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
          placeholder="I am interested in this product. Please provide more details."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
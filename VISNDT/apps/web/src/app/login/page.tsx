'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/auth/AuthProvider';
import Link from 'next/link';

type FormStatus = 'idle' | 'submitting' | 'error';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      await login(email, password);
      router.replace('/workspace/dashboard');
    } catch (err) {
      setStatus('error');
      if (err instanceof Error) {
        const msg = err.message;
        if (msg.includes('401') || msg.includes('Unauthorized')) {
          setErrorMsg('邮箱或密码错误，请重试。');
        } else {
          setErrorMsg(msg);
        }
      } else {
        setErrorMsg('发生未知错误，请重试。');
      }
    }
  };

  return (
    <div className="min-h-screen bg-industrial-slate flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl border border-slate-200/80 shadow-industrial-lg p-8 relative">
        <div className="h-1 bg-gradient-to-r from-primary to-industrial-cyan rounded-t-xl absolute top-0 left-0 right-0" />
        <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">登录</h1>
        <p className="text-slate-500 mt-2">登录您的账户</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Banner */}
        {status === 'error' && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'submitting'}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
            placeholder="请输入邮箱"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            密码 <span className="text-red-500">*</span>
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={status === 'submitting'}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-2.5 bg-gradient-to-r from-primary to-industrial-cyan text-white rounded-lg text-sm font-semibold shadow-industrial-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              登录中...
            </span>
          ) : (
            '登录'
          )}
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-slate-500">
          还没有账户？{' '}
          <Link
            href="/register"
            className="text-slate-900 font-medium hover:underline"
          >
            注册
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
}

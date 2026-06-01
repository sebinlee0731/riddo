'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import api from '@/lib/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken } = res.data.data;
      localStorage.setItem('accessToken', accessToken);

      if (redirect?.startsWith('/chat/')) {
        const sessionId = redirect.split('/chat/')[1];
        if (sessionId && sessionId !== 'new') {
          await api.patch(
            `/sessions/${sessionId}`,
            {},
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
        }
      }

      router.push(redirect ?? '/');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <main className="relative w-[400px] h-[760px] bg-white font-sans overflow-hidden">
      <div className="absolute top-[106px] w-full flex items-center justify-center gap-2 pr-6">
        <div className="relative w-12 h-12">
          <Image src="/logo.svg" alt="Riido" fill className="object-contain" priority />
        </div>
        <h1 className="text-[22px] font-bold text-black tracking-tight">뤼이도 Riido</h1>
      </div>

      <form
        onSubmit={handleLogin}
        className="absolute top-[210px] left-1/2 -translate-x-1/2 w-[280px] flex flex-col items-center gap-6"
      >
        <h2 className="text-[15px] font-semibold text-black tracking-tight">사용자 계정 로그인</h2>

        <div className="w-full flex flex-col gap-3">
          <input
            className="h-11 px-4 w-full bg-white rounded-lg border border-[#dfdfdf] text-sm text-gray-700 placeholder-[#b3b3b3] outline-none focus:border-[#5d4ff9] transition-colors"
            placeholder="email@domain.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="h-11 px-4 w-full bg-white rounded-lg border border-[#dfdfdf] text-sm text-gray-700 placeholder-[#b3b3b3] outline-none focus:border-[#5d4ff9] transition-colors"
            placeholder="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="text-red-500 text-[11px] text-center">{error}</p>}
          <button
            type="submit"
            className="w-full h-11 bg-[#5d4ff9] text-white rounded-lg text-[15px] font-semibold active:opacity-90 transition-opacity mt-2 shadow-sm"
          >
            로그인
          </button>
        </div>
      </form>

      <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 w-[280px] flex items-center gap-2">
        <div className="flex-1 h-px bg-[#e6e6e6]" />
        <button
          type="button"
          onClick={() => router.push('/signup')}
          className="text-[13px] text-[#828282] whitespace-nowrap hover:underline px-2 active:text-black"
        >
          회원가입 하기
        </button>
        <div className="flex-1 h-px bg-[#e6e6e6]" />
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

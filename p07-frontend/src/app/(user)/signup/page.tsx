"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setGeneralError("");

    if (password !== passwordCheck) {
      setGeneralError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await api.post("/auth/signup", { email, password });
      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setEmailError("이미 사용 중인 이메일입니다.");
      } else {
        setGeneralError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <main className="relative w-[400px] h-[760px] bg-white font-sans overflow-hidden">
      <button
        onClick={() => router.push("/login")}
        className="absolute top-[25px] left-[20px] w-8 h-8 flex items-center justify-center z-50 active:opacity-50"
      >
        <div
          className="w-6 h-6 bg-black"
          style={{ maskImage: 'url(/icons/back.svg)', WebkitMaskImage: 'url(/icons/back.svg)', maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }}
        />
      </button>

      <div className="absolute top-[106px] w-full flex items-center justify-center gap-2 pr-6">
        <div className="relative w-12 h-12">
          <Image src="/logo.svg" alt="Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-[22px] font-bold text-black tracking-tight">
          뤼이도 Riido
        </h1>
      </div>

      <div className="absolute top-[239px] w-full flex flex-col items-center">
        <h2 className="text-[15px] font-semibold text-black tracking-tight mb-8">
          회원가입
        </h2>

        <form onSubmit={handleSignUp} className="w-[246px] flex flex-col gap-4">
          <div className="w-full">
            <input
              className={`w-full h-[41px] px-4 bg-white rounded-lg border text-sm text-gray-700 placeholder-[#b3b3b3] outline-none ${emailError ? 'border-red-500' : 'border-[#dfdfdf]'} focus:border-[#5d4ff9]`}
              placeholder="email@domain.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="text-red-500 text-[11px] mt-1 ml-1">{emailError}</p>}
          </div>

          <input
            className="w-full h-[41px] px-4 bg-white rounded-lg border border-[#dfdfdf] text-sm text-gray-700 placeholder-[#b3b3b3] outline-none focus:border-[#5d4ff9]"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className="w-full h-[41px] px-4 bg-white rounded-lg border border-[#dfdfdf] text-sm text-gray-700 placeholder-[#b3b3b3] outline-none focus:border-[#5d4ff9]"
            placeholder="password check"
            type="password"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />

          {generalError && <p className="text-red-500 text-[11px] text-center">{generalError}</p>}

          <button
            type="submit"
            className="w-full h-[41px] bg-[#5d4ff9] text-white rounded-lg text-[15px] font-semibold active:opacity-90 transition-opacity mt-4"
          >
            회원가입
          </button>
        </form>
      </div>
    </main>
  );
}
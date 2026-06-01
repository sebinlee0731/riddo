"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative w-[400px] h-[760px] bg-white font-sans overflow-hidden">
      <div className="absolute top-[22px] left-[25px] flex items-center gap-[10px] h-[66px]">
        <img
          className="w-[68px] h-[66px] object-cover"
          alt="Logo"
          src="/logo.svg"
        />
        <div className="text-[22px] font-bold text-black tracking-[-0.07em] leading-none">
          뤼이도 Riido
        </div>
      </div>

      <div className="absolute top-[106px] left-[25px] w-[349px] h-[190px] bg-white rounded-[30px] border border-solid border-[#0000000d] shadow-[0px_8px_24px_rgba(0,0,0,0.04)]">
        <div className="absolute top-[18px] left-[18px] w-5 h-5 flex items-center justify-center">
          <Image src="/logo.svg" alt="Riido" fill className="object-contain" />
        </div>
        <div className="absolute top-[18px] left-[46px] text-[12px] font-bold text-black h-5 flex items-center">
          Riido
        </div>
        
        <p className="absolute top-[40px] left-[46px] w-[282px] font-medium text-[#3a3a3a] text-[14px] leading-[1.3] break-keep pr-2">
          사용 중 궁금한 점이 있으신가요? 언제든지 질문 해주세요 😉 <br/>
          📄Riido 이용가이드 기반으로 답변해요
        </p>

        <button
          onClick={() => router.push("/chat/new")}
          className="absolute top-[115px] left-[19px] w-[311px] h-[50px] bg-[#5745ff] rounded-[15px] flex items-center justify-center"
        >
          <span className="text-white text-[15px] font-bold">대화 시작하기</span>
        </button>
      </div>

      <div className="absolute top-[308px] left-0 w-full flex justify-center items-center gap-[4px] h-5">
        <div className="relative w-[18px] h-[18px] flex items-center opacity-40">
          <Image src="/icons/channel talk.svg" alt="Talk" fill className="object-contain" />
        </div>
        <div className="text-[#7b7777] text-[10px] flex items-center leading-none translate-y-[0.5px]">
          <span className="font-light">모든 답변에 문서 근거를 함께 제공해요</span>
        </div>
      </div>
    </main>
  );
}
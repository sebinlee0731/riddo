"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [message, setMessage] = useState("");

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
          연락처를 남겨주세요. 오프라인 상태가 되면 문자(알림톡) 및 이메일로 답변 알림을 보내드려요....
        </p>

        <div className="absolute top-[88px] left-[19px] w-[311px] h-[50px] bg-[#f2f2f2] rounded-[15px] flex items-center overflow-hidden">
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메세지를 입력하세요."
            className="w-full h-full bg-transparent px-[18px] text-sm font-medium text-black placeholder-[#979292] outline-none border-none"
          />
        </div>

        <div className="absolute top-[158px] left-0 w-full flex justify-center items-center gap-[4px] h-4">
          <div className="relative w-[14px] h-[14px] flex items-center">
            <Image src="/icons/Clock.svg" alt="Clock" fill className="opacity-40 object-contain" />
          </div>
          <span className="font-semibold text-[#676666] text-[12px] leading-none flex items-center translate-y-[0.5px]">
            내일 오전 11:00부터 운영해요
          </span>
        </div>
      </div>

      <div className="absolute top-[308px] left-0 w-full flex justify-center items-center gap-[4px] h-5">
        <div className="relative w-[18px] h-[18px] flex items-center opacity-40">
          <Image src="/icons/channel talk.svg" alt="Talk" fill className="object-contain" />
        </div>
        <div className="text-[#7b7777] text-[10px] flex items-center leading-none translate-y-[0.5px]">
          <span className="font-semibold mr-[4px]">채널톡</span>
          <span className="font-light">이용중</span>
        </div>
      </div>
    </main>
  );
}
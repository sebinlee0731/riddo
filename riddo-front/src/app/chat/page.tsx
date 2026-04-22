"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
}

export default function ChatLogPage() {
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/logs/chat/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatSessions(res.data.data);
      } catch {
        setChatSessions([]);
      }
    };
    fetchHistory();
  }, []);

  return (
    <main className="relative w-[400px] h-[760px] bg-white font-sans overflow-hidden">
      <header className="pt-[25px] px-[25px] pb-[20px]">
        <h1 className="text-[22px] font-bold text-black tracking-tight">대화</h1>
      </header>

      <div className="px-[25px]">
        {chatSessions.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id}>
            <div className="flex items-start gap-3 py-4">
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image src="/logo.svg" alt="Riido" fill className="object-contain" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] text-black">{chat.title || "뤼이도 Riido"}</span>
                  <span className="text-[12px] text-[#959595] font-light">{chat.time}</span>
                </div>
                <p className="text-[14px] text-[#3a3a3a] font-medium">{chat.lastMessage}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute top-[170px] left-[25px] right-[25px] h-[1px] bg-[#f0f0f0]" />

      {chatSessions.length === 0 && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pb-[67px]">
            <p className="text-[#b3b3b3] text-[14px] font-medium">대화기록 없음</p>
          </div>
          <div className="absolute bottom-[100px] left-0 right-0 flex justify-center">
            <button
              onClick={() => router.push("/chat/new")}
              className="bg-[#5745ff] text-white text-[15px] font-bold px-8 py-3.5 rounded-full shadow-md active:opacity-80 transition-opacity"
            >
              대화 시작하기
            </button>
          </div>
        </>
      )}
    </main>
  );
}
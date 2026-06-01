"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface ChatSession {
  sessionId: string;
  startedAt: string;
  preview: string;
  messageCount: number;
}

export default function ChatLogPage() {
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/logs/chat/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessions = res.data.data?.sessions;
      setChatSessions(Array.isArray(sessions) ? sessions : []);
    } catch {
      setChatSessions([]);
    }
  };

  const handleDelete = async (sessionId: string) => {
    const confirmed = window.confirm("삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/logs/chat/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatSessions((prev) => prev.filter((c) => c.sessionId !== sessionId));
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm("전체 대화기록을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
      await Promise.all(
        chatSessions.map((chat) =>
          api.delete(`/logs/chat/${chat.sessionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setChatSessions([]);
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="relative w-[400px] h-[760px] bg-white font-sans overflow-hidden flex flex-col">
      <header className="pt-[25px] px-[25px] pb-[20px] flex items-center justify-between shrink-0">
        <h1 className="text-[22px] font-bold text-black tracking-tight">대화</h1>
        {chatSessions.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="text-[12px] text-red-400 font-medium hover:text-red-600 transition-colors"
          >
            전체삭제
          </button>
        )}
      </header>

      <div className="h-[1px] bg-[#f0f0f0] mx-[25px] shrink-0" />

      <div className="flex-1 overflow-y-auto px-[25px]">
        {chatSessions.map((chat) => (
          <div key={chat.sessionId} className="flex items-center gap-2 border-b border-[#f0f0f0]">
            <Link href={`/chat/${chat.sessionId}`} className="flex items-start gap-3 flex-1 py-4">
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image src="/logo.svg" alt="Riido" fill className="object-contain" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] text-black">뤼이도 Riido</span>
                  <span className="text-[12px] text-[#959595] font-light">
                    {new Date(chat.startedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[14px] text-[#3a3a3a] font-medium">{chat.preview || "대화 내용 없음"}</p>
              </div>
            </Link>
            <button
              onClick={() => handleDelete(chat.sessionId)}
              className="text-[#c0c0c0] text-[12px] font-medium hover:text-red-400 transition-colors shrink-0"
            >
              삭제
            </button>
          </div>
        ))}
      </div>

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
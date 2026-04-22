"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers: any = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        if (params.id === "new") {
          const res = await api.post("/chat/session", {}, { headers });
          const newSessionId = res.data.data.sessionId;
          setSessionId(newSessionId);
          router.replace(`/chat/${newSessionId}`);
        } else {
          setSessionId(params.id as string);
        }
      } catch {
        router.replace("/chat");
      }
    };
    initSession();
  }, [params.id, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!showEmojiPicker || !emojiPickerRef.current) return;
    const container = emojiPickerRef.current;
    container.innerHTML = "";
    import("emoji-picker-element").then(() => {
      const picker = document.createElement("emoji-picker");
      picker.setAttribute("locale", "ko");
      picker.style.width = "100%";
      picker.style.height = "100%";
      picker.style.border = "none";
      picker.style.borderRadius = "20px";
      picker.addEventListener("emoji-click", (e: any) => {
        setMessage((prev) => prev + e.detail.unicode);
        setShowEmojiPicker(false);
      });
      container.appendChild(picker);
    });
  }, [showEmojiPicker]);

  const handleSend = async () => {
    if (!message.trim() || !sessionId || isStreaming) return;

    const userMessage = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsStreaming(true);

    try {
      const token = localStorage.getItem("accessToken");
      const headers: any = {
        "x-session-id": sessionId,
        Accept: "text/event-stream",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "오류가 발생했습니다. 다시 시도해주세요." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log("파일 선택:", file.name);
    setShowAttachMenu(false);
  };

  return (
    <main className="relative w-[400px] h-[760px] bg-[#f0f0ff] font-sans overflow-hidden flex flex-col">
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 z-20 h-[70px] shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 bg-black" style={{ maskImage: 'url(/icons/back.svg)', WebkitMaskImage: 'url(/icons/back.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }} />
          </button>
          <div className="relative w-9 h-9">
            <Image src="/logo.svg" alt="Riido" fill className="object-contain" priority />
          </div>
          <h1 className="text-[18px] font-bold text-black tracking-tight flex items-center h-full">뤼이도 Riido</h1>
        </div>
        <div className="w-10 h-10 flex items-center justify-center mr-1">
          <div className="w-8 h-8 bg-[#959595]" style={{ maskImage: 'url(/icons/icon-profile.svg)', WebkitMaskImage: 'url(/icons/icon-profile.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="bg-white rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] p-6 shadow-sm w-[310px]">
            <p className="text-[14px] leading-relaxed text-[#3a3a3a] font-medium">
              사용 중 궁금한 점이 있으신가요? 언제든지 질문 해주세요 😉
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="bg-[#5745ff] text-white px-6 py-3.5 rounded-[22px] text-[14px] font-bold shadow-md max-w-[280px]">
                {msg.content}
              </div>
            ) : (
              <div className="bg-white rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] p-6 shadow-sm max-w-[310px]">
                <p className="text-[14px] leading-relaxed text-[#3a3a3a] font-medium">
                  {msg.content}
                  {isStreaming && i === messages.length - 1 && (
                    <span className="inline-block w-1 h-4 bg-gray-400 animate-pulse ml-1" />
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showAttachMenu && (
        <>
          <div className="absolute inset-0 z-30" onClick={() => setShowAttachMenu(false)} />
          <div className="absolute bottom-[88px] left-4 z-40 bg-white rounded-[20px] shadow-lg border border-black/5 overflow-hidden w-[180px]">
            <button
              onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false); }}
              className="w-full flex items-center gap-3 px-5 py-4 text-[14px] font-bold text-[#3a3a3a] active:bg-gray-50"
            >
              <div className="w-5 h-5 bg-[#5745ff]" style={{ maskImage: 'url(/icons/icon-file.svg)', WebkitMaskImage: 'url(/icons/icon-file.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }} />
              파일
            </button>
            <div className="h-px bg-black/5 mx-4" />
            <button
              onClick={() => { imageInputRef.current?.click(); setShowAttachMenu(false); }}
              className="w-full flex items-center gap-3 px-5 py-4 text-[14px] font-bold text-[#3a3a3a] active:bg-gray-50"
            >
              <div className="w-5 h-5 bg-[#5745ff]" style={{ maskImage: 'url(/icons/icon-image.svg)', WebkitMaskImage: 'url(/icons/icon-image.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }} />
              사진
            </button>
            <div className="h-px bg-black/5 mx-4" />
            <button
              onClick={() => { setShowAttachMenu(false); setShowEmojiPicker(true); }}
              className="w-full flex items-center gap-3 px-5 py-4 text-[14px] font-bold text-[#3a3a3a] active:bg-gray-50"
            >
              <div className="w-5 h-5 bg-[#5745ff]" style={{ maskImage: 'url(/icons/icon-emoji.svg)', WebkitMaskImage: 'url(/icons/icon-emoji.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }} />
              이모티콘
            </button>
          </div>
        </>
      )}

      {showEmojiPicker && (
        <>
          <div className="absolute inset-0 z-30" onClick={() => setShowEmojiPicker(false)} />
          <div
            ref={emojiPickerRef}
            className="absolute bottom-[88px] left-4 right-4 z-40 rounded-[20px] overflow-hidden shadow-lg"
            style={{ height: "340px" }}
          />
        </>
      )}

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

      <footer className="bg-white p-4 pb-8 flex items-center gap-3 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] z-20">
        <button
          onClick={() => setShowAttachMenu((prev) => !prev)}
          className="w-8 h-8 flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-[#5745ff]" style={{ maskImage: 'url(/icons/icon-grid.svg)', WebkitMaskImage: 'url(/icons/icon-grid.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }} />
        </button>
        <div className="flex-1 h-[48px] bg-[#f2f2f2] rounded-full flex items-center px-5">
          <input
            ref={messageInputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메세지를 입력하세요."
            className="w-full bg-transparent text-[14px] font-medium outline-none placeholder-[#979292]"
          />
        </div>
        <button onClick={handleSend} className="w-8 h-8 flex items-center justify-center">
          <div className="w-6 h-6 bg-[#5745ff]" style={{ maskImage: 'url(/icons/icon-send.svg)', WebkitMaskImage: 'url(/icons/icon-send.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }} />
        </button>
      </footer>
    </main>
  );
}
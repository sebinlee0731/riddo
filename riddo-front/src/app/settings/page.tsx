"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToggleSwitch from "@/components/ToggleSwitch";
import api from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [notificationSound, setNotificationSound] = useState(true);
  const [smsOptOut, setSmsOptOut] = useState(false);
  const [emailOptOut, setEmailOptOut] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("한국어");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmail(res.data.data.email);
      } catch {
        router.replace("/login");
      }
    };
    fetchMe();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("정말 탈퇴하시겠습니까?");
    if (!confirm) return;
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("accessToken");
      router.push("/login");
    } catch {
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword.length < 6) {
      setPasswordError("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      await api.patch("/auth/password", { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordSuccess("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setPasswordError("현재 비밀번호가 올바르지 않습니다.");
      } else {
        setPasswordError("비밀번호 변경 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <main className="relative w-[400px] h-[760px] bg-white font-sans overflow-hidden flex flex-col">
      <header className="pt-[25px] px-[25px] shrink-0">
        <h1 className="text-[22px] font-bold text-black tracking-tight">설정</h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-[80px]">
        <section className="flex flex-col items-center mt-8">
          <div className="relative w-[70px] h-[70px] mb-3">
            <div
              className="w-full h-full bg-[#959595]"
              style={{
                maskImage: 'url(/icons/icon-profile.svg)',
                WebkitMaskImage: 'url(/icons/icon-profile.svg)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat'
              }}
            />
          </div>
          <p className="text-[#b3b3b3] text-[13px] font-medium mb-4">{email || "불러오는 중..."}</p>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f2f2] rounded-[5px] border border-black/5"
          >
            <div
              className="w-3.5 h-3.5 bg-[#939393]"
              style={{ maskImage: 'url(/icons/icon-edit.svg)', WebkitMaskImage: 'url(/icons/icon-edit.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }}
            />
            <span className="text-[#939393] text-[11px] font-bold">정보 수정하기</span>
          </button>
        </section>

        <div className="mt-8 px-4">
          <div className="h-px bg-black/5 w-full mb-5" />
          <div className="px-2">
            <h2 className="text-[#8f8e8e] text-[11px] font-bold mb-5">상담 환경</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 bg-[#646665]"
                  style={{ maskImage: 'url(/icons/icon-world.svg)', WebkitMaskImage: 'url(/icons/icon-world.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }}
                />
                <span className="text-[#646665] text-[13px] font-bold">언어</span>
              </div>
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="text-[#646665] text-[12px] font-bold flex items-center gap-1 active:opacity-50"
              >
                {selectedLang} <span className="text-[14px] translate-y-[-1px] opacity-40">&gt;</span>
              </button>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 bg-[#646665]"
                  style={{ maskImage: 'url(/icons/icon-bell.svg)', WebkitMaskImage: 'url(/icons/icon-bell.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }}
                />
                <span className="text-[#646665] text-[13px] font-bold">알림음</span>
              </div>
              <ToggleSwitch initialValue={notificationSound} onChange={setNotificationSound} />
            </div>
          </div>

          <div className="h-px bg-black/5 w-full my-5" />

          <div className="px-2">
            <h2 className="text-[#8f8e8e] text-[11px] font-bold mb-5">광고 수신 설정</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 bg-[#646665]"
                  style={{ maskImage: 'url(/icons/icon-sms-block.svg)', WebkitMaskImage: 'url(/icons/icon-sms-block.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }}
                />
                <span className="text-[#646665] text-[13px] font-bold">문자 수신거부</span>
              </div>
              <ToggleSwitch initialValue={smsOptOut} onChange={setSmsOptOut} />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 bg-[#646665]"
                  style={{ maskImage: 'url(/icons/icon-mail-block.svg)', WebkitMaskImage: 'url(/icons/icon-mail-block.svg)', maskSize: 'contain', WebkitMaskSize: 'contain' }}
                />
                <span className="text-[#646665] text-[13px] font-bold">이메일 수신거부</span>
              </div>
              <ToggleSwitch initialValue={emailOptOut} onChange={setEmailOptOut} />
            </div>
          </div>

          <div className="h-px bg-black/5 w-full my-5" />

          <div className="px-2 pb-10 flex justify-end gap-5">
            <button
              onClick={handleLogout}
              className="text-[#828282] text-[12px] font-medium hover:text-gray-600 transition-colors"
            >
              로그아웃
            </button>
            <button
              onClick={handleDeleteAccount}
              className="text-red-400 text-[12px] font-medium hover:text-red-600 transition-colors"
            >
              회원탈퇴
            </button>
          </div>
        </div>
      </div>

      {isPasswordModalOpen && (
        <div
          className="absolute inset-0 bg-black/20 z-[60] flex items-end justify-center"
          onClick={() => {
            setIsPasswordModalOpen(false);
            setPasswordError("");
            setPasswordSuccess("");
          }}
        >
          <div
            className="w-full bg-white rounded-t-[30px] p-8 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[16px] font-bold text-black">비밀번호 변경</span>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="text-[20px] text-gray-400"
              >×</button>
            </div>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-[44px] px-4 bg-[#f2f2f2] rounded-xl text-[14px] outline-none"
                required
              />
              <input
                type="password"
                placeholder="새 비밀번호 (6자 이상)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-[44px] px-4 bg-[#f2f2f2] rounded-xl text-[14px] outline-none"
                required
              />
              {passwordError && <p className="text-red-500 text-[12px]">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-500 text-[12px]">{passwordSuccess}</p>}
              <button
                type="submit"
                className="w-full h-[44px] bg-[#5745ff] text-white rounded-xl text-[15px] font-bold mt-2 active:opacity-80 transition-opacity"
              >
                변경하기
              </button>
            </form>
          </div>
        </div>
      )}

      {isLangModalOpen && (
        <div
          className="absolute inset-0 bg-black/20 z-[60] flex items-end justify-center"
          onClick={() => setIsLangModalOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-[30px] p-8 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[16px] font-bold text-black">언어 설정</span>
              <button onClick={() => setIsLangModalOpen(false)} className="text-[20px] text-gray-400">×</button>
            </div>
            <div
              className="flex items-center justify-between py-4 cursor-pointer"
              onClick={() => { setSelectedLang("한국어"); setIsLangModalOpen(false); }}
            >
              <span className="text-[15px] font-medium text-black">한국어</span>
              <div className="w-5 h-5 rounded-full border-2 border-[#5745ff] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5745ff]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
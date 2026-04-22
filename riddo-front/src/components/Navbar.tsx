"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // 상세 채팅방이거나 로그인, 회원가입 페이지일 때 Navbar 숨김
  const isChatRoom = pathname.startsWith('/chat/') && pathname !== '/chat';
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  if (isChatRoom || isAuthPage) {
    return null;
  }

  const menuItems = [
    { name: '홈', path: '/', icon: '/icons/nav-home.svg', isExternal: false },
    { name: '대화', path: '/chat', icon: '/icons/nav-chat.svg', isExternal: false },
    { name: '이용가이드', path: 'https://docs.riido.io', icon: '/icons/nav-guide.svg', isExternal: true },
    { name: '설정', path: '/settings', icon: '/icons/nav-settings.svg', isExternal: false },
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full h-[67px] bg-white z-50 flex justify-center items-center border-t border-gray-100">
      <div className="flex justify-between w-full max-w-[360px] px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/chat' && pathname.startsWith('/chat'));
          
          const content = (
            <div className="flex flex-col items-center justify-center w-[70px] cursor-pointer">
              <div className="relative w-7 h-7 mb-1 flex items-center justify-center">
                <div 
                  className={`w-7 h-7 ${isActive ? 'bg-[#5745ff]' : 'bg-[#959595]'}`}
                  style={{ 
                    maskImage: `url(${item.icon})`, 
                    WebkitMaskImage: `url(${item.icon})`, 
                    maskSize: 'contain', 
                    WebkitMaskSize: 'contain', 
                    maskRepeat: 'no-repeat', 
                    WebkitMaskRepeat: 'no-repeat' 
                  }}
                />
              </div>
              <span className={`w-full text-center text-[12px] font-medium leading-none tracking-tighter ${isActive ? 'text-[#5745ff]' : 'text-[#959595]'}`}>
                {item.name}
              </span>
            </div>
          );

          if (item.isExternal) {
            return (
              <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            );
          }

          return (
            <Link key={item.path} href={item.path}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
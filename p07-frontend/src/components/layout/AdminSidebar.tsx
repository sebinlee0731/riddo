'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

const NAV = [
  {
    group: 'MANAGEMENT',
    items: [
      {
        label: '문서 관리',
        href: '/admin/documents',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: '미해결 질문',
        href: '/admin/unanswered',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'ANALYSIS',
    items: [
      {
        label: '통계',
        href: '/admin/analytics',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'PREFERENCES',
    items: [
      {
        label: '테마 변경',
        href: '/admin/theme',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        ),
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0 bg-white dark:bg-[#0f1122] border-r border-gray-100 dark:border-[#1e2235]">
      {/* 로고 */}
      <div className="px-5 py-5 border-b border-gray-100 dark:border-[#1e2235]">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 shrink-0">
            <Image src="/logo.svg" alt="Riido" fill className="object-contain" priority />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Riido Admin</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Management Console</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-2 mb-1.5">
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                // 테마 변경은 페이지 이동 없이 토글
                if (item.href === '/admin/theme') {
                  return (
                    <li key={item.href}>
                      <button
                        onClick={toggle}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2235] hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <span>{item.icon}</span>
                        {item.label}
                        {/* 현재 테마 표시 뱃지 */}
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-[#2a2f45] text-gray-400">
                          {theme === 'dark' ? '🌙' : '☀️'}
                        </span>
                      </button>
                    </li>
                  );
                }

                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-[#6d28d9]/10 dark:bg-[#6d28d9]/20 text-[#6d28d9] dark:text-purple-400'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2235] hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      <span className={active ? 'text-[#6d28d9] dark:text-purple-400' : ''}>{item.icon}</span>
                      {item.label}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6d28d9] dark:bg-purple-400" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* 하단 유저 정보 */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-[#1e2235]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">Admin User</p>
            <p className="text-[10px] text-gray-400 truncate">admin@riido.io</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

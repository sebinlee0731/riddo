import AuthGuard from "@/components/AuthGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopNav from "@/components/layout/AdminTopNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // <AuthGuard> 개발동안 잠시 꺼두겠음
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1122] transition-colors duration-200">
        <AdminSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <AdminTopNav />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    // </AuthGuard>
  );
}

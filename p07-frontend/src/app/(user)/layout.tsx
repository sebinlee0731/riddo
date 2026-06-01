import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-[400px] h-[760px] bg-white shadow-2xl overflow-hidden">
        <AuthGuard>
          {children}
        </AuthGuard>
        <Navbar />
      </div>
    </div>
  );
}
import { Metadata } from "next";
import Navbar from "@/components/Navbar/index";
import Sidebar from "@/components/Sidebar/index";

export const metadata: Metadata = {
  title: "Home - 1MomentGlobal",
  description: "Welcome to 1MomentGlobal",
};

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
            {/* Aquí puedes agregar el contenido principal de tu dashboard */}
          </div>
        </main>
      </div>
    </div>
  );
}

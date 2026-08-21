import { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  Activity,
  Link as LinkIcon,
  Crown,
  FileText,
  Megaphone,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/owner", icon: LayoutDashboard },
  { label: "Bots", path: "/owner/bots", icon: Bot },
  { label: "Estados", path: "/owner/bot-status", icon: Activity },
  { label: "Contenido", path: "/owner/content", icon: FileText },
  { label: "Enlaces", path: "/owner/links", icon: LinkIcon },
  { label: "Premium", path: "/owner/premium", icon: Crown },
  { label: "Anuncios", path: "/owner/announcements", icon: Megaphone },
  { label: "Configuracion", path: "/owner/settings", icon: Settings },
  { label: "Seguridad", path: "/owner/security", icon: Shield },
];

export function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/owner/login");
  };

  const isActive = (path: string) => {
    if (path === "/owner") return location.pathname === "/owner";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-dark-500">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-dark-400/50 backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <Link to="/owner" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display text-sm font-bold text-white">Alyvex</span>
              <span className="block text-xs text-gray-500">Panel Owner</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary-500/15 text-primary-300 border border-primary-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon size={18} className={active ? "text-primary-400" : "text-gray-500"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error-400 hover:bg-error-500/10 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-dark-400 border-r border-white/10 animate-slide-in-right overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500">
                  <Zap size={18} className="text-white" />
                </div>
                <span className="font-display text-sm font-bold text-white">Alyvex Panel</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-3 space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-primary-500/15 text-primary-300"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error-400 hover:bg-error-500/10"
              >
                <LogOut size={18} />
                Cerrar sesion
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-dark-400/50 backdrop-blur-xl sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-300 hover:bg-white/5"
          >
            <Menu size={22} />
          </button>
          <span className="font-display text-sm font-bold text-white">Alyvex Panel</span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

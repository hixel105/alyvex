import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, AlertCircle, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function OwnerLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await login(password);
      navigate("/owner", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesion";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" style={{ backgroundSize: "50px 50px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl animate-glow-pulse" />

      <div className="relative w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-30" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 glow-primary">
                <Zap size={28} className="text-white" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Panel Owner</h1>
            <p className="text-sm text-gray-500 mt-1">Alyvex Community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-[42px] text-gray-500 z-10" />
              <Input
                type="password"
                label="Contraseña"
                placeholder="Introduce la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error || undefined}
                className="pl-11"
                autoFocus
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-error-500/20 bg-error-500/5 px-4 py-2.5">
                <AlertCircle size={16} className="text-error-400 shrink-0" />
                <span className="text-sm text-error-400">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="w-full"
              disabled={loading || !password}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando sesion...
                </>
              ) : (
                <>
                  Iniciar sesion
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Acceso restringido solo para el propietario
          </p>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function OwnerPanelSection() {
  return (
    <section id="community" className="relative py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="relative glass-card p-8 rounded-3xl overflow-hidden text-center">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-30" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/10">
                  <Lock size={28} className="text-primary-300" />
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Panel Owner
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              Administracion exclusiva de Alyvex Community.
            </p>

            <Link to="/owner/login">
              <Button size="md" variant="outline">
                <Lock size={16} />
                Acceder al Panel Owner
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

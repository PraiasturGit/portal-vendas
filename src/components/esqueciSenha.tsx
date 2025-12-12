"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/service/api"; // Ajuste o import conforme sua estrutura

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordModal({
  isOpen,
  onOpenChange,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      // Ajuste a rota para bater com seu backend
      await api.post("/auth/recuperar-senha", { email });

      setFeedback({
        type: "success",
        message: "Se o e-mail existir, você receberá um link em breve.",
      });
      setEmail(""); // Limpa o campo
    } catch (error: any) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Erro ao enviar solicitação. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  // Reseta o estado quando o modal fecha/abre
  function handleOpenChange(open: boolean) {
    if (!open) {
      setFeedback(null);
      setEmail("");
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Recuperar Senha</DialogTitle>
          <DialogDescription className="text-gray-500">
            Digite seu e-mail abaixo para receber o link de redefinição.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
              E-mail Cadastrado
            </label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 focus:bg-white border-gray-200 focus:border-orange-500 text-gray-900"
              required
            />
          </div>

          {/* Feedback Visual */}
          {feedback && (
            <div
              className={`p-3 rounded-md text-sm flex items-start gap-2 ${
                feedback.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button, buttonVariants } from "@/components/ui/button";
import { useMontado } from "@/hooks/use-montado";
import { useI18n } from "@/lib/i18n/cliente";
import { cn } from "@/lib/utils";

type Props = Pick<React.ComponentProps<typeof Button>, "variant" | "size" | "className">;

export function ThemeToggle({ variant = "ghost", size = "icon", className }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  // O tema resolvido só existe no cliente; até lá renderizamos um placeholder
  // do mesmo tamanho para não deslocar o header na hidratação. O `ghost` no
  // placeholder é o que o deixa invisível mesmo quando o botão real é outline.
  const montado = useMontado();

  if (!montado) {
    return (
      <div
        className={cn(buttonVariants({ variant: "ghost", size }), className)}
        aria-hidden
      />
    );
  }

  const escuro = resolvedTheme === "dark";

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      aria-label={escuro ? t.comum.temaClaro : t.comum.temaEscuro}
      onClick={() => setTheme(escuro ? "light" : "dark")}
    >
      {escuro ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

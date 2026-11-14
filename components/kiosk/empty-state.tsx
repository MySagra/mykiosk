"use client";

import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ envVars }: { envVars: string[] }) {
  const { t } = useTranslation();

  return (
    <Card className="mx-auto w-full max-w-2xl border-dashed">
      <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
        <Settings2 className="size-14 text-primary" aria-hidden />
        <h2 className="text-3xl font-semibold">{t("emptyState.title")}</h2>
        <p className="text-lg text-muted-foreground">{t("emptyState.description")}</p>
        <ul className="flex flex-wrap justify-center gap-2">
          {envVars.map((name) => (
            <li key={name} className="rounded-md bg-muted px-3 py-1 font-mono text-base">
              {name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

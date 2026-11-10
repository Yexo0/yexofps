// src/components/shell/shortcuts-dialog.tsx — Panneau d'aide aux raccourcis clavier ("?").
"use client";

import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { Keyboard, X } from "lucide-react";
import { SPACES } from "@/config/spaces";
import { useUI } from "./ui-provider";

export function ShortcutsDialog() {
  const t = useTranslations("shortcuts");
  const tNav = useTranslations("nav");
  const { helpOpen, setHelpOpen } = useUI();

  const general = [
    { keys: ["Ctrl", "K"], label: t("palette"), alt: ["⌘", "K"] },
    { keys: ["?"], label: t("help") },
    { keys: ["Esc"], label: t("close") },
  ];

  return (
    <Dialog.Root open={helpOpen} onOpenChange={setHelpOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="dialog p-5 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="icon-pill" aria-hidden="true">
              <Keyboard size={17} />
            </span>
            <div className="flex-1">
              <Dialog.Title className="text-[15px] font-bold">{t("title")}</Dialog.Title>
              <Dialog.Description className="font-mono text-[11.5px] text-dim">{t("subtitle")}</Dialog.Description>
            </div>
            <Dialog.Close className="icon-btn -mr-2 -mt-2" aria-label={t("close")}>
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </div>

          <h3 className="label mb-2">{t("spaces")}</h3>
          <dl className="mb-5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {SPACES.map((s, i) => (
              <div key={s.id} className="tile flex items-center justify-between gap-3 px-3 py-2">
                <dt className="text-sm">{tNav(`spaces.${s.id}`)}</dt>
                <dd>
                  <kbd className="kbd">{i + 1}</kbd>
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="label mb-2">{t("general")}</h3>
          <dl className="grid gap-1.5">
            {general.map((g) => (
              <div key={g.label} className="tile flex items-center justify-between gap-3 px-3 py-2">
                <dt className="text-sm">{g.label}</dt>
                <dd className="flex items-center gap-1">
                  {g.keys.map((k) => (
                    <kbd key={k} className="kbd">
                      {k}
                    </kbd>
                  ))}
                  {g.alt && (
                    <>
                      <span className="px-1 text-xs text-dim">/</span>
                      {g.alt.map((k) => (
                        <kbd key={k} className="kbd">
                          {k}
                        </kbd>
                      ))}
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-dim">{t("note")}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

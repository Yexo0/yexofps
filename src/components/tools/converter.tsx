// src/components/tools/converter.tsx — Convertisseur de sensibilité (cm/360).
// Calculs identiques à l'ancienne version : yaw CS2 0.022, Valorant 0.07, Apex 0.022, OW2 0.0066,
// cm/360 = (360 × 2.54) / (DPI × sens × yaw), puis sens cible = (360 × 2.54) / (DPI cible × cm/360 × yaw cible).
"use client";

import { useId, useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowDownUp, CircleAlert, RotateCcw } from "lucide-react";
import { GAMES, GAME_KEYS, cm360, round, sensFromCm360, type GameKey } from "@/lib/converter-math";
import { MY_SENS } from "@/config/site";
import { CopyButton } from "@/components/ui/copy-button";
import { DotDigits } from "@/components/ui/dot-digits";
import { Reticle } from "@/components/ui/reticle";
import { cn } from "@/lib/utils";

type Result =
  | { ok: true; sens: number; cm: number; inches: number; edpiFrom: number; edpiTo: number }
  | { ok: false; error: "invalidSens" | "invalidDpi" | "invalidTargetDpi" };

function compute(from: GameKey, to: GameKey, fromSens: string, fromDpi: string, toDpi: string, sameDpi: boolean): Result {
  const s = parseFloat(fromSens.replace(",", "."));
  const d1 = parseFloat(fromDpi.replace(",", "."));
  const d2 = parseFloat((sameDpi ? fromDpi : toDpi).replace(",", "."));

  if (!s || s <= 0) return { ok: false, error: "invalidSens" };
  if (!d1 || d1 <= 0) return { ok: false, error: "invalidDpi" };
  if (!d2 || d2 <= 0) return { ok: false, error: "invalidTargetDpi" };

  const cm = cm360(d1, s, GAMES[from].yaw);
  const out = sensFromCm360(d2, cm, GAMES[to].yaw);

  return {
    ok: true,
    sens: round(out, 4),
    cm: round(cm, 2),
    inches: round(cm / 2.54, 2),
    edpiFrom: round(d1 * s, 0),
    edpiTo: round(d2 * out, 0),
  };
}

function GamePicker({
  legend,
  value,
  onChange,
}: {
  legend: string;
  value: GameKey;
  onChange: (g: GameKey) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="label mb-2">{legend}</legend>
      <div className="grid grid-cols-2 gap-1.5">
        {GAME_KEYS.map((k) => (
          <label key={k} className="relative">
            <input
              type="radio"
              name={name}
              value={k}
              checked={value === k}
              onChange={() => onChange(k)}
              className="peer sr-only"
            />
            <span className="flex min-h-10 cursor-pointer items-center justify-center rounded-full bg-surface-3 px-3 text-center text-[13px] font-semibold text-muted transition-colors hover:text-fg peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
              {GAMES[k].name}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  invalid,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        placeholder={placeholder}
        className={cn("field disabled:opacity-50", invalid && "border-accent")}
      />
    </div>
  );
}

export function Converter() {
  const t = useTranslations("tools.converter");
  const format = useFormatter();
  const [from, setFrom] = useState<GameKey>("valo");
  const [to, setTo] = useState<GameKey>("apex");
  const [fromSens, setFromSens] = useState("0.35");
  const [fromDpi, setFromDpi] = useState("800");
  const [toDpi, setToDpi] = useState("800");
  const [sameDpi, setSameDpi] = useState(true);

  const result = useMemo(
    () => compute(from, to, fromSens, fromDpi, toDpi, sameDpi),
    [from, to, fromSens, fromDpi, toDpi, sameDpi],
  );

  function swap() {
    setFrom(to);
    setTo(from);
    if (!sameDpi) {
      setFromDpi(toDpi);
      setToDpi(fromDpi);
    }
  }

  function loadMine() {
    setFrom(MY_SENS.game);
    setFromSens(MY_SENS.sens);
    setFromDpi(MY_SENS.dpi);
  }

  const num = (n: number, digits = 2) => format.number(n, { maximumFractionDigits: digits });

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* ─── Saisie ─── */}
      <div className="flex flex-col gap-4 lg:col-span-7">
        <div className="tile flex flex-col gap-4 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">{t("from")}</p>
            <button type="button" onClick={loadMine} className="btn btn-ghost btn-sm -mr-2">
              <RotateCcw size={13} aria-hidden="true" />
              {t("mine", { sens: MY_SENS.sens, dpi: MY_SENS.dpi })}
            </button>
          </div>
          <GamePicker legend={t("game")} value={from} onChange={setFrom} />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label={t("sens")}
              value={fromSens}
              onChange={setFromSens}
              invalid={!result.ok && result.error === "invalidSens"}
              placeholder="0.35"
            />
            <Field
              label={t("dpi")}
              value={fromDpi}
              onChange={setFromDpi}
              invalid={!result.ok && result.error === "invalidDpi"}
              placeholder="800"
            />
          </div>
        </div>

        <div className="-my-2 flex justify-center">
          <button type="button" onClick={swap} className="icon-btn bg-surface-3 hover:bg-surface-hover" aria-label={t("swap")}>
            <ArrowDownUp size={17} aria-hidden="true" />
          </button>
        </div>

        <div className="tile flex flex-col gap-4 px-4 py-4">
          <p className="text-sm font-bold">{t("to")}</p>
          <GamePicker legend={t("game")} value={to} onChange={setTo} />
          <div className="grid grid-cols-2 items-end gap-3">
            <Field
              label={t("targetDpi")}
              value={sameDpi ? fromDpi : toDpi}
              onChange={setToDpi}
              disabled={sameDpi}
              invalid={!result.ok && result.error === "invalidTargetDpi"}
              placeholder="800"
            />
            <button
              type="button"
              role="switch"
              aria-checked={sameDpi}
              onClick={() => {
                if (sameDpi) setToDpi(fromDpi);
                setSameDpi(!sameDpi);
              }}
              className="btn btn-tonal min-h-11 justify-start"
            >
              <span
                aria-hidden="true"
                className={cn("relative h-4 w-7 shrink-0 rounded-full transition-colors", sameDpi ? "bg-accent" : "bg-surface-hover")}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-3 w-3 rounded-full bg-surface-solid transition-[left] duration-150",
                    sameDpi ? "left-3.5" : "left-0.5",
                  )}
                />
              </span>
              {t("sameDpi")}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Résultat ─── */}
      <div className="flex flex-col gap-2 lg:col-span-5" aria-live="polite">
        <div className="tile relative flex flex-1 flex-col justify-between gap-6 px-5 py-5">
          <Reticle size={12} inset={8} />
          <div>
            <p className="label">{t("result")}</p>
            <p className="mt-1 text-sm text-muted">{t("in", { game: GAMES[to].name })}</p>
          </div>
          {result.ok ? (
            <p className="text-accent">
              <DotDigits value={String(result.sens)} dot={6} gap={2} />
            </p>
          ) : (
            <p role="alert" className="flex items-center gap-2 text-sm text-fg">
              <CircleAlert size={16} aria-hidden="true" className="text-accent" />
              {t(`errors.${result.error}`)}
            </p>
          )}
          <div>{result.ok && <CopyButton value={String(result.sens)} label={t("result")} variant="primary" />}</div>
        </div>
        <dl className="grid grid-cols-2 gap-2">
          <div className="tile flex flex-col px-4 py-3.5">
            <dd className="order-1 flex items-baseline gap-1.5 leading-none">
              <span className="text-[26px] font-bold tabular-nums">{result.ok ? num(result.cm) : "—"}</span>
              <span className="font-mono text-[11px] text-muted">cm</span>
            </dd>
            <dt className="label order-2 mt-2">cm/360</dt>
            <dd className="order-3 mt-1 text-[11.5px] text-dim">
              {result.ok ? t("in360", { value: num(result.inches) }) : t("cm360Sub")}
            </dd>
          </div>
          <div className="tile flex flex-col px-4 py-3.5">
            <dd className="order-1 text-[26px] font-bold leading-none tabular-nums">
              {result.ok ? num(result.edpiFrom, 0) : "—"}
            </dd>
            <dt className="label order-2 mt-2">eDPI</dt>
            <dd className="order-3 mt-1 text-[11.5px] text-dim">
              {result.ok ? t("edpiTo", { value: num(result.edpiTo, 0) }) : t("edpiSub")}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TURNSTILE_SITE_KEY = import.meta.env["VITE_TURNSTILE_SITE_KEY"]?.trim() ?? "";

export type TurnstileStatus = "loading" | "ready" | "error";

export interface TurnstileWidgetHandle {
  execute: () => Promise<string>;
  reset: () => void;
}

interface TurnstileOptions {
  sitekey: string;
  appearance: "interaction-only";
  execution: "execute";
  callback: (token: string) => void;
  "error-callback": (errorCode: number | string) => boolean;
  "expired-callback": () => void;
  "timeout-callback": () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface PendingExecution {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
  timeoutId: number;
}

export class TurnstileWidgetError extends Error {
  constructor(
    message = "Turnstile verification could not be completed.",
    readonly code?: number | string,
  ) {
    super(message);
    this.name = "TurnstileWidgetError";
  }
}

let turnstileScriptPromise: Promise<TurnstileApi> | undefined;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileScriptPromise) return turnstileScriptPromise;

  const scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.addEventListener(
      "load",
      () => {
        if (window.turnstile) resolve(window.turnstile);
        else reject(new TurnstileWidgetError("Turnstile failed to initialize."));
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => reject(new TurnstileWidgetError("Turnstile could not be loaded.")),
      { once: true },
    );
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    turnstileScriptPromise = undefined;
    throw error;
  });

  turnstileScriptPromise = scriptPromise;
  return scriptPromise;
}

export const TurnstileWidget = forwardRef<
  TurnstileWidgetHandle,
  { onStatusChange: (status: TurnstileStatus) => void }
>(function TurnstileWidget({ onStatusChange }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const pendingRef = useRef<PendingExecution | null>(null);

  const resolvePending = useCallback((token: string) => {
    const pending = pendingRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timeoutId);
    pendingRef.current = null;
    pending.resolve(token);
  }, []);

  const rejectPending = useCallback((error: Error) => {
    const pending = pendingRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timeoutId);
    pendingRef.current = null;
    pending.reject(error);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      execute() {
        const api = window.turnstile;
        const widgetId = widgetIdRef.current;
        if (!api || !widgetId) {
          return Promise.reject(new TurnstileWidgetError("Turnstile is not ready."));
        }
        if (pendingRef.current) {
          return Promise.reject(
            new TurnstileWidgetError("Turnstile verification is already running."),
          );
        }

        return new Promise<string>((resolve, reject) => {
          const timeoutId = window.setTimeout(
            () => rejectPending(new TurnstileWidgetError("Turnstile verification timed out.")),
            120_000,
          );
          pendingRef.current = { resolve, reject, timeoutId };
          try {
            api.execute(widgetId);
          } catch {
            rejectPending(new TurnstileWidgetError());
          }
        });
      },
      reset() {
        const api = window.turnstile;
        const widgetId = widgetIdRef.current;
        rejectPending(new TurnstileWidgetError("Turnstile verification was reset."));
        if (api && widgetId) api.reset(widgetId);
      },
    }),
    [rejectPending],
  );

  useEffect(() => {
    let active = true;
    onStatusChange("loading");

    if (!TURNSTILE_SITE_KEY) {
      onStatusChange("error");
      return () => {
        active = false;
      };
    }

    void loadTurnstile()
      .then((api) => {
        const container = containerRef.current;
        if (!active || !container) return;
        widgetIdRef.current = api.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          execution: "execute",
          callback: resolvePending,
          "error-callback": (errorCode) => {
            rejectPending(
              new TurnstileWidgetError("Turnstile verification failed.", errorCode),
            );
            return true;
          },
          "expired-callback": () =>
            rejectPending(new TurnstileWidgetError("Turnstile token expired.")),
          "timeout-callback": () =>
            rejectPending(new TurnstileWidgetError("Turnstile verification timed out.")),
        });
        onStatusChange("ready");
      })
      .catch(() => {
        if (active) onStatusChange("error");
      });

    return () => {
      active = false;
      rejectPending(new TurnstileWidgetError("Turnstile widget was removed."));
      const widgetId = widgetIdRef.current;
      if (widgetId) window.turnstile?.remove(widgetId);
      widgetIdRef.current = null;
    };
  }, [onStatusChange, rejectPending, resolvePending]);

  return <div ref={containerRef} />;
});

TurnstileWidget.displayName = "TurnstileWidget";

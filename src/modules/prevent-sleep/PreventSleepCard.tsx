import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import type { ModuleCardProps } from "@/app/registry/moduleTypes";
import { CardFrame } from "@/app/ui/CardFrame";

type PreventSleepState = {
  enabled: boolean;
  status: string;
  lastActionAt: string | null;
  lastPulseAt: string | null;
  runtimeError: string | null;
  isDegraded: boolean;
  degradeReason: string | null;
  hotkeyArmed: boolean;
  clickingActive: boolean;
};

type PreventSleepSettings = {
  clickMode?: "idle-keepalive" | "continuous";
  idleActivationSeconds?: number;
  idleRepeatSeconds?: number;
  continuousIntervalSeconds?: number;
  continuousHotkey?: string;
};

type PreventSleepStatus = {
  enabled: boolean;
  lastPulseAt: string | null;
  error: string | null;
  degraded: boolean;
  degradeReason: string | null;
  hotkeyArmed: boolean;
  clickingActive: boolean;
};

const DEFAULT_CLICK_MODE = "idle-keepalive";
const DEFAULT_IDLE_ACTIVATION_SECONDS = 150;
const DEFAULT_IDLE_REPEAT_SECONDS = 5;
const DEFAULT_CONTINUOUS_INTERVAL_SECONDS = 1;
const DEFAULT_CONTINUOUS_HOTKEY = "PgDn";
const STATE_IDLE = "idle";
const STATE_RUNNING = "running";
const STATE_DEGRADED = "degraded";
const STATE_ERROR = "error";
const ERROR_FALLBACK = "防止休眠启动失败";
const SWITCH_LABEL = "防止休眠";
const DEGRADED_FALLBACK = "已降级为鼠标保活";

function readableError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return ERROR_FALLBACK;
}

function statusMessage(state: PreventSleepState) {
  if (state.runtimeError) {
    return state.runtimeError;
  }

  if (state.isDegraded) {
    return state.degradeReason ?? DEGRADED_FALLBACK;
  }

  return "";
}

export function PreventSleepCard({
  manifest,
  state,
  settings,
  isExpanded,
  isActive,
  settingsContent,
  onPatchState,
  onToggleExpand,
}: ModuleCardProps<PreventSleepState>) {
  const [isSwitching, setIsSwitching] = useState(false);
  const onPatchStateRef = useRef(onPatchState);
  const preventSleepSettings = settings as PreventSleepSettings;
  const clickMode = preventSleepSettings.clickMode ?? DEFAULT_CLICK_MODE;
  const idleActivationSeconds =
    preventSleepSettings.idleActivationSeconds ?? DEFAULT_IDLE_ACTIVATION_SECONDS;
  const idleRepeatSeconds =
    preventSleepSettings.idleRepeatSeconds ?? DEFAULT_IDLE_REPEAT_SECONDS;
  const continuousIntervalSeconds =
    preventSleepSettings.continuousIntervalSeconds ?? DEFAULT_CONTINUOUS_INTERVAL_SECONDS;
  const continuousHotkey =
    preventSleepSettings.continuousHotkey ?? DEFAULT_CONTINUOUS_HOTKEY;
  const message = statusMessage(state);

  useEffect(() => {
    onPatchStateRef.current = onPatchState;
  }, [onPatchState]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let cancelled = false;
    const syncStatus = async () => {
      try {
        const nextStatus = await invoke<PreventSleepStatus>("prevent_sleep_status");
        if (cancelled) {
          return;
        }

        onPatchStateRef.current({
          enabled: nextStatus.enabled,
          runtimeError: nextStatus.error,
          isDegraded: nextStatus.degraded,
          degradeReason: nextStatus.degradeReason,
          hotkeyArmed: nextStatus.hotkeyArmed,
          clickingActive: nextStatus.clickingActive,
          status: nextStatus.error
            ? STATE_ERROR
            : nextStatus.degraded
              ? STATE_DEGRADED
              : nextStatus.enabled
                ? STATE_RUNNING
                : STATE_IDLE,
          lastPulseAt: nextStatus.lastPulseAt,
        });
      } catch {
        // Polling is best-effort; command failures still surface immediately.
      }
    };

    const interval = window.setInterval(syncStatus, 10_000);
    void syncStatus();

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || isSwitching) {
      return;
    }

    let cancelled = false;
    const syncConfiguration = async () => {
      try {
        const nextStatus = await invoke<PreventSleepStatus>("prevent_sleep_set_enabled", {
          request: {
            enabled: true,
            clickMode,
            idleActivationSeconds,
            idleRepeatSeconds,
            continuousIntervalSeconds,
            continuousHotkey,
          },
        });

        if (cancelled) {
          return;
        }

        onPatchStateRef.current({
          enabled: nextStatus.enabled,
          runtimeError: nextStatus.error,
          isDegraded: nextStatus.degraded,
          degradeReason: nextStatus.degradeReason,
          hotkeyArmed: nextStatus.hotkeyArmed,
          clickingActive: nextStatus.clickingActive,
          status: nextStatus.error
            ? STATE_ERROR
            : nextStatus.degraded
              ? STATE_DEGRADED
              : nextStatus.enabled
                ? STATE_RUNNING
                : STATE_IDLE,
          lastActionAt: new Date().toISOString(),
          lastPulseAt: nextStatus.lastPulseAt,
        });
      } catch {
        // Best-effort reconfiguration; the main toggle path still surfaces hard failures.
      }
    };

    void syncConfiguration();

    return () => {
      cancelled = true;
    };
  }, [
    isActive,
    isSwitching,
    clickMode,
    idleActivationSeconds,
    idleRepeatSeconds,
    continuousIntervalSeconds,
    continuousHotkey,
  ]);

  const togglePreventSleep = async () => {
    if (isSwitching) {
      return;
    }

    const nextEnabled = !isActive;
    setIsSwitching(true);

    try {
      const nextStatus = await invoke<PreventSleepStatus>("prevent_sleep_set_enabled", {
        request: {
          enabled: nextEnabled,
          clickMode,
          idleActivationSeconds,
          idleRepeatSeconds,
          continuousIntervalSeconds,
          continuousHotkey,
        },
      });

      onPatchState({
        enabled: nextStatus.enabled,
        runtimeError: nextStatus.error,
        isDegraded: nextStatus.degraded,
        degradeReason: nextStatus.degradeReason,
        hotkeyArmed: nextStatus.hotkeyArmed,
        clickingActive: nextStatus.clickingActive,
        status: nextStatus.error
          ? STATE_ERROR
          : nextStatus.degraded
            ? STATE_DEGRADED
            : nextStatus.enabled
              ? STATE_RUNNING
              : STATE_IDLE,
        lastActionAt: new Date().toISOString(),
        lastPulseAt: nextStatus.lastPulseAt,
      });
    } catch (error) {
      onPatchState({
        enabled: isActive,
        runtimeError: readableError(error),
        isDegraded: false,
        degradeReason: null,
        hotkeyArmed: false,
        clickingActive: false,
        status: STATE_ERROR,
        lastActionAt: new Date().toISOString(),
      });
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <CardFrame
      accent={manifest.themeColor}
      title={manifest.title}
      status={message}
      icon={
        <div className="module-mark module-mark--sleep" aria-hidden="true">
          <i />
          <span />
          <span />
          <span />
        </div>
      }
      isExpanded={isExpanded}
      isActive={isActive}
      settingsContent={settingsContent}
      onToggleActive={togglePreventSleep}
      onToggleExpand={onToggleExpand}
      switchLabel={SWITCH_LABEL}
    >
      <div className="module-ambient module-ambient--sleep" aria-hidden="true">
        <i />
        <span />
        <span />
        <span />
      </div>
      {message ? (
        <p
          className={state.runtimeError ? "prevent-sleep-error" : "prevent-sleep-degraded"}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </CardFrame>
  );
}

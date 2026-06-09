export const preventSleepState = {
  enabled: false,
  status: "idle",
  lastActionAt: null as string | null,
  lastPulseAt: null as string | null,
  runtimeError: null as string | null,
  isDegraded: false,
  degradeReason: null as string | null,
  hotkeyArmed: false,
  clickingActive: false,
};

export const preventSleepSettings = {
  clickMode: "idle-keepalive" as "idle-keepalive" | "continuous",
  idleActivationSeconds: 150,
  idleRepeatSeconds: 5,
  continuousIntervalSeconds: 1,
  continuousHotkey: "PgDn",
};

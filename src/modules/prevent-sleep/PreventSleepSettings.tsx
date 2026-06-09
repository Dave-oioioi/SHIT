import type { ChangeEvent } from "react";
import type { ModuleSettingsProps } from "@/app/registry/moduleTypes";
import { SettingsSection } from "@/app/ui/SettingsSection";

type PreventSleepSettingsModel = {
  clickMode: "idle-keepalive" | "continuous";
  idleActivationSeconds: number;
  idleRepeatSeconds: number;
  continuousIntervalSeconds: number;
  continuousHotkey: string;
};

const HOTKEY_OPTIONS = ["PgDn", "PgUp", "End", "Home", "F8", "F9", "F10"] as const;

function clampSeconds(value: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.min(3600, Math.round(value)));
}

export function PreventSleepSettings({
  settings,
  disabled = false,
  onChange,
}: ModuleSettingsProps<PreventSleepSettingsModel>) {
  const updateField = <K extends keyof PreventSleepSettingsModel>(
    key: K,
    value: PreventSleepSettingsModel[K],
  ) => {
    if (disabled) {
      return;
    }

    onChange({
      ...settings,
      [key]: value,
    });
  };

  const updateSeconds =
    (key: "idleActivationSeconds" | "idleRepeatSeconds" | "continuousIntervalSeconds") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const current = settings[key];
      updateField(key, clampSeconds(Number(event.target.value), current));
    };

  return (
    <>
      <SettingsSection
        title="模式"
        description={
          disabled
            ? "模块运行中，先关闭卡片总开关后再调整。"
            : settings.clickMode === "continuous"
              ? "开启后先待命，再按快捷键开始或停止连点。"
              : "开启后按无操作时间自动进入角落双击保活。"
        }
      >
        <div className="prevent-sleep-mode">
          <button
            type="button"
            className="prevent-sleep-mode__chip"
            data-selected={settings.clickMode === "idle-keepalive"}
            disabled={disabled}
            onClick={() => updateField("clickMode", "idle-keepalive")}
          >
            空闲保活
          </button>
          <button
            type="button"
            className="prevent-sleep-mode__chip"
            data-selected={settings.clickMode === "continuous"}
            disabled={disabled}
            onClick={() => updateField("clickMode", "continuous")}
          >
            连续点击
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="空闲保活" description="只在模式为“空闲保活”时生效。">
        <div className="prevent-sleep-fields">
          <label className="prevent-sleep-field">
            <span>多久无操作后激活</span>
            <input
              type="number"
              min={1}
              step={1}
              disabled={disabled}
              value={settings.idleActivationSeconds}
              onChange={updateSeconds("idleActivationSeconds")}
              aria-label="多久无操作后激活"
            />
            <em>秒</em>
          </label>

          <label className="prevent-sleep-field">
            <span>激活后每隔多久角落双击</span>
            <input
              type="number"
              min={1}
              step={1}
              disabled={disabled}
              value={settings.idleRepeatSeconds}
              onChange={updateSeconds("idleRepeatSeconds")}
              aria-label="激活后每隔多久角落双击"
            />
            <em>秒</em>
          </label>
        </div>
      </SettingsSection>

      <SettingsSection title="连续点击" description="只在模式为“连续点击”时生效。">
        <div className="prevent-sleep-fields">
          <label className="prevent-sleep-field">
            <span>快捷键</span>
            <select
              disabled={disabled}
              value={settings.continuousHotkey}
              onChange={(event) => updateField("continuousHotkey", event.target.value)}
              aria-label="连续点击快捷键"
            >
              {HOTKEY_OPTIONS.map((hotkey) => (
                <option key={hotkey} value={hotkey}>
                  {hotkey}
                </option>
              ))}
            </select>
            <em>键</em>
          </label>

          <label className="prevent-sleep-field">
            <span>连点间隔</span>
            <input
              type="number"
              min={1}
              step={1}
              disabled={disabled}
              value={settings.continuousIntervalSeconds}
              onChange={updateSeconds("continuousIntervalSeconds")}
              aria-label="连点间隔"
            />
            <em>秒</em>
          </label>
        </div>
      </SettingsSection>
    </>
  );
}

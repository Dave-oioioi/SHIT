import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModuleManifest } from "@/app/registry/moduleTypes";
import { PreventSleepCard } from "@/modules/prevent-sleep/PreventSleepCard";
import { PreventSleepSettings } from "@/modules/prevent-sleep/PreventSleepSettings";
import { preventSleepSettings, preventSleepState } from "@/modules/prevent-sleep/defaults";

const invokeMock = vi.fn();
const MODULE_TITLE = "\u9632\u6b62\u4f11\u7720";
const TOGGLE_LABEL = "\u9632\u6b62\u4f11\u7720 \u5f00\u5173";
const HOTKEY_LABEL = "\u8fde\u7eed\u70b9\u51fb\u5feb\u6377\u952e";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: (...args: unknown[]) => invokeMock(...args),
}));

const manifest: ModuleManifest = {
  id: "prevent-sleep",
  name: "prevent-sleep",
  version: "0.1.0",
  title: MODULE_TITLE,
  description: "",
  themeColor: "#a7d77b",
  icon: "moon-star",
  defaultSize: "2x1",
  minSize: "2x1",
  order: 2,
  enabledByDefault: true,
  hasSettings: true,
};

function StatefulPreventSleepCard(
  props: Partial<Parameters<typeof PreventSleepCard>[0]> & {
    onPatchStateSpy: ReturnType<typeof vi.fn>;
  },
) {
  const {
    onPatchStateSpy,
    state: initialState,
    settings,
    isActive: _isActive,
    onPatchState: _onPatchState,
    ...overrides
  } = props;
  const [state, setState] = useState({ ...preventSleepState, ...initialState });
  const onPatchState = (partialState: Partial<typeof state>) => {
    onPatchStateSpy(partialState);
    setState((currentState) => ({ ...currentState, ...partialState }));
  };

  return (
    <PreventSleepCard
      moduleId="prevent-sleep"
      manifest={manifest}
      {...overrides}
      state={state}
      settings={{ ...preventSleepSettings, ...settings }}
      isExpanded={false}
      isActive={state.enabled}
      settingsContent={null}
      onPatchState={onPatchState}
      onToggleActive={vi.fn()}
      onToggleExpand={vi.fn()}
    />
  );
}

function renderCard(overrides: Partial<Parameters<typeof PreventSleepCard>[0]> = {}) {
  const onPatchState = vi.fn();

  render(
    <StatefulPreventSleepCard
      {...overrides}
      state={{
        ...preventSleepState,
        enabled: Boolean(overrides.isActive),
        ...overrides.state,
      }}
      onPatchStateSpy={onPatchState}
    />,
  );

  return { onPatchState };
}

describe("PreventSleepCard", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("passes the new idle keepalive defaults when enabling", async () => {
    const user = userEvent.setup();
    invokeMock.mockResolvedValue({
      enabled: true,
      lastPulseAt: null,
      error: null,
      degraded: false,
      degradeReason: null,
      hotkeyArmed: false,
      clickingActive: false,
    });
    renderCard();

    await user.click(screen.getByRole("button", { name: TOGGLE_LABEL }));

    await waitFor(() => {
      expect(invokeMock).toHaveBeenNthCalledWith(1, "prevent_sleep_set_enabled", {
        request: {
          enabled: true,
          clickMode: "idle-keepalive",
          idleActivationSeconds: 150,
          idleRepeatSeconds: 5,
          continuousIntervalSeconds: 1,
          continuousHotkey: "PgDn",
        },
      });
    });
  });

  it("arms continuous mode without starting immediate clicking", async () => {
    const user = userEvent.setup();
    invokeMock.mockResolvedValue({
      enabled: true,
      lastPulseAt: null,
      error: null,
      degraded: false,
      degradeReason: null,
      hotkeyArmed: true,
      clickingActive: false,
    });
    renderCard({
      settings: {
        clickMode: "continuous",
        idleActivationSeconds: 150,
        idleRepeatSeconds: 5,
        continuousIntervalSeconds: 1,
        continuousHotkey: "PgDn",
      },
    });

    await user.click(screen.getByRole("button", { name: TOGGLE_LABEL }));

    await waitFor(() => {
      expect(invokeMock).toHaveBeenNthCalledWith(1, "prevent_sleep_set_enabled", {
        request: {
          enabled: true,
          clickMode: "continuous",
          idleActivationSeconds: 150,
          idleRepeatSeconds: 5,
          continuousIntervalSeconds: 1,
          continuousHotkey: "PgDn",
        },
      });
    });
  });
});

describe("PreventSleepSettings", () => {
  it("defaults to idle keepalive values for the new behavior model", () => {
    expect(preventSleepSettings).toEqual({
      clickMode: "idle-keepalive",
      idleActivationSeconds: 150,
      idleRepeatSeconds: 5,
      continuousIntervalSeconds: 1,
      continuousHotkey: "PgDn",
    });
  });

  it("updates idle keepalive timings from user input", () => {
    const onChange = vi.fn();

    render(
      <PreventSleepSettings
        moduleId="prevent-sleep"
        manifest={manifest}
        settings={{
          clickMode: "idle-keepalive",
          idleActivationSeconds: 150,
          idleRepeatSeconds: 5,
          continuousIntervalSeconds: 1,
          continuousHotkey: "PgDn",
        }}
        onChange={onChange}
      />,
    );

    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0]!, {
      target: { value: "180" },
    });

    expect(onChange).toHaveBeenLastCalledWith({
      clickMode: "idle-keepalive",
      idleActivationSeconds: 180,
      idleRepeatSeconds: 5,
      continuousIntervalSeconds: 1,
      continuousHotkey: "PgDn",
    });
  });

  it("updates the continuous hotkey", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <PreventSleepSettings
        moduleId="prevent-sleep"
        manifest={manifest}
        settings={{
          clickMode: "continuous",
          idleActivationSeconds: 150,
          idleRepeatSeconds: 5,
          continuousIntervalSeconds: 1,
          continuousHotkey: "PgDn",
        }}
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByRole("combobox", { name: HOTKEY_LABEL }), "F9");

    expect(onChange).toHaveBeenLastCalledWith({
      clickMode: "continuous",
      idleActivationSeconds: 150,
      idleRepeatSeconds: 5,
      continuousIntervalSeconds: 1,
      continuousHotkey: "F9",
    });
  });

  it("locks every setting control when the card is already enabled", () => {
    render(
      <PreventSleepSettings
        moduleId="prevent-sleep"
        manifest={manifest}
        settings={{
          clickMode: "continuous",
          idleActivationSeconds: 150,
          idleRepeatSeconds: 5,
          continuousIntervalSeconds: 1,
          continuousHotkey: "PgDn",
        }}
        disabled
        onChange={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("button").every((element) => (element as HTMLButtonElement).disabled)).toBe(true);
    expect(screen.getAllByRole("spinbutton").every((element) => (element as HTMLInputElement).disabled)).toBe(true);
    expect((screen.getByRole("combobox", { name: HOTKEY_LABEL }) as HTMLSelectElement).disabled).toBe(true);
  });
});

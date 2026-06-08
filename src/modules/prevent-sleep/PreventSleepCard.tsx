import type { ModuleCardProps } from "@/app/registry/moduleTypes";
import { CardFrame } from "@/app/ui/CardFrame";

type PreventSleepState = {
  enabled: boolean;
  status: string;
  lastActionAt: string | null;
};

export function PreventSleepCard({
  manifest,
  state,
  isExpanded,
  isActive,
  settingsContent,
  onToggleActive,
  onToggleExpand,
}: ModuleCardProps<PreventSleepState>) {
  const status = isActive
    ? "常亮守护运行中"
    : state.lastActionAt
      ? `最近切换于 ${new Date(state.lastActionAt).toLocaleTimeString()}`
      : state.status;

  return (
    <CardFrame
      accent={manifest.themeColor}
      title={manifest.title}
      status={status}
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
      onToggleActive={onToggleActive}
      onToggleExpand={onToggleExpand}
      switchLabel="防止休眠"
    >
      <div className="module-ambient module-ambient--sleep" aria-hidden="true">
        <i />
        <span />
        <span />
        <span />
      </div>
    </CardFrame>
  );
}

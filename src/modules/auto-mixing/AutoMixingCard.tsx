import type { ModuleCardProps } from "@/app/registry/moduleTypes";
import { CardFrame } from "@/app/ui/CardFrame";

type AutoMixingState = {
  enabled: boolean;
  status: string;
  lastActionAt: string | null;
};

export function AutoMixingCard({
  manifest,
  state,
  isExpanded,
  isActive,
  settingsContent,
  onToggleActive,
  onToggleExpand,
}: ModuleCardProps<AutoMixingState>) {
  const status = isActive
    ? "自动混音运行中"
    : state.lastActionAt
      ? `最近切换于 ${new Date(state.lastActionAt).toLocaleTimeString()}`
      : state.status;

  return (
    <CardFrame
      accent={manifest.themeColor}
      title={manifest.title}
      status={status}
      icon={
        <div className="module-mark module-mark--mix" aria-hidden="true">
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
      switchLabel="自动混音"
    >
      <div className="module-ambient module-ambient--mix" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </CardFrame>
  );
}

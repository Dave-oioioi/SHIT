import { useEffect } from "react";
import { Activity, Box, LayoutGrid, Orbit, PanelRightOpen } from "lucide-react";
import { ModuleCardHost } from "@/app/shell/ModuleCardHost";
import { useRegisteredModules } from "@/app/hooks/useRegisteredModules";
import { useLayoutStore } from "@/app/state/layoutStore";
import { useRegistryStore } from "@/app/state/registryStore";

export function DashboardPage() {
  const modules = useRegisteredModules();
  const diagnostics = useRegistryStore((state) => state.diagnostics);
  const enabledModuleIds = useRegistryStore((state) => state.enabledModuleIds);
  const moduleOrder = useLayoutStore((state) => state.moduleOrder);
  const setModuleOrder = useLayoutStore((state) => state.setModuleOrder);

  useEffect(() => {
    if (moduleOrder.length === 0 && modules.length > 0) {
      setModuleOrder(modules.map((moduleDefinition) => moduleDefinition.manifest.id));
    }
  }, [moduleOrder.length, modules, setModuleOrder]);

  const invalidModules = Object.entries(diagnostics).filter(([, result]) => !result.valid);

  return (
    <section className="dashboard">
      <section className="dashboard__cards-section">
        <div className="dashboard__cards-column">
          {modules.map((moduleDefinition) => (
            <div key={moduleDefinition.manifest.id} className="dashboard__grid-item">
              <ModuleCardHost moduleDefinition={moduleDefinition} />
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard__bay">
        <div className="dashboard__bay-header">
          <div>
            <p className="dashboard__eyebrow">System</p>
            <h3>{"\u6302\u8f7d\u89c4\u5219"}</h3>
          </div>
          <div className="dashboard__bay-hints">
            <span>
              <LayoutGrid size={13} />
              {"\u56fa\u5b9a\u5de5\u4f5c\u677f"}
            </span>
            <span>
              <Orbit size={13} />
              {"Registry \u9a71\u52a8"}
            </span>
            <span>
              <PanelRightOpen size={13} />
              {"\u5361\u7247\u5185\u8054\u8bbe\u7f6e"}
            </span>
          </div>
        </div>

        <div className="dashboard__bay-metrics">
          <div className="dashboard__metric-pill">
            <LayoutGrid size={15} />
            <div>
              <span>{"\u5df2\u542f\u7528"}</span>
              <strong>{enabledModuleIds.length}</strong>
            </div>
          </div>
          <div className="dashboard__metric-pill">
            <Activity size={15} />
            <div>
              <span>{"\u8bca\u65ad"}</span>
              <strong>{invalidModules.length}</strong>
            </div>
          </div>
          <div className="dashboard__metric-pill">
            <Box size={15} />
            <div>
              <span>{"\u753b\u677f"}</span>
              <strong>455 x 660</strong>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

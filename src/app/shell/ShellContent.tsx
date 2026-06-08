import type { PropsWithChildren, ReactNode } from "react";

type ShellContentProps = PropsWithChildren<{
  eyebrow?: string;
  title?: string;
  actions?: ReactNode;
  bare?: boolean;
}>;

export function ShellContent({
  eyebrow,
  title,
  actions,
  bare = false,
  children,
}: ShellContentProps) {
  return (
    <section className={bare ? "shell-panel shell-panel--bare" : "shell-panel"}>
      {bare ? null : (
        <div className="shell-panel__vault-pattern" aria-hidden="true">
          <span className="shell-panel__dial" />
          <span className="shell-panel__track shell-panel__track--top" />
          <span className="shell-panel__track shell-panel__track--middle" />
          <span className="shell-panel__track shell-panel__track--bottom" />
        </div>
      )}

      {bare ? null : (
        <header className="shell-panel__header">
          <div className="shell-panel__copy">
            {eyebrow ? <p className="shell-panel__eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
          </div>

          {actions ? <div className="shell-panel__actions">{actions}</div> : null}
        </header>
      )}

      <div className={bare ? "shell-panel__body shell-panel__body--bare" : "shell-panel__body"}>
        {children}
      </div>
    </section>
  );
}

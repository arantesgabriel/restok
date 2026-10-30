import type { ReactNode } from "react";
import { RestokTheme } from "@/components/ui/theme";
import { BrandMark } from "@/components/ui/brand-mark";
import { Navigation, type AppScreen } from "./navigation";
import styles from "./app-shell.module.css";

type AppShellProps = {
  screen: AppScreen;
  onChange: (screen: AppScreen) => void;
  houseName?: string;
  onHouseOpen?: () => void;
  profile: ReactNode;
  feedback?: ReactNode;
  notices: ReactNode;
  noticeTitle?: string;
  children: ReactNode;
  context?: ReactNode;
  contextLayout?: "responsive" | "desktop-only";
  dock?: ReactNode;
  overlays: ReactNode;
  keyboardOpen: boolean;
};

export function AppShell({
  screen,
  onChange,
  profile,
  feedback,
  notices,
  noticeTitle,
  children,
  context,
  contextLayout = "responsive",
  dock,
  overlays,
  keyboardOpen,
}: AppShellProps) {
  const hasContext = context !== undefined && context !== null && context !== false;

  return (
    <RestokTheme className={styles.shell}>
      <a
        href="#restok-main"
        className={styles.skip}
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("restok-main")?.focus();
        }}
      >
        Ir para o conteúdo
      </a>
      <div className={styles.frame}>
        <aside data-app-sidebar className={styles.sidebar}>
          <div className={styles.globalTop}>
            <BrandMark />
          </div>
          <div className={styles.sidebarNavigation}>
            <Navigation screen={screen} onChange={onChange} />
          </div>
          <div data-global-controls className={styles.globalFooter}>
            <div className={styles.accountActions}>
              {profile}
            </div>
          </div>
        </aside>
        <main
          id="restok-main"
          data-app-main
          data-dialog-return-focus
          data-has-dock={Boolean(dock)}
          tabIndex={-1}
          className={styles.main}
        >
          <div
            className={styles.workspace}
            data-has-context={hasContext ? "true" : undefined}
            data-context-layout={hasContext && contextLayout === "desktop-only" ? "desktop-only" : undefined}
          >
            <div key={screen} data-app-work className={styles.content}>
              {noticeTitle ? <div className={styles.noticeContent} aria-label="Estado da sincronização">{notices}</div> : null}
              {feedback}
              {children}
            </div>
            {hasContext ? (
              <aside data-app-context className={styles.context} aria-label="Contexto da tela">
                {context}
              </aside>
            ) : null}
          </div>
        </main>
      </div>
      {!keyboardOpen ? <div className={styles.navigation}><Navigation screen={screen} onChange={onChange} /></div> : null}
      {dock ? <div data-shopping-dock className={styles.dock}>{dock}</div> : null}
      {overlays}
    </RestokTheme>
  );
}

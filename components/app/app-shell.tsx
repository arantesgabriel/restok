"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { RestokTheme } from "@/components/ui/theme";
import { CircleAlert, ChevronRight } from "lucide-react";
import { HouseSwitcher } from "./house-switcher";
import { Navigation, type AppScreen } from "./navigation";
import { MobileNavigation } from "./mobile-navigation";
import styles from "./app-shell.module.css";

type AppShellProps = {
  screen: AppScreen;
  onChange: (screen: AppScreen) => void;
  houseName?: string;
  onHouseOpen?: () => void;
  profile: ReactNode;
  accountInitials?: string;
  onProfileOpen?: () => void;
  feedback?: ReactNode;
  notices: ReactNode;
  noticeTitle?: string;
  noticeUrgent?: boolean;
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
  houseName,
  onHouseOpen,
  profile,
  accountInitials,
  onProfileOpen,
  feedback,
  notices,
  noticeTitle,
  noticeUrgent = false,
  children,
  context,
  contextLayout = "responsive",
  dock,
  overlays,
  keyboardOpen,
}: AppShellProps) {
  const hasContext = context !== undefined && context !== null && context !== false;
  const hasDock = Boolean(dock);
  const mainRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = dockRef.current;
    if (!hasDock || !element) return;
    const measure = () => {
      const height = element.getBoundingClientRect().height;
      if (height > 0) mainRef.current?.style.setProperty("--shell-measured-dock-height", `${height}px`);
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [hasDock]);

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
          <div className={styles.globalTop} data-has-house={Boolean(houseName && onHouseOpen) || undefined}>
            <span className={styles.wordmark} aria-label="Restok">restok<span>.</span></span>
            {houseName && onHouseOpen ? <HouseSwitcher name={houseName} onOpen={onHouseOpen} /> : null}
          </div>
          <div className={styles.sidebarNavigation}>
            <p className={styles.navLabel}>Principal</p>
            <Navigation screen={screen} onChange={onChange} desktop />
          </div>
          <div data-global-controls className={styles.globalFooter}>
            {noticeTitle ? <details key={noticeTitle} data-global-notice className={styles.notice} open={noticeUrgent}
              onKeyDown={event => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  event.currentTarget.open = false;
                  event.currentTarget.querySelector("summary")?.focus();
                }
              }}>
              <summary aria-label={noticeTitle} title={noticeTitle}>
                <CircleAlert size={18} aria-hidden="true" />
                <span role="status" className={styles.noticeCaption}>{noticeTitle}</span>
              </summary>
              <div data-global-notice-panel className={styles.noticePanel}>{notices}</div>
            </details> : null}
            <div className={styles.accountActions}>
              {profile}
            </div>
          </div>
        </aside>
        <div className={styles.body}>
        <header data-app-topbar className={styles.topbar}>
          <div className={styles.breadcrumb}><span>{houseName ?? "Casa"}</span><ChevronRight size={14}/><strong>{{shop:"Compra",home:"Casa",history:"Histórico",people:"Casas e pessoas"}[screen]}</strong></div>
          {onProfileOpen ? <button type="button" aria-label="Editar perfil na barra superior" className={styles.topbarProfile} onClick={onProfileOpen}><span className={styles.avatar}>{accountInitials}</span></button> : null}
        </header>
        <main
          ref={mainRef}
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
      </div>
      {!keyboardOpen ? <div className={styles.navigation}><MobileNavigation screen={screen} onChange={onChange} /></div> : null}
      {dock ? <div ref={dockRef} data-shopping-dock className={styles.dock}>{dock}</div> : null}
      {overlays}
    </RestokTheme>
  );
}

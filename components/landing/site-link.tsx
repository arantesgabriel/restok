import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./site.module.css";
export function SiteLink({href,secondary=false,children}:{href:string;secondary?:boolean;children:ReactNode}) {
  const className=`${styles.linkButton} ${secondary ? styles.secondary : styles.primary}`;
  return href.startsWith("#") ? <a href={href} className={className}>{children}</a> : <Link href={href} className={className}>{children}</Link>;
}

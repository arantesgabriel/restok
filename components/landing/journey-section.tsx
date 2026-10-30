import {ArrowRight} from "lucide-react";
import type {ReactNode} from "react";
import styles from "./site.module.css";
export function JourneySection({id,aliasId,title,body,actionHref,actionLabel,demoId,children}:{id:string;aliasId?:string;title:string;body:string;actionHref:string;actionLabel:string;demoId:string;children:ReactNode}) {
  return <>{aliasId ? <span id={aliasId} className={styles.alias}/> : null}<section id={id} className={styles.chapter} aria-labelledby={`${id}-title`}>
    <div className={styles.chapterCopy}><h2 id={`${id}-title`}>{title}</h2><p>{body}</p><a className={styles.textLink} href={actionHref}>{actionLabel}<ArrowRight size={16} aria-hidden="true"/></a></div>
    <div id={demoId} className={styles.chapterDemo}>{children}</div>
  </section></>;
}

import { Check, Circle, House } from "lucide-react";
import type { ItemStatus } from "@/lib/types";
import { statusLabel } from "@/lib/utils";
import { OptionGroup } from "@/components/ui/option-group";
import styles from "./shopping-controls.module.css";
export function StatusToggle({value,onChange}:{value:ItemStatus;onChange:(value:ItemStatus)=>void}) {return <div className="restok-theme"><p>Situação</p><OptionGroup label="Situação" value={value} onChange={onChange} options={(["pending","purchased","already_have"] as const).map(value=>({value,label:statusLabel(value)}))}/></div>;}
export function StatusBadge({status}:{status:ItemStatus}) {const Icon=status==="purchased"?Check:status==="already_have"?House:Circle;return <span className={`restok-theme ${styles.badge}`} data-status={status}><Icon size={14} aria-hidden="true"/>{statusLabel(status)}</span>;}

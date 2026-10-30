import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";
import styles from "./controls.module.css";
export function IconButton({label,variant="quiet",className,...props}:Omit<ButtonProps,"variant"> & {label:string;variant?:"quiet"|"bordered"}) {
  return <Button {...props} aria-label={label} title={label} variant={variant==="bordered"?"secondary":"quiet"} className={cn(styles.icon,className)} />;
}

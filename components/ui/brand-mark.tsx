import Image from "next/image";
import styles from "./brand-mark.module.css";
export function BrandMark({compact=false}:{compact?:boolean}) {
  return <Image src="/brand/restok-logo.png" alt="Restok" width={124} height={41} priority className={compact ? styles.compact : styles.mark}/>;
}

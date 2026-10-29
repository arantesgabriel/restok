import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {BrandMark} from "@/components/ui/brand-mark";
import {SiteLink} from "./site-link";
import styles from "./site.module.css";
export function LandingClosing(){return <section className={styles.closing} aria-labelledby="closing-title"><div className={`${styles.container} ${styles.closingContent}`}><div><h2 id="closing-title">A próxima compra começa na sua casa.</h2><p>Crie sua conta, organize os produtos habituais e convide quem compra com você.</p></div><SiteLink href="/login">Começar agora<ArrowRight size={18} aria-hidden="true"/></SiteLink></div></section>;}
export function LandingFooter(){return <footer className={`${styles.container} ${styles.footer}`}><div><BrandMark compact/><p>A lista que vai ao mercado com você.</p></div><nav aria-label="Rodapé"><a href="#como-funciona">Como funciona</a><a href="#funcionalidades">Funcionalidades</a><a href="#duvidas">Dúvidas</a><Link href="/login">Entrar</Link></nav><small>© 2026 RESTOK</small></footer>;}

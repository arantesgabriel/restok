import { Box, History, House, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HouseholdSummary, Product, ShoppingList } from "@/lib/types";
import { roleLabel } from "@/components/households/household-model";
import styles from "../shopping/shopping.module.css";

export function ReferenceContext({screen,products,lists,house,onHouseOpen}:{screen:string;products:Product[];lists:ShoppingList[];house:HouseholdSummary|null;onHouseOpen:()=>void}) {
  const active=products.filter(product=>product.active);
  return <>
    {screen==="home" ? <section className={styles.contextPanel}><h2><Box size={16}/>Sobre o catálogo</h2><dl><div><dt>Produtos recorrentes</dt><dd>{active.length}</dd></div><div><dt>Categorias</dt><dd>{new Set(active.map(product=>product.category)).size}</dd></div><div><dt>Inativos</dt><dd>{products.length-active.length}</dd></div></dl><p>Produtos da casa podem ser incluídos na compra atual com um toque.</p></section> : screen==="history" ? <section className={styles.contextPanel}><h2><History size={16}/>Leitura do histórico</h2><p>Compras agrupadas por mês, com totais e registros por produto.</p><dl><div><dt>Compras concluídas</dt><dd>{lists.filter(list=>list.status==="completed").length}</dd></div><div><dt>Comparação</dt><dd>Por unidade</dd></div></dl></section> : screen==="people" ? <section className={styles.contextPanel}><h2><Shield size={16}/>Permissões da casa</h2><dl><div><dt>Seu papel</dt><dd>{house ? roleLabel(house.role) : "—"}</dd></div></dl><p>Identidades completas e ações sensíveis em áreas separadas.</p></section> : null}
    <section className={styles.contextPanel}><h2><House size={16}/>Contexto ativo</h2><p>{house?.name ?? "Casa"}</p><Button variant="secondary" onClick={onHouseOpen}>Trocar casa</Button></section>
  </>;
}

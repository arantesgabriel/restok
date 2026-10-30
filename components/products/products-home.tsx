"use client";
import { ArrowDownAZ, ArrowDownZA, Plus, Users, Search, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { SearchField } from "@/components/ui/search-field";
import { OptionGroup } from "@/components/ui/option-group";
import { EmptyState } from "@/components/ui/empty-state";
import type { CategoryName, Product, ShoppingList } from "@/lib/types";
import type { NameSortDirection } from "@/lib/utils";
import { ProductRow } from "./product-row";
import { useProductView } from "./use-product-view";
import styles from "./products.module.css";

type Props = {
  products:Product[]; lists:ShoppingList[]; householdName:string;
  categorySort:Partial<Record<CategoryName,NameSortDirection>>;
  onToggleCategorySort:(category:CategoryName)=>void;
  onNewPurchase:()=>void; onAddProduct:()=>void; onManageHousehold:()=>void;
  onToggleProduct:(id:string)=>void; onEditProduct:(product:Product)=>void;
};
export function ProductsHome({products,lists,householdName,categorySort,onToggleCategorySort,onNewPurchase,onAddProduct,onToggleProduct,onEditProduct,onManageHousehold}:Props) {
  const view=useProductView(products,categorySort);
  const currentList=lists.find(list=>list.status==="active");
  const renderRow=(product:Product)=><ProductRow key={product.id} product={product} onEdit={()=>onEditProduct(product)} onToggle={()=>onToggleProduct(product.id)}/>;
  return <div className={styles.page}>
    <header className={styles.heading}><div><p className={styles.house}>{householdName}</p><h1>Produtos da casa</h1><p className={styles.description}>Os itens recorrentes para preparar a próxima compra.</p></div><IconButton label="Casas e pessoas" variant="bordered" onClick={onManageHousehold}><Users size={18}/></IconButton></header>
    <section className={styles.current} aria-label="Compra em andamento"><div><p className={styles.meta}>Compra em andamento</p><p className={styles.currentName}>{currentList?.name ?? "Nenhuma compra aberta"}</p></div><Button variant="secondary" onClick={onNewPurchase}>Nova</Button></section>
    <div className={styles.toolbar}><SearchField label="Buscar produtos da casa" value={view.query} onValueChange={view.setQuery}/><div className={styles.toolbarActions}><OptionGroup label="Ordenar produtos" value={view.viewMode} onChange={view.setViewMode} options={[{value:"category",label:"Categoria"},{value:"alphabetical",label:"A–Z"}]}/><Button onClick={onAddProduct}><Plus size={17}/>Adicionar</Button></div></div>
    <section aria-labelledby="products-heading"><h2 id="products-heading" data-products-heading tabIndex={-1} className={styles.sectionTitle}>Itens recorrentes <span>{view.active.length}</span></h2>
      {view.query.trim()?<p role="status" className={styles.meta}>{view.resultCount} {view.resultCount===1?"produto encontrado":"produtos encontrados"}</p>:null}
      {view.active.length ? view.viewMode==="category" ? <div className={styles.groups}>{view.grouped.map(section=><section key={section.category}><header className={styles.categoryHeading}><h3>{section.category}</h3><IconButton label={`${section.category} em ordem ${section.direction==="desc"?"Z–A":"A–Z"}. Alternar ordem alfabética`} aria-pressed={section.direction==="desc"} onClick={()=>onToggleCategorySort(section.category)}>{section.direction==="desc"?<ArrowDownZA size={17}/>:<ArrowDownAZ size={17}/>}</IconButton></header><div className={styles.rows}>{section.products.map(renderRow)}</div></section>)}</div> : <div className={styles.rows}>{view.sorted.map(renderRow)}</div> : view.query.trim() ? !view.inactive.length ? <EmptyState variant="compact" icon={<Search size={24}/>} title="Nenhum produto encontrado" description="Tente outro nome ou limpe a busca."/> : null : <EmptyState variant="first-use" icon={<PackagePlus size={24}/>} title="Sua lista está vazia" description={view.inactive.length?"Todos os produtos recorrentes estão inativos. Reative um item ou adicione um novo.":"Adicione os itens que não podem faltar em casa."}/>}
    </section>
    {view.inactive.length?<details open={view.active.length===0} className={styles.inactive}><summary data-inactive-products-summary>Produtos inativos <span>{view.inactive.length}</span></summary><div className={styles.rows}>{view.inactive.map(renderRow)}</div></details>:null}
  </div>;
}

"use client";
import { ArrowDownAZ, ArrowDownZA, Plus, Search, PackagePlus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { SearchField } from "@/components/ui/search-field";
import { ActionMenu } from "@/components/ui/action-menu";
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
  onAddToPurchase?:(product:Product)=>void;
  onToggleProduct:(id:string)=>void; onEditProduct:(product:Product)=>void;
};
export function ProductsHome({products,lists,householdName,categorySort,onToggleCategorySort,onNewPurchase,onAddProduct,onToggleProduct,onEditProduct,onManageHousehold,onAddToPurchase}:Props) {
  const view=useProductView(products,categorySort);
  const currentList=lists.find(list=>list.status==="active");
  const renderRow=(product:Product)=><ProductRow key={product.id} product={product} onEdit={()=>onEditProduct(product)} onToggle={()=>onToggleProduct(product.id)} onAdd={onAddToPurchase ? ()=>onAddToPurchase(product) : undefined}/>;
  return <div className={styles.page}>
    <header className={styles.heading}><div><h1>Produtos da casa</h1><p className={styles.description}>{products.filter(p=>p.active).length} produtos frequentes</p></div><Button className={styles.desktopAdd} onClick={onAddProduct}><Plus size={17}/>Novo produto</Button></header>
    <p className={styles.house}>Organizado para {householdName}</p>
    <div className={styles.toolbar}><SearchField label="Buscar produtos da casa" value={view.query} onValueChange={view.setQuery}/><ActionMenu label="Organizar produtos" items={[{label:"Ordem do catálogo",onSelect:()=>view.setViewMode("list")},{label:"Agrupar por categoria",onSelect:()=>view.setViewMode("category")},{label:"Ordenar por nome A–Z",onSelect:()=>view.setViewMode("alphabetical")},{label:currentList ? `Compra: ${currentList.name}` : "Nova compra",onSelect:onNewPurchase},{label:"Casas e pessoas",onSelect:onManageHousehold}]}><SlidersHorizontal size={18}/></ActionMenu></div>
    <div className={styles.chips} role="group" aria-label="Categorias dos produtos">{(["Todos",...new Set(products.filter(p=>p.active).map(p=>p.category))] as const).map(category=><Button key={category} variant="secondary" aria-pressed={view.category===category} onClick={()=>view.setCategory(category)}>{category}</Button>)}</div>
    <section aria-labelledby="products-heading"><h2 id="products-heading" data-products-heading tabIndex={-1} className={styles.sectionTitle}>Produtos da casa <span>{view.active.length} encontrados</span></h2>
      {view.query.trim()?<p role="status" className={styles.meta}>{view.resultCount} {view.resultCount===1?"produto encontrado":"produtos encontrados"}</p>:null}
      {view.active.length ? view.viewMode==="category" ? <div className={styles.groups}>{view.grouped.map(section=><section key={section.category}><header className={styles.categoryHeading}><h3>{section.category}</h3><IconButton label={`${section.category} em ordem ${section.direction==="desc"?"Z–A":"A–Z"}. Alternar ordem alfabética`} aria-pressed={section.direction==="desc"} onClick={()=>onToggleCategorySort(section.category)}>{section.direction==="desc"?<ArrowDownZA size={17}/>:<ArrowDownAZ size={17}/>}</IconButton></header><div className={styles.rows}>{section.products.map(renderRow)}</div></section>)}</div> : <div className={styles.rows}>{(view.viewMode==="list" ? view.active : view.sorted).map(renderRow)}</div> : view.query.trim() ? !view.inactive.length ? <EmptyState variant="compact" icon={<Search size={24}/>} title="Nenhum produto encontrado" description="Tente outro nome ou limpe a busca." action={<Button variant="secondary" onClick={()=>{view.setQuery("");view.setCategory("Todos");}}>Limpar busca e filtros</Button>}/> : null : <EmptyState variant="first-use" icon={<PackagePlus size={24}/>} title="Sua lista está vazia" description={view.inactive.length?"Todos os produtos recorrentes estão inativos. Reative um item ou adicione um novo.":"Adicione os itens que não podem faltar em casa."}/>}
    </section>
    {view.inactive.length?<details open={view.active.length===0} className={styles.inactive}><summary data-inactive-products-summary>Produtos inativos <span>{view.inactive.length}</span></summary><div className={styles.rows}>{view.inactive.map(renderRow)}</div></details>:null}
  </div>;
}

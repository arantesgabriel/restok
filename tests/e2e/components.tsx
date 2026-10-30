import { useState } from "react";
import { createRoot } from "react-dom/client";
import { PackagePlus, Plus, Menu } from "lucide-react";
import { RestokTheme } from "@/components/ui/theme";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { SearchField } from "@/components/ui/search-field";
import { Checkbox } from "@/components/ui/checkbox";
import { MoneyField } from "@/components/ui/money-field";
import { QuantityField } from "@/components/ui/quantity-field";
import { OptionGroup, Tabs } from "@/components/ui/option-group";
import { List, ListRow } from "@/components/ui/list";
import { Sheet } from "@/components/ui/sheet";
import { useDialogClose } from "@/components/ui/use-dialog-close";
import { ActionMenu } from "@/components/ui/action-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { SyncStatus } from "@/components/ui/sync-status";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { StatusToggle } from "@/components/shopping/status-toggle";
import { AlreadyHave } from "@/components/shopping/already-have";
import { BudgetSummary } from "@/components/shopping/budget-summary";
import { Navigation, type AppScreen } from "@/components/app/navigation";
import { HouseSwitcher } from "@/components/app/house-switcher";
import type { ItemStatus } from "@/lib/types";
import { evidenceState } from "./fixtures";
import "./components.css";
function Preview() {
  const [name,setName]=useState("Compra da semana"),[search,setSearch]=useState(""),[money,setMoney]=useState("0,00"),[quantity,setQuantity]=useState(999999),[checked,setChecked]=useState(true),[status,setStatus]=useState<ItemStatus>("pending"),[filter,setFilter]=useState("all"),[tab,setTab]=useState("controls"),[screen,setScreen]=useState<AppScreen>("shop"),[count,setCount]=useState(0),[toast,setToast]=useState(false),[busy,setBusy]=useState(false),[failed,setFailed]=useState(true),[sheet,setSheet]=useState(0),[houses,setHouses]=useState(false),[house,setHouse]=useState("Casa ilustrativa de uma família com nome longo"),[saved,setSaved]=useState(0);
  const close=useDialogClose();
  const state=evidenceState("money");
  return <RestokTheme className="component-preview"><header><p>Restok · E2E-FIXTURE · sem backend</p><h1>Componentes da casa</h1><p>Raiz & Eucalipto. Estados demonstráveis antes da reconstrução das telas.</p></header>
    <section aria-label="Navegação de exemplo"><HouseSwitcher name={house} onOpen={()=>setHouses(true)}/><Navigation screen={screen} onChange={setScreen}/></section>
    <section aria-label="Botões"><h2>Ações claras</h2><div className="samples"><Button onClick={()=>setCount(count+1)}>Adicionar item</Button><Button variant="secondary" onClick={()=>setToast(true)}>Ver confirmação</Button><Button variant="quiet">Continuar comprando</Button><Button variant="danger">Remover exemplo</Button><Button disabled>Indisponível</Button><Button busy>Salvando</Button><IconButton label="Adicionar exemplo" onClick={()=>setCount(count+1)}><Plus size={18}/></IconButton><ActionMenu label="Menu de exemplo" items={[{label:"Primeira ação",onSelect:()=>setCount(count+1)},{label:"Segunda ação",onSelect:()=>setCount(count+2)},{label:"Última ação",onSelect:()=>setCount(count+3)}]}><Menu size={18}/></ActionMenu></div><p role="status">Ações executadas: {count}</p></section>
    <section><h2>Entrada e validação</h2><div className="fields"><Field label="Nome da compra" value={name} onChange={event=>setName(event.target.value)} hint="Use um nome que a casa reconheça."/><Field label="Nome inválido" defaultValue="" error="Informe o nome antes de salvar."/><Field label="Campo indisponível" defaultValue="Aguardando permissão" disabled/><Select label="Categoria" defaultValue="Alimentos"><option>Alimentos</option><option>Limpeza</option></Select><MoneyField label="Preço de exemplo" value={money} onValueChange={setMoney}/><QuantityField quantity={quantity} onChange={setQuantity}/><SearchField label="Buscar exemplos" value={search} onValueChange={setSearch}/><Checkbox checked={checked} onChange={event=>setChecked(event.target.checked)}>Incluir na próxima compra</Checkbox><Checkbox checked disabled>Seleção indisponível</Checkbox></div></section>
    <section><h2>Situação e filtros</h2><StatusToggle value={status} onChange={setStatus}/><div className="samples"><AlreadyHave name="Café de exemplo" onSelect={()=>setStatus("already_have")}/><p>Situação atual: {status}</p></div><OptionGroup label="Filtros de exemplo" value={filter} onChange={setFilter} options={[{value:"all",label:"Todos"},{value:"pending",label:"Pendente"},{value:"purchased",label:"Comprado"},{value:"already_have",label:"Já temos"}]}/><Tabs label="Abas de exemplo" value={tab} onChange={setTab} options={[{value:"controls",label:"Controles"},{value:"feedback",label:"Feedback"}]}><p>{tab==="controls"?"Controles disponíveis para a compra.":"O resultado aparece sem esperar uma animação."}</p></Tabs></section>
    <BudgetSummary list={state.lists[0]} onEdit={()=>setToast(true)}/>
    <section><h2>Lista, vazio e espera real</h2><List label="Produtos ilustrativos">{["Café de casa com nome longo e embalagem de um quilo","Açúcar"].map(label=><ListRow key={label}><Checkbox defaultChecked>{label}</Checkbox></ListRow>)}</List><EmptyState variant="compact" icon={<PackagePlus/>} title="Nenhum resultado" description="Ajuste a busca para encontrar outro produto." action={<Button variant="secondary" onClick={()=>setSearch("")}>Limpar busca</Button>}/><SyncStatus state={failed?"error":busy?"pending":"success"} message={failed?"Não foi possível salvar. Sua edição está preservada.":busy?"Enviando confirmação local…":"Alteração confirmada no exemplo."} onRetry={failed?()=>{setFailed(false);setBusy(true);}:undefined}/>{busy?<><Skeleton label="Aguardando resposta do exemplo"/><Button onClick={()=>setBusy(false)}>Simular resposta recebida</Button></>:null}</section>
    <section><h2>Conteúdo longo com ações alcançáveis</h2><div className="samples"><Button onClick={()=>setSheet(33)}>Abrir 33 itens</Button><Button variant="secondary" onClick={()=>setSheet(100)}>Abrir 100 itens</Button></div><p role="status">Confirmações locais: {saved}</p></section>
    <footer>Preview local. Sem autenticação, concessão de acesso ou persistência remota. As composições finais pertencem aos próximos PRs.</footer>
    {sheet?<Sheet title={`Selecionar ${sheet} itens`} description="O conteúdo rola; título e confirmação permanecem acessíveis." onClose={()=>close(()=>setSheet(0))} footer={<Button onClick={()=>{if(close(()=>setSheet(0)))setSaved(saved+1);}}>Confirmar seleção</Button>}><div className="preview-sheet-list">{Array.from({length:sheet},(_,index)=><Checkbox key={index} defaultChecked>Produto ilustrativo {index+1} com nome que pode quebrar em mais de uma linha</Checkbox>)}</div></Sheet>:null}
    {houses?<Sheet title="Casas ilustrativas" description="A seleção afeta somente este preview." onClose={()=>close(()=>setHouses(false))}>{["Casa ilustrativa de uma família com nome longo","Casa de exemplo do litoral"].map(name=><Button key={name} variant="secondary" onClick={()=>{setHouse(name);close(()=>setHouses(false));}}>{name}</Button>)}</Sheet>:null}
    {toast?<Toast message="Confirmação local recebida." onDismiss={()=>setToast(false)} transient/>:null}
  </RestokTheme>;
}
createRoot(document.getElementById("root")!).render(<Preview/>);

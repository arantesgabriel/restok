import { createRoot } from "react-dom/client";
import { useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import type { AppScreen } from "@/components/app/navigation";
import { Button } from "@/components/ui/button";
import "../../app/globals.css";
document.documentElement.classList.add("restok-theme");
function ShellPreview() {
  const [screen,setScreen]=useState<AppScreen>("shop");
  return <AppShell screen={screen} onChange={setScreen} houseName={"Casa com nome longo para validar navegação acessível e largura útil da interface"} onHouseOpen={()=>{}} profile={<Button variant="quiet">Conta de exemplo</Button>} notices={null} overlays={null} keyboardOpen={false} contextLayout="desktop-only" context={<section><h2>Contexto útil de exemplo</h2><p>9 itens pendentes nesta compra.</p></section>}><h1>Shell isolado · fixture local</h1><p>Área de trabalho preservada ao exibir contexto opcional. Nenhum painel é inserido nas telas reais por este preview.</p></AppShell>;
}
createRoot(document.getElementById("root")!).render(<ShellPreview/>);

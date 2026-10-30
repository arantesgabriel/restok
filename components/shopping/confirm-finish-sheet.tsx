"use client";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useState } from "react";
import styles from "./purchase-sheets.module.css";
export function ConfirmFinishSheet({ onClose, onConfirm, pending }: { onClose: () => boolean; onConfirm: () => void; pending: number }) {
  const [pendingAtOpen] = useState(pending);
  return <Sheet title="Finalizar compra?" description={pendingAtOpen > 0 ? `Ainda existem ${pendingAtOpen} itens pendentes. Você poderá consultar tudo no histórico depois.` : "Todos os itens foram resolvidos."} onClose={onClose}>
    <div className={styles.actions}><Button className={styles.full} onClick={() => { if (onClose()) onConfirm(); }}>Finalizar e salvar</Button><Button variant="secondary" className={styles.full} onClick={onClose}>Continuar comprando</Button></div>
  </Sheet>;
}


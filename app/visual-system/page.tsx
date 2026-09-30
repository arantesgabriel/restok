import type { Metadata } from "next";
import Image from "next/image";
import "./tokens.css";

export const metadata: Metadata = {
  title: "Restok — proposta do sistema visual",
  robots: { index: false, follow: false },
};

export default function VisualSystemPage() {
  return (
    <main className="visual-system" style={{ padding: 24 }}>
      <Image src="/brand/restok-logo.png" alt="Restok" width={124} height={41} priority />
      <h1>Produtos da casa</h1>
      <p>O que costuma fazer parte da sua lista.</p>
    </main>
  );
}

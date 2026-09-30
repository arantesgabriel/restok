import type { Metadata } from "next";
import { VisualSystemProof } from "@/components/visual-system-proof";
import "./tokens.css";
import "./proof.css";

export const metadata: Metadata = {
  title: "Restok — proposta do sistema visual",
  robots: { index: false, follow: false },
};

export default function VisualSystemPage() {
  return <VisualSystemProof />;
}

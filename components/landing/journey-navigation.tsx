import { History, ListChecks, ShoppingBasket, Users } from "lucide-react";

const stages = [
  { href: "#planejar", label: "Planejar", icon: ListChecks },
  { href: "#compartilhar", label: "Compartilhar", icon: Users },
  { href: "#comprar", label: "Comprar", icon: ShoppingBasket },
  { href: "#acompanhar", label: "Acompanhar", icon: History },
];

export function JourneyNavigation() {
  return (
    <nav className="landing-dock" aria-label="Etapas">
      {stages.map((stage) => {
        const Icon = stage.icon;
        return (
          <a key={stage.href} href={stage.href}>
            <Icon size={16} aria-hidden="true" />
            {stage.label}
          </a>
        );
      })}
    </nav>
  );
}

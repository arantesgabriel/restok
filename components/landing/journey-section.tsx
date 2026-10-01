import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function JourneySection({
  id,
  aliasId,
  number,
  title,
  body,
  actionHref,
  actionLabel,
  demoId,
  reverse = false,
  children,
}: {
  id: string;
  aliasId?: string;
  number: string;
  title: string;
  body: string;
  actionHref: string;
  actionLabel: string;
  demoId: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={reverse ? "landing-stage landing-stage-reverse" : "landing-stage"} aria-labelledby={`${id}-title`}>
      {aliasId ? <span id={aliasId} className="landing-alias" /> : null}
      <div className="landing-stage-copy">
        <p className="landing-stage-index">{number}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{body}</p>
        <a href={actionHref} className="landing-text-link">{actionLabel}<ArrowRight size={16} aria-hidden="true" /></a>
      </div>
      <div id={demoId} className="landing-demo">{children}</div>
    </section>
  );
}

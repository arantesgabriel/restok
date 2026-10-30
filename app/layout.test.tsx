import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout, { viewport } from "@/app/layout";

describe("root layout viewport behavior", () => {
  it("declares smooth document scrolling to Next and supports edge-to-edge safe areas", () => {
    const markup = renderToStaticMarkup(<RootLayout><main>Conteúdo</main></RootLayout>);

    expect(markup).toContain('data-scroll-behavior="smooth"');
    expect(viewport.viewportFit).toBe("cover");
  });
});

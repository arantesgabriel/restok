/** @vitest-environment happy-dom */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { formatBRL, listTotal } from "@/lib/utils";
import { historyLists, previousBreadPrice } from "./demo-data";

vi.mock("next/image", () => ({ default: () => null }));
import { HistoryDemo } from "./product-demos";

it("renders three completed purchases and their real item prices without JavaScript", () => {
  const markup = renderToStaticMarkup(createElement(HistoryDemo));
  const document = new DOMParser().parseFromString(markup, "text/html");
  const details = document.querySelectorAll("details");
  expect(details.length).toBe(3);
  historyLists.forEach((list, index) => {
    expect(details[index].querySelector("summary")?.textContent).toContain(formatBRL(listTotal(list)));
    expect(details[index].querySelectorAll("li").length).toBe(list.items.length);
    expect(list.status).toBe("completed");
  });
  expect(previousBreadPrice).toBe(6.2);
  expect(markup).toContain("6,20");
  expect(markup).not.toContain("Últimos 3 meses");
});

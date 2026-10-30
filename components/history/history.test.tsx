/** @vitest-environment happy-dom */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ShoppingItem, ShoppingList } from "@/lib/types";
import { HistoryView } from "./history-view";
import { HistoryDetail } from "./history-detail";
import { HistoryPriceComparison } from "./history-price-comparison";
import { completedHistory, historyMonths, historySummary, previousHistoryPrice } from "./history-model";

const item: ShoppingItem = {id:"item",productId:"rice",name:"Nome registrado na compra",category:"Alimentos",quantity:3,unitPrice:5,status:"purchased",sortOrder:0};
const purchase = (id:string,date:string,items:ShoppingItem[]=[item]): ShoppingList => ({id,name:id,status:"completed",budget:0,startedAt:date,finishedAt:date,items});
afterEach(cleanup);

describe("historical chronology and prices",()=>{
  it("sorts only completed purchases, groups months without losing rows, and leaves snapshots unchanged",()=>{
    const lists=[purchase("old","2026-08-01T12:00:00Z"),{...purchase("active","2026-12-01T12:00:00Z"),status:"active" as const},purchase("new","2026-10-01T12:00:00Z"),purchase("middle","2026-08-10T12:00:00Z")];
    const before=structuredClone(lists);
    expect(completedHistory(lists).map(row=>row.id)).toEqual(["new","middle","old"]);
    expect(historyMonths(lists).map(month=>month.lists.map(row=>row.id))).toEqual([["new"],["middle","old"]]);
    expect(lists).toEqual(before);
  });

  it("counts all statuses separately and treats zero as a known price in the registered subtotal",()=>{
    const list=purchase("mixed","2026-10-01T12:00:00Z",[item,{...item,id:"zero",unitPrice:0},{...item,id:"unknown",unitPrice:undefined},{...item,id:"have",status:"already_have",unitPrice:999},{...item,id:"pending",status:"pending",unitPrice:999}]);
    expect(historySummary(list)).toEqual({purchased:3,alreadyHave:1,pending:1,withoutPrice:1,total:15});
  });

  it("compares only strictly earlier completed records, excluding self, same instant, active, future and unrelated products",()=>{
    const current=purchase("current","2026-10-10T12:00:00Z");
    const lists=[current,purchase("future","2026-10-11T12:00:00Z",[{...item,unitPrice:100}]),purchase("same","2026-10-10T09:00:00-03:00",[{...item,unitPrice:99}]),{...purchase("active","2026-10-09T12:00:00Z",[{...item,unitPrice:98}]),status:"active" as const},purchase("unrelated","2026-10-08T12:00:00Z",[{...item,productId:"other",unitPrice:97}]),purchase("before","2026-10-07T12:00:00Z",[{...item,quantity:100,unitPrice:4}])];
    expect(previousHistoryPrice(item,current,lists)).toBe(4);
    expect(previousHistoryPrice({...item,productId:undefined},current,lists)).toBeUndefined();
  });

  it("finds a known zero behind newer unpriced or already-have snapshots and falls back to startedAt",()=>{
    const current=purchase("current","2026-10-10T12:00:00Z");
    const lists=[purchase("unknown","2026-10-09T12:00:00Z",[{...item,unitPrice:undefined}]),purchase("have","2026-10-08T12:00:00Z",[{...item,status:"already_have",unitPrice:7}]),{...purchase("zero","2026-10-07T12:00:00Z",[{...item,unitPrice:0}]),finishedAt:undefined}];
    expect(previousHistoryPrice(item,current,lists)).toBe(0);
  });

  it.each([[0,5,"R$ 5,00 a mais"],[5,0,"R$ 5,00 a menos"],[5,5,"Mesmo preço"],[4,5,"R$ 1,00 a mais"]])("renders previous %s/current %s as a unit-price comparison",(previous,current,label)=>{
    const {container}=render(<HistoryPriceComparison item={{...item,quantity:999999,unitPrice:current}} previousPrice={previous}/>);
    expect(container.textContent?.replace(/\u00a0/g," ")).toContain(label);
    expect(container.textContent).not.toMatch(/NaN|Infinity|%/);
  });

  it("does not invent a comparison for pending, already-have, unpriced or unlinked records",()=>{
    for(const status of ["pending","already_have"] as const){const {container,unmount}=render(<HistoryPriceComparison item={{...item,status}} previousPrice={0}/>);expect(container.textContent).toBe("");unmount();}
    const {container}=render(<><HistoryPriceComparison item={{...item,unitPrice:undefined}} previousPrice={0}/><HistoryPriceComparison item={item}/></>);
    expect(container.textContent).toBe("");
  });
});

describe("history surfaces",()=>{
  it("distinguishes no completed history from a completed purchase with zero items",()=>{
    const {rerender}=render(<HistoryView lists={[]} onOpen={vi.fn()}/>);
    expect(screen.getByRole("heading",{name:"O histórico começa na próxima compra"})).toBeTruthy();
    rerender(<HistoryDetail list={purchase("empty","2026-10-01T12:00:00Z",[])} lists={[]} onBack={vi.fn()}/>);
    expect(screen.getByText("Esta compra foi concluída sem itens.")).toBeTruthy();
    expect(screen.getByText("R$ 0,00")).toBeTruthy();
  });

  it("keeps 100 purchases reachable in chronological order and focuses the selected record on return",()=>{
    const lists=Array.from({length:100},(_,index)=>purchase(`Compra ${index}`,new Date(Date.UTC(2026,0,index+1,12)).toISOString()));
    const onOpen=vi.fn();
    render(<HistoryView lists={lists} onOpen={onOpen} returnToId="Compra 42"/>);
    const records=screen.getAllByRole("listitem").map(item=>within(item).getByRole("button"));
    expect(records).toHaveLength(100);
    expect(records[0].textContent).toContain("Compra 99");
    expect(document.activeElement?.textContent).toContain("Compra 42");
    fireEvent.click(records[99]);
    expect(onOpen).toHaveBeenCalledWith(lists[0]);
  });

  it("renders original snapshot names, categories, quantities and known/unknown prices",()=>{
    const list=purchase("Snapshots","2026-10-01T12:00:00Z",[item,{...item,id:"unknown",name:"Comprado sem valor",unitPrice:undefined},{...item,id:"zero",name:"Comprado com zero",unitPrice:0}]);
    render(<HistoryDetail list={list} lists={[]} onBack={vi.fn()}/>);
    expect(screen.getByRole("heading",{name:item.name})).toBeTruthy();
    const rows=screen.getAllByRole("listitem");
    expect(within(rows[0]).getByText("Quantidade: 3")).toBeTruthy();
    expect(within(rows[1]).getByText("Sem preço informado")).toBeTruthy();
    expect(within(rows[2]).getByText("R$ 0,00")).toBeTruthy();
    expect(within(rows[2]).getByText("R$ 0,00 / un.")).toBeTruthy();
    expect(screen.getByText("1 item comprado sem preço")).toBeTruthy();
  });
});

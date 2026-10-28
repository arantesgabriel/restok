import { expect, it } from "vitest";
import { moneyInput, parseMoney } from "./money";
import { parseQuantity } from "./quantity";
import { itemSubtotal, latestPriceFor, statusAfterPrice } from "./utils";
import { seedState } from "@/tests/fixtures/shopping";

it.each([["",undefined],["  ",undefined],["0",0],["0,00",0],["1.234,50",1234.5],["1234,50",1234.5],["1.234",1234],["1234.50",1234.5],["5,2",5.2],["9.999.999.999,99",9999999999.99]] as const)("parses %s without conflating absence and zero", (raw,value) => {
  expect(parseMoney(raw)).toEqual({ok:true,value});
});
it.each(["-1","1.23,45","1,234","1.2345","12abc","1e2","Infinity","NaN","R$ 5,00","1,","10.000.000.000,00","1 234,50"])("rejects malformed, negative or nonrepresentable %s", (raw) => {
  expect(parseMoney(raw)).toEqual({ok:false});
});
it("retains zero when preparing editor text and when deriving status/reference", () => {
  expect(moneyInput(0)).toBe("0,00"); expect(moneyInput(undefined)).toBe("");
  expect(statusAfterPrice("pending",0)).toBe("purchased");
  expect(statusAfterPrice("pending",undefined)).toBe("pending");
  expect(statusAfterPrice("already_have",5)).toBe("already_have");
  const list = {...seedState.lists[1],items:[{...seedState.lists[1].items[0],unitPrice:0,status:"purchased" as const}]};
  expect(latestPriceFor(list.items[0].productId,[list])).toBe(0);
  expect(itemSubtotal({...list.items[0],quantity:3,unitPrice:5})).toBe(15);
  expect(itemSubtotal({...list.items[0],quantity:3,unitPrice:6})).toBe(18);
  expect(itemSubtotal({...list.items[0],status:"already_have",unitPrice:6})).toBe(0);
});
it.each(["0","-2","1.5","1,5","abc","","9007199254740992"])("rejects quantity %s without stripping characters", (raw) => expect(parseQuantity(raw)).toBeNaN());
it("supports current valid quantities without an arbitrary layout ceiling", () => {
  expect(parseQuantity("999999")).toBe(999999);
  expect(parseQuantity("9007199254740991")).toBe(Number.MAX_SAFE_INTEGER);
});

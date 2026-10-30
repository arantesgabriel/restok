/** @vitest-environment happy-dom */
import { beforeEach, expect, it, vi } from "vitest";
const fixture=vi.hoisted(()=>({from:vi.fn(),filters:[] as unknown[][],removed:vi.fn(),list:true,member:true,error:false}));
vi.mock("@/lib/supabase/config",()=>({isSupabaseConfigured:true}));
vi.mock("@/lib/supabase/client",()=>({getSupabaseBrowserClient:()=>({auth:{getUser:async()=>({data:{user:{id:"user",user_metadata:{}}},error:null})},from:fixture.from})}));
import { deleteShoppingItem } from "./data";
beforeEach(()=>{
  vi.clearAllMocks();fixture.filters=[];fixture.list=true;fixture.member=true;fixture.error=false;
  fixture.from.mockImplementation((table:string)=>{
    let removing=false;
    const query={select:()=>query,eq:(column:string,value:unknown)=>{fixture.filters.push([table,column,value]);return query;},order:()=>query,delete:()=>{removing=true;fixture.removed();return query;},
      single:async()=>({data:{id:"house",name:"Casa"},error:null}),
      maybeSingle:async()=>({data:table==="profiles" ? {display_name:"Pessoa"} : fixture.list ? {id:"list"} : null,error:null}),
      then:(resolve:(value:unknown)=>unknown)=>Promise.resolve(resolve({data:table==="household_members" && fixture.member ? [{household_id:"house",role:"member"}] : [],error:removing && fixture.error ? {} : null}))};
    return query;
  });
});
it("uses both item and list IDs and verifies the active authorized household",async()=>{
  expect(await deleteShoppingItem("item","list","house")).toEqual({ok:true,synced:true});
  expect(fixture.filters).toEqual(expect.arrayContaining([["shopping_lists","household_id","house"],["shopping_lists","status","active"],["shopping_list_items","id","item"],["shopping_list_items","shopping_list_id","list"]]));
  expect(fixture.removed).toHaveBeenCalledOnce();
});
it.each(["revoked","wrong-house","finished-list"])("fails closed for %s",async(kind)=>{
  if(kind==="revoked")fixture.member=false;if(kind==="finished-list")fixture.list=false;
  expect((await deleteShoppingItem("item","list",kind==="wrong-house" ? "other" : "house")).ok).toBe(false);
  expect(fixture.removed).not.toHaveBeenCalled();
});
it("returns failure on a database rejection",async()=>{fixture.error=true;expect((await deleteShoppingItem("item","list","house")).ok).toBe(false);});
it("accepts an already deleted item on retry",async()=>{expect((await deleteShoppingItem("item","list","house")).ok).toBe(true);expect((await deleteShoppingItem("item","list","house")).ok).toBe(true);});

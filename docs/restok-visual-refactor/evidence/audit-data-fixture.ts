// Audit-only overrides. No imports from a network SDK and no production consumer.
export * from '../../../tests/e2e/data-fixture';
import { loadRemoteState as originalState } from '../../../tests/e2e/data-fixture';
const scenario=new URLSearchParams(window.location.search).get('scenario')??'';
export const loadRemoteState=async()=>{
 const remote=await originalState();if(!remote)return remote;
 if(scenario==='history-many'){
  const completed=remote.state.lists.find(list=>list.status==='completed')!;
  remote.state.lists=[...remote.state.lists.filter(list=>list.status==='active'),...Array.from({length:24},(_,i)=>({...structuredClone(completed),id:`audit-history-${i}`,name:i===0?'Compra com nome longo para verificar leitura e organização do histórico em telas pequenas':`Compra ilustrativa ${i+1}`,finishedAt:new Date(Date.UTC(2026,9-Math.floor(i/4),28-i%4)).toISOString()}))];
 }
 return remote;
};
export const loadHouseholdMembers=async()=>{
 if(scenario==='member-error')throw new Error('Simulated audit read failure');
 return [
  {userId:'fixture-person',displayName:'Pessoa de teste',role:'owner',isSelf:true,joinedAt:'2026-01-01'},
  ...['A','B'].map(suffix=>({userId:`audit-member-${suffix}`,displayName:'Participante com nome longo e prefixo compartilhado '.padEnd(79,'x')+suffix,role:'member',isSelf:false,joinedAt:'2026-01-01'}))
 ];
};

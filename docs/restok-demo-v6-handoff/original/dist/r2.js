/* Restok · Raiz & Eucalipto | consolidated visual reference */
(function () {
  "use strict";
  var iconPaths = {
    basket:'<path d="m3 10 2 10h14l2-10H3ZM7 10l5-7 5 7M8 14v3m4-3v3m4-3v3"/>',
    home:'<path d="m3 10 9-7 9 7v11H3V10ZM9 21v-7h6v7"/>',
    history:'<path d="M3 12a9 9 0 1 0 3-6L3 8M3 3v5h5m4-1v5l3 2"/>',
    people:'<path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M15 4a4 4 0 0 1 0 8M22 20v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="8" r="4"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    down:'<path d="m6 9 6 6 6-6"/>',
    back:'<path d="m15 18-6-6 6-6"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    sliders:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="17" r="2"/>',
    x:'<path d="M5 5l14 14M19 5 5 19"/>',
    box:'<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    edit:'<path d="m15 5 4 4M4 20l4.5-1 11-11a3 3 0 0 0-4-4l-11 11L4 20Z"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    send:'<path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    shield:'<path d="m12 2 8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4Z"/><path d="m9 12 2 2 4-4"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    refresh:'<path d="M20 6v5h-5M4 18v-5h5"/><path d="M5 9a8 8 0 0 1 14-3M19 15a8 8 0 0 1-14 3"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/>',
    link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
    chevron:'<path d="m9 6 6 6-6 6"/>',
    sparkle:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>'
  };
  function ic(name,n) { return '<span class="icon" aria-hidden="true"'+(n?' style="height:'+n+'px;width:'+n+'px"':'')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+(iconPaths[name]||iconPaths.info)+'</svg></span>'; }
  function safe(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function brl(n){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);}
  var homeItems=[
    {id:1,name:"Arroz integral",qty:1,detail:"1 pacote · 1 kg",price:18.90,state:"done",cat:"Mercearia"},
    {id:2,name:"Café em pó",qty:2,detail:"2 pacotes · 500 g",price:22.90,state:"todo",cat:"Mercearia"},
    {id:3,name:"Leite integral",qty:6,detail:"6 unidades · 1 L",price:5.29,state:"todo",cat:"Laticínios"},
    {id:4,name:"Banana prata",qty:1,detail:"1 cacho",price:null,state:"todo",cat:"Hortifruti"},
    {id:5,name:"Ovos caipiras",qty:1,detail:"1 dúzia",price:16.50,state:"done",cat:"Hortifruti"},
    {id:6,name:"Detergente neutro",qty:2,detail:"2 unidades · 500 ml",price:2.89,state:"done",cat:"Limpeza"},
    {id:7,name:"Pão de forma",qty:1,detail:"1 unidade",price:9.50,state:"done",cat:"Padaria"},
    {id:8,name:"Queijo minas",qty:1,detail:"1 pacote · 400 g",price:23.40,state:"todo",cat:"Laticínios"},
    {id:9,name:"Tomate italiano",qty:1,detail:"1 kg",price:null,state:"todo",cat:"Hortifruti"},
    {id:10,name:"Manteiga sem sal",qty:1,detail:"1 pote · 200 g",price:13.90,state:"todo",cat:"Laticínios"},
    {id:11,name:"Macarrão penne",qty:2,detail:"2 pacotes · 500 g",price:5.75,state:"todo",cat:"Mercearia"},
    {id:12,name:"Sabão em pó",qty:1,detail:"1 pacote · 1 kg",price:null,state:"have",cat:"Limpeza"},
    {id:13,name:"Maçã gala",qty:1,detail:"1 kg",price:9.80,state:"todo",cat:"Hortifruti"},
    {id:14,name:"Azeite extravirgem",qty:1,detail:"1 garrafa · 500 ml",price:37.90,state:"todo",cat:"Mercearia"}
  ];
  var homeCatalog=[
    {id:101,name:"Café em pó",cat:"Mercearia",detail:"500 g",qty:2,have:false,active:true},
    {id:102,name:"Arroz integral",cat:"Mercearia",detail:"1 kg",qty:1,have:false,active:true},
    {id:103,name:"Leite integral",cat:"Laticínios",detail:"1 L",qty:6,have:false,active:true},
    {id:104,name:"Queijo minas",cat:"Laticínios",detail:"400 g",qty:1,have:false,active:true},
    {id:105,name:"Ovos caipiras",cat:"Hortifruti",detail:"1 dúzia",qty:1,have:true,active:true},
    {id:106,name:"Banana prata",cat:"Hortifruti",detail:"1 cacho",qty:1,have:false,active:true},
    {id:107,name:"Detergente neutro",cat:"Limpeza",detail:"500 ml",qty:2,have:true,active:true},
    {id:108,name:"Sabão em pó",cat:"Limpeza",detail:"1 kg",qty:1,have:true,active:true},
    {id:109,name:"Pão de forma",cat:"Padaria",detail:"1 pacote",qty:1,have:false,active:true},
    {id:110,name:"Azeite extravirgem",cat:"Mercearia",detail:"500 ml",qty:1,have:false,active:true}
  ];
  var houses={
    home:{
      name:"Nossa Casa",budget:180,
      items:homeItems.map(function(i){return Object.assign({},i);}),
      catalog:homeCatalog.map(function(i){return Object.assign({},i);}),
      members:[
        {id:"gabriel",name:"Gabriel Arantes",email:"gabriel@exemplo.com",role:"owner",joined:"Desde 14 de outubro"},
        {id:"mariana",name:"Mariana de Oliveira Carvalho",email:"mariana@exemplo.com",role:"member",joined:"Desde 18 de outubro"}
      ],
      history:[
        {id:"oct1",title:"Compra do início de outubro",date:"14 out 2026",month:"Outubro 2026",total:193.42,count:19,compared:"+ R$ 12,40 em relação à anterior",rows:[
          {name:"Café em pó",qty:2,price:22.90,delta:1,previous:21.90},
          {name:"Leite integral",qty:6,price:5.29,delta:-0.60,previous:5.89},
          {name:"Arroz integral",qty:1,price:18.90,delta:null}
        ]},
        {id:"sep1",title:"Compra de setembro",date:"26 set 2026",month:"Setembro 2026",total:181.02,count:17,compared:"Referência para comparação",rows:[
          {name:"Café em pó",qty:2,price:21.90,delta:null},
          {name:"Leite integral",qty:6,price:5.89,delta:null}
        ]},
        {id:"sep2",title:"Reposição rápida",date:"09 set 2026",month:"Setembro 2026",total:54.80,count:6,compared:"6 itens registrados",rows:[
          {name:"Queijo minas",qty:1,price:23.40,delta:null},
          {name:"Pão de forma",qty:1,price:9.50,delta:null}
        ]}
      ]
    },
    campo:{
      name:"Casa de Campo",budget:120,
      items:[
        {id:201,name:"Água mineral",qty:3,detail:"3 galões · 5 L",price:8.50,state:"todo",cat:"Bebidas"},
        {id:202,name:"Carvão vegetal",qty:1,detail:"1 saco · 3 kg",price:null,state:"todo",cat:"Utilidades"},
        {id:203,name:"Papel toalha",qty:2,detail:"2 rolos",price:6.00,state:"have",cat:"Limpeza"}
      ],
      catalog:[
        {id:301,name:"Água mineral",cat:"Bebidas",detail:"Galão 5 L",qty:3,have:false,active:true},
        {id:302,name:"Carvão vegetal",cat:"Utilidades",detail:"Saco 3 kg",qty:1,have:false,active:true},
        {id:303,name:"Papel toalha",cat:"Limpeza",detail:"Rolo",qty:2,have:true,active:true}
      ],
      members:[
        {id:"gabriel",name:"Gabriel Arantes",email:"gabriel@exemplo.com",role:"owner",joined:"Desde 20 de outubro"}
      ],
      history:[]
    }
  };
  var screenMeta={
    compra:{title:"Compra",subtitle:"Primeira dobra, preço e estados",icon:"basket",why:"A lista é a tarefa principal. Total, meta e filtros ocupam menos altura; ações persistentes não encobrem produtos.",rules:["Uma linha inteira acima do dock em 320 px.","Preço zero diferente de preço ausente.","Confirmação de item sem saltos ou espera artificial."],findings:["UI-001 · Visibilidade","UI-003/004 · Preço","UI-010 · Meta"]},
    casa:{title:"Casa",subtitle:"Catálogo e recorrência",icon:"home",why:"Busca local, categorias e ações organizadas eliminam o esforço de encontrar produtos recorrentes.",rules:["Busca disponível antes da lista.","Ações de adicionar e Já temos distintas.","Estados vazios informativos por filtro."],findings:["UI-009 · Busca","UI-008 · Quantidade","UI-005 · Densidade"]},
    historico:{title:"Histórico",subtitle:"Compras e comparação",icon:"history",why:"Cada compra tem identidade, data, total e detalhe. Variações de preço aparecem junto ao produto, não em gráficos decorativos.",rules:["Leitura cronológica e agrupamento mensal.","Diferenças sempre contextualizadas por unidade.","Estado vazio claro em casas sem compras."],findings:["UI-005 · Desktop","UI-004 · Valor","UI-011 · Feedback"]},
    pessoas:{title:"Casas e pessoas",subtitle:"Identidade e permissões",icon:"people",why:"O nome completo precede papel e controles de acesso. A casa ativa aparece em todas as telas, inclusive após recarga simulada.",rules:["Identidade em bloco próprio, com quebra de linha.","Confirmação antes de alterações sensíveis.","Troca de casa com contexto explícito."],findings:["UI-002 · Identidade","UI-013 · Casa ativa","UI-006 · Conta individual"]}
  };
  var paletteOptions={
    eucalipto:{name:"Raiz & Eucalipto",short:"Eucalipto",tag:"Consolidado v1",desc:"Marca #213F1D, ações #2D5A27, destaque sálvia #B4D3A7 e informações secundárias #4F7566. Paleta única para o handoff técnico.",colors:["#213F1D","#2D5A27","#B4D3A7","#F7FAF5","#4F7566"]}
  };
  var savedHouse = localStorage.getItem("restok-r25-active-house");
  var state={view:"compra",device:"390",palette:"eucalipto",motion:"standard",house:houses[savedHouse]?savedHouse:"home",purchaseFilter:"all",productCategory:"Todos",q:"",historyDetail:null,historyMonth:"Todos",houseMenu:false,modal:null,modalMeta:null,error:"",invite:null,lastChanged:null,lastAdded:null,filterChanged:false};
  function activeHouse(){return houses[state.house];}
  function totals(){var data=activeHouse().items,done=data.filter(function(i){return i.state==="done";});return {done:done.length,have:data.filter(function(i){return i.state==="have";}).length,pending:data.filter(function(i){return i.state==="todo";}).length,spent:done.reduce(function(n,i){return n+(i.price===null?0:i.price*i.qty);},0)};}
  function permitted(){return activeHouse().members.some(function(m){return m.id==="gabriel"&&m.role==="owner";});}
  function visibleItems(){return activeHouse().items.filter(function(i){return (state.purchaseFilter==="all"||i.state===state.purchaseFilter)&&(!state.q||i.name.toLocaleLowerCase("pt-BR").includes(state.q.toLocaleLowerCase("pt-BR"))||i.cat.toLocaleLowerCase("pt-BR").includes(state.q.toLocaleLowerCase("pt-BR")));});}
  function visibleProducts(){return activeHouse().catalog.filter(function(p){return p.active&&(state.productCategory==="Todos"||p.cat===state.productCategory)&&(!state.q||p.name.toLocaleLowerCase("pt-BR").includes(state.q.toLocaleLowerCase("pt-BR")));});}
  function activeViewLabel(){return screenMeta[state.view].title;}
  function sidebar(){
    var links=[["compra","Compra","basket"],["casa","Casa e produtos","home"],["historico","Histórico","history"],["pessoas","Casas e pessoas","people"]];
    return '<aside class="sidebar"><div class="logo">restok<span class="r27-brand-dot">.</span></div><button class="house-card" data-house-menu="1" aria-label="Trocar casa" style="width:100%;color:var(--ink);text-align:left">'+
      '<span class="house-icon">'+ic("home")+'</span><span style="flex:1;min-width:0"><b style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+safe(activeHouse().name)+'</b><small>'+activeHouse().members.length+' participantes</small></span>'+ic("down",14)+'</button>'+
      '<div><div class="side-label">Principal</div>'+links.map(function(l){return '<button data-nav="'+l[0]+'" class="nav-link '+(state.view===l[0]?"active":"")+'">'+ic(l[2])+l[1]+'</button>';}).join("")+'</div>'+
      '<div class="side-spacer"></div><div class="side-person"><span class="avatar">GA</span><div><b>Gabriel</b><small>Conta individual</small></div></div></aside>';
  }
  function appHeader(){
    return '<header class="r2-topline"><div class="r2-top-crumb"><span>'+safe(activeHouse().name)+'</span>'+ic("chevron",12)+'<strong>'+activeViewLabel()+'</strong></div><div class="r2-topactions"><span class="r2-sync">Prévia interativa</span><span class="avatar">GA</span></div></header>'+
      '<header class="mobile-top"><div class="mobile-logo">restok<span class="r27-brand-dot">.</span></div><button class="housepill" data-house-menu="1">'+ic("home",14)+safe(activeHouse().name)+ic("down",12)+'</button></header>';
  }
  function viewHead(eyebrow,title,desc,action){
    return '<div class="r2-view-head"><div><h2>'+title+'</h2><p>'+desc+'</p></div><div class="r2-inline-actions">'+(action||'')+'</div></div>';
  }
  function purchaseBudget(){
    var t=totals(),b=activeHouse().budget,pct=b===0?(t.spent>0?100:0):Math.min(100,100*t.spent/b),exceeded=t.spent>b,remaining=Math.abs(b-t.spent);
    return '<section class="budget'+(exceeded?' r3-over-budget':'')+'" aria-label="Resumo do orçamento"><div class="budget-row"><div><span class="budget-label">Gasto até agora</span><div class="budget-number" data-value="'+t.spent+'">'+brl(t.spent)+'</div></div><div class="budget-available"><span class="budget-label">'+(exceeded?'Acima da meta':'Ainda disponíveis')+'</span><b data-value="'+remaining+'">'+brl(remaining)+'</b></div></div>'+
      '<div class="progress" role="progressbar" aria-label="Percentual usado da meta" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(pct)+'"><i style="width:'+pct+'%"></i></div><div class="budget-foot"><span>Meta desta compra: <b>'+brl(b)+'</b></span><button data-modal="budget" class="r25-text-action">Editar meta '+ic("arrow",13)+'</button></div></section>';
  }
  function purchaseRows(){
    var filtered=visibleItems();
    if(!filtered.length)return '<div class="r2-catalog-empty r3-empty">'+ic("search",23)+'<h4>'+(state.q?'Nada encontrado para “'+safe(state.q)+'”':'Nenhum item nesta seleção')+'</h4><p>'+(state.q?'Confira a escrita ou procure por outro produto.':'Você pode voltar para todos os itens da compra.')+'</p><button class="r2-outline" data-clear-list="1">'+(state.q?'Limpar busca':'Mostrar todos')+'</button></div>';
    return filtered.map(function(i){
      var word=i.state==="done"?"Comprado":i.state==="have"?"Já temos":"Pendente";
      return '<div class="item '+(i.state==="done"?"done":i.state==="have"?"have":"")+(state.lastChanged===i.id?" just-changed":"")+(state.lastAdded===i.id?" r3-added":"")+'"><button class="checkbtn" data-purchase-toggle="'+i.id+'" aria-pressed="'+(i.state==="done")+'" aria-label="'+(i.state==="done"?'Desmarcar compra de ':'Marcar como comprado: ')+safe(i.name)+'"><span class="checkbox">'+ic(i.state==="have"?"home":"check",15)+'</span></button>'+
        '<div class="item-main"><b>'+safe(i.name)+'</b><small>'+safe(i.detail)+(i.state==="todo"?'':' · <strong>'+word+'</strong>')+'</small></div><div class="item-right"><div class="item-price">'+(i.price===null?"Sem preço":brl(i.price*i.qty))+(i.price!==null&&i.qty>1?"<small>"+brl(i.price)+" / un.</small>":"")+'</div><button class="havebtn" data-purchase-have="'+i.id+'" aria-pressed="'+(i.state==="have")+'" aria-label="'+(i.state==="have"?'Retirar de Já temos: ':'Marcar Já temos: ')+safe(i.name)+'">'+ic("home",15)+'</button></div></div>';
    }).join("");
  }
  function purchaseView(){
    var t=totals();
    return viewHead("","Compra da semana",t.done+" de "+activeHouse().items.length+" comprados · Quarta, 28 de outubro",
      '<button class="r2-primary" data-modal="newItem">'+ic("plus",16)+'Adicionar item</button>')+
      purchaseBudget()+
      '<div class="searchline"><label class="searchbox">'+ic("search")+'<input class="r2-search-field" data-search="1" aria-label="Buscar na compra" type="search" placeholder="Buscar na lista..." value="'+safe(state.q)+'"></label><button class="iconbtn" data-sort="1" aria-label="Ordenação">'+ic("sliders")+'</button></div>'+
      '<div class="filters">'+[["all","Todos"],["todo","Pendentes"],["done","Comprados"],["have","Já temos"]].map(function(f){return '<button data-purchase-filter="'+f[0]+'" aria-pressed="'+(state.purchaseFilter===f[0])+'" class="filter '+(state.purchaseFilter===f[0]?"active":"")+'">'+f[1]+'</button>';}).join("")+'</div>'+
      '<div class="listhead"><b>Produtos <small id="purchaseCount">· '+visibleItems().length+' itens</small></b><small>A–Z</small></div>'+
      '<div class="items" id="purchaseItems">'+purchaseRows()+'</div><div class="r2-bottom-hint">Toque na marcação para atualizar a compra. O ícone de casa indica “Já temos”.</div>';
  }
  function catalogRows(){
    var rows=visibleProducts();
    if(!rows.length)return '<div class="r2-catalog-empty r3-empty">'+ic("search",22)+'<h4>'+(state.q?'Nada encontrado para “'+safe(state.q)+'”':'Categoria sem produtos')+'</h4><p>'+(state.q?'Tente outro nome para localizar o produto.':'Escolha outra categoria para continuar.')+'</p><button class="r2-outline" data-clear-list="1">'+(state.q?'Limpar busca':'Mostrar todos')+'</button></div>';
    return rows.map(function(p){
      return '<div class="r2-catalog-row"><span class="r2-product-symbol">'+ic("box",18)+'</span><div class="r2-catalog-info"><div class="r2-catalog-name">'+safe(p.name)+'</div><div class="r2-catalog-meta"><span>'+safe(p.cat)+'</span><span>· '+p.qty+' un. · '+safe(p.detail)+'</span>'+(p.have?'<span class="r2-tag">Já temos</span>':'')+'</div></div>'+
        '<div class="r2-cat-actions"><button class="r2-cat-icon" data-product-owned="'+p.id+'" aria-label="Alternar Já temos para '+safe(p.name)+'">'+ic(p.have?"check":"home",16)+'</button><button class="r2-cat-button" data-add-catalog="'+p.id+'" aria-label="Adicionar '+safe(p.name)+' à compra">'+ic("plus",16)+'</button></div></div>';
    }).join("");
  }
  function catalogView(){
    var cat=activeHouse().catalog.filter(function(p){return p.active;}),owned=cat.filter(function(p){return p.have;}).length;
    var categories=["Todos"].concat(Array.from(new Set(cat.map(function(p){return p.cat;}))));
    return viewHead("","Produtos da casa",cat.length+" produtos frequentes · "+owned+" já disponíveis",
      '<button class="r2-primary" data-modal="newCatalog">'+ic("plus",16)+'Novo produto</button>')+
      '<div class="r2-home-strip">Organizado para '+safe(activeHouse().name)+'</div>'+
      '<div class="r2-catalog-tools"><label class="r2-searchbox">'+ic("search")+'<input class="r2-search-field" data-search="1" aria-label="Buscar no catálogo" type="search" placeholder="Buscar produtos recorrentes..." value="'+safe(state.q)+'"></label><button class="r2-icon-button" data-sort="1" aria-label="Filtros">'+ic("sliders")+'</button></div>'+
      '<div class="r2-chips">'+categories.map(function(c){return '<button data-category="'+safe(c)+'" class="r2-chip '+(state.productCategory===c?"active":"")+'">'+safe(c)+'</button>';}).join("")+'</div>'+
      '<div class="r2-group">Produtos da casa <small id="catalogCount">'+visibleProducts().length+' encontrados</small></div>'+
      '<div class="r2-catalog-list" id="catalogRows">'+catalogRows()+'</div>'+
      '<div class="r2-bottom-hint">O catálogo organiza o que a casa costuma comprar. A compra atual continua independente.</div>';
  }
  function historyGroups(){
    var rows=activeHouse().history.filter(function(h){return state.historyMonth==="Todos"||h.month.startsWith(state.historyMonth);});
    if(!rows.length)return '<div class="r2-empty">'+ic("history")+'<h3>Ainda não há compras concluídas</h3><p>Quando uma compra for encerrada, seu registro aparecerá aqui com valores e produtos.</p><button class="r2-outline" data-nav="compra">'+ic("basket",15)+'Ir para Compra</button></div>';
    var months=Array.from(new Set(rows.map(function(h){return h.month;})));
    return months.map(function(month){
      var section=rows.filter(function(h){return h.month===month;});
      return '<div class="r2-history-month">'+month+'</div><div class="r2-history-list">'+section.map(function(h){
        return '<button class="r2-history-entry" data-history-open="'+h.id+'"><span class="r2-history-icon">'+ic("basket",18)+'</span><span class="r2-history-text"><b>'+safe(h.title)+'</b><small>'+h.date+' · '+h.count+' itens</small></span><span class="r2-history-total"><b>'+brl(h.total)+'</b><small>Ver detalhes '+ic("chevron",12)+'</small></span></button>';
      }).join("")+'</div>';
    }).join("");
  }
  function historyDetail(){
    var h=activeHouse().history.find(function(row){return row.id===state.historyDetail;});
    if(!h)return '';
    return '<button class="r2-back" data-history-back="1">'+ic("back",16)+'Voltar ao histórico</button>'+
      viewHead("COMPRA CONCLUÍDA",safe(h.title),h.date+" · "+h.count+" itens registrados","")+
      '<div class="r2-detail-hero"><small>Total registrado</small><b>'+brl(h.total)+'</b><div style="margin-top:8px" class="r2-tiny">'+safe(h.compared)+'</div></div>'+
      '<div class="r2-group">'+ic("box",16)+'Destaques de produtos <small>'+h.rows.length+' de '+h.count+' itens · preço por unidade</small></div>'+
      '<div class="r2-detail-list">'+h.rows.map(function(i){
        var delta=i.delta===null?'':('<div class="r2-delta '+(i.delta<0?"better":"")+'">'+(i.delta>0?"+":"−")+brl(Math.abs(i.delta))+' / un. em relação à compra anterior</div>');
        return '<div class="r2-detail-row"><div><b>'+safe(i.name)+'</b><small>'+i.qty+' un. · Comprado</small>'+delta+'</div><div class="price-current">'+brl(i.price*i.qty)+'<small>'+brl(i.price)+' / un.</small></div></div>';
      }).join("")+'</div><p class="r2-bottom-hint">Comparações consideram o preço por unidade do mesmo produto em compras anteriores.</p>';
  }
  function historyView(){
    if(state.historyDetail)return historyDetail();
    var rows=activeHouse().history,sum=rows.reduce(function(s,i){return s+i.total;},0);
    return viewHead("","Compras anteriores",rows.length+" compras concluídas · "+safe(activeHouse().name),"")+
      '<div class="r2-statrow"><div class="r2-stat"><span>Compras</span><b>'+rows.length+'</b></div><div class="r2-stat"><span>Última compra</span><b>'+(rows.length?brl(rows[0].total):"—")+'</b></div><div class="r2-stat"><span>Total registrado</span><b>'+brl(sum)+'</b></div></div>'+
      '<div class="r2-month-switch">'+["Todos","Outubro","Setembro"].map(function(m){return '<button class="'+(state.historyMonth===m?"active":"")+'" data-history-month="'+m+'">'+m+'</button>';}).join("")+'</div>'+historyGroups();
  }
  function memberRow(m){
    var self=m.id==="gabriel",owner=m.role==="owner",name=safe(m.name),role=owner?"Proprietário":"Membro";
    return '<div class="r2-member-card"><div class="r2-member-identity"><span class="r2-member-avatar">'+safe(m.name.split(" ").map(function(w){return w[0];}).slice(0,2).join(""))+'</span><div class="r2-member-person"><b>'+name+(self?' <span class="r2-tag ink">Você</span>':'')+'</b><small>'+safe(m.email)+' · '+safe(m.joined)+'</small></div></div>'+
      '<div class="r2-member-controls"><span class="r2-role '+(owner?"owner":"")+'">'+ic(owner?"shield":"user",13)+role+'</span><div class="r2-member-actions">'+(permitted()&&!self?'<button class="r2-linkbtn" data-member-transfer="'+m.id+'">Transferir</button><button class="r2-linkbtn danger" data-member-remove="'+m.id+'">Remover</button>':'<span class="r2-tiny">'+(self&&owner?"Sua conta":"Permissões definidas pelo proprietário")+'</span>')+'</div></div></div>';
  }
  function peopleView(){
    var house=activeHouse(),invite=state.invite;
    return viewHead("","Pessoas da casa","Cada pessoa tem uma conta. As compras são compartilhadas.","")+
      '<div class="r2-people-house"><span class="r2-house-icon">'+ic("home",21)+'</span><div style="flex:1;min-width:0"><b>'+safe(house.name)+'</b><small>Casa ativa · '+house.members.length+' pessoa'+(house.members.length===1?"":"s")+'</small></div><button data-house-menu="1" class="r2-outline" style="min-height:37px;padding:7px 9px">'+ic("down",13)+'Trocar</button></div>'+
      '<div class="r2-people-section"><h3>Pessoas da casa <small>('+house.members.length+')</small></h3><button class="r2-outline" data-modal="invite" style="min-height:37px;padding:8px 10px">'+ic("plus",14)+'Criar convite</button></div>'+
      '<div class="r2-member-list">'+house.members.map(memberRow).join("")+'</div>'+
      '<div class="r2-invite"><b>Convites e acesso</b><p>Um convite dá acesso a esta casa, não à conta de outra pessoa. A propriedade pode ser transferida com confirmação.</p>'+
      (invite?'<div class="r2-tag">Convite demonstrativo: '+safe(invite)+'</div>':'<span class="r2-tiny">Nenhum convite de demonstração criado nesta sessão.</span>')+'</div>';
  }
  function viewHtml(){
    if(state.view==="compra")return purchaseView();
    if(state.view==="casa")return catalogView();
    if(state.view==="historico")return historyView();
    return peopleView();
  }
  function asideHtml(){
    var h=activeHouse(),t=totals();
    if(state.view==="compra")return '<div class="r2-aside-card"><h3 class="r2-aside-title">'+ic("basket")+'Resumo da compra</h3><dl><div><dt>Pendentes</dt><dd>'+t.pending+'</dd></div><div><dt>Comprados</dt><dd>'+t.done+'</dd></div><div><dt>Já temos</dt><dd>'+t.have+'</dd></div><div><dt>Preço desconhecido</dt><dd>'+h.items.filter(function(i){return i.price===null;}).length+'</dd></div></dl><p class="r2-micro-note">O valor total usa apenas itens comprados com preço informado.</p></div>'+
      '<div class="r2-aside-card"><h3 class="r2-aside-title">'+ic("home")+'Contexto ativo</h3><p class="r2-micro-note" style="margin:0"><b>'+safe(h.name)+'</b> · '+h.members.length+' participantes</p><button class="r2-outline" data-house-menu="1" style="margin-top:13px">'+ic("refresh",14)+'Trocar casa</button></div>';
    if(state.view==="casa")return '<div class="r2-aside-card"><h3 class="r2-aside-title">'+ic("box")+'Sobre o catálogo</h3><dl><div><dt>Produtos recorrentes</dt><dd>'+h.catalog.length+'</dd></div><div><dt>Já temos</dt><dd>'+h.catalog.filter(function(p){return p.have;}).length+'</dd></div><div><dt>Categorias</dt><dd>'+new Set(h.catalog.map(function(p){return p.cat;})).size+'</dd></div></dl><p class="r2-micro-note">Produtos da casa podem ser incluídos na próxima compra com um toque.</p></div><div class="r2-aside-card r2-accent-card"><strong>Busca é uma ferramenta de rotina.</strong><p>Não exige rolar dezenas de linhas para encontrar um produto.</p></div>';
    if(state.view==="historico")return '<div class="r2-aside-card"><h3 class="r2-aside-title">'+ic("history")+'Leitura do histórico</h3><p class="r2-micro-note" style="margin:0">Compras agrupadas por mês, com totais e registros por produto.</p><dl style="margin-top:14px"><div><dt>Compras concluídas</dt><dd>'+h.history.length+'</dd></div><div><dt>Comparação</dt><dd>Por unidade</dd></div></dl></div><div class="r2-aside-card r2-accent-card"><strong>Informação onde ela importa.</strong><p>Variações de preço aparecem no detalhe do produto, com referência da compra anterior.</p></div>';
    return '<div class="r2-aside-card"><h3 class="r2-aside-title">'+ic("shield")+'Permissões da casa</h3><dl><div><dt>Proprietários</dt><dd>'+h.members.filter(function(m){return m.role==="owner";}).length+'</dd></div><div><dt>Participantes</dt><dd>'+h.members.length+'</dd></div><div><dt>Conta ativa</dt><dd>Gabriel</dd></div></dl><p class="r2-micro-note">Identidades completas e ações sensíveis em áreas separadas.</p></div><div class="r2-aside-card r2-accent-card"><strong>Casa ativa sempre visível.</strong><p>Esta prévia guarda a seleção de casa no navegador. Não substitui autenticação nem RLS reais.</p></div>';
  }
  function bottomHtml(){
    var t=totals(),quick='';
    if(state.view==="compra")quick='<div class="r2-purchase-footer"><span><b>'+t.pending+' pendentes</b>'+t.done+' comprados · '+t.have+' já temos</span><button class="r2-primary" data-modal="newItem">'+ic("plus",15)+'Adicionar item</button></div>';
    if(state.view==="casa")quick='<div class="r2-purchase-footer"><span><b>'+activeHouse().catalog.length+' produtos</b>catálogo recorrente</span><button class="r2-primary" data-modal="newCatalog">'+ic("plus",15)+'Novo produto</button></div>';
    if(state.view==="pessoas")quick='<div class="r2-purchase-footer"><span><b>'+activeHouse().members.length+' participantes</b>acesso compartilhado</span><button class="r2-primary" data-modal="invite">'+ic("plus",15)+'Criar convite</button></div>';
    return '<footer class="r2-bottom-footer '+(!quick?"compact-footer":"")+'">'+quick+'<nav class="bottomnav" aria-label="Navegação principal">'+
      [["compra","Compra","basket"],["historico","Histórico","history"],["casa","Casa","home"]].map(function(l){return '<button data-nav="'+l[0]+'" class="'+(state.view===l[0]?"active":"")+'">'+ic(l[2])+l[1]+'</button>';}).join("")+'</nav></footer>';
  }
  function houseMenu(){
    return '<div class="r2-house-switcher" role="menu"><span>CASAS DISPONÍVEIS</span>'+Object.keys(houses).map(function(k){var h=houses[k];return '<button role="menuitem" class="r2-house-option '+(state.house===k?"active":"")+'" data-house="'+k+'">'+ic("home",17)+'<span style="flex:1"><strong>'+safe(h.name)+'</strong><small>'+h.members.length+' participante'+(h.members.length===1?"":"s")+'</small></span><span class="selection">'+(state.house===k?"✓":"")+'</span></button>';}).join("")+'</div>';
  }
  function modalHtml(){
    var mode=state.modal;
    if(!mode)return '';
    var header="",body="",primary="Salvar",footCancel="Cancelar",submit=true;
    if(mode==="newItem"){
      header="Adicionar à compra";
      body='<form id="r2Form" data-form="newItem" class="r2-form"><label>Nome do produto<input name="name" placeholder="Ex.: Iogurte natural" maxlength="70" required></label>'+
        '<div class="r2-form-row"><label>Quantidade<input type="number" name="qty" value="1" min="1" max="9999" required></label><label>Preço unitário (R$)<input name="price" inputmode="decimal" placeholder="Ex.: 4,50"></label></div>'+
        '<div class="r2-form-note">Campo vazio = preço desconhecido. R$ 0,00 = gratuito. Formato 1.234,50 é aceito.</div>'+(state.error?'<div class="r2-form-error" role="alert">'+safe(state.error)+'</div>':'')+'</form>';
      primary="Adicionar item";
    } else if(mode==="budget"){
      header="Meta da compra";
      body='<form id="r2Form" data-form="budget" class="r2-form"><label>Orçamento da compra (R$)<input name="budget" inputmode="decimal" value="'+activeHouse().budget.toFixed(2).replace(".",",")+'" required></label>'+
        '<div class="r2-form-note">R$ 0,00 representa meta zero. O valor não desaparece nem é confundido com “sem meta”.</div>'+(state.error?'<div class="r2-form-error" role="alert">'+safe(state.error)+'</div>':'')+'</form>';
      primary="Salvar meta";
    } else if(mode==="newCatalog"){
      header="Novo produto da casa";
      body='<form id="r2Form" data-form="newCatalog" class="r2-form"><label>Nome do produto<input name="name" placeholder="Ex.: Aveia em flocos" maxlength="70" required></label>'+
        '<div class="r2-form-row"><label>Quantidade padrão<input type="number" name="qty" value="1" min="1" max="9999" required></label><label>Categoria<select name="cat"><option>Mercearia</option><option>Hortifruti</option><option>Laticínios</option><option>Limpeza</option><option>Padaria</option><option>Outros</option></select></label></div>'+
        '<div class="r2-form-note">Produtos ficam disponíveis para montar compras futuras.</div>'+(state.error?'<div class="r2-form-error" role="alert">'+safe(state.error)+'</div>':'')+'</form>';
      primary="Criar produto";
    } else if(mode==="invite"){
      header="Convite para esta casa";
      body='<div class="r2-form-note">O convite permite que outra conta participe de <b>'+safe(activeHouse().name)+'</b>. Esta é uma demonstração sem convite real.</div>'+
        '<div style="padding:14px;background:#f0f7ed;border:1px solid #d7e9d5;border-radius:11px;margin-top:15px;font-size:11px;color:#416a4a">O código será exibido na página após criar o convite.</div>';
      primary="Gerar convite fictício";
      submit=false;
    } else if(mode==="confirmMember"){
      var m=activeHouse().members.find(function(member){return member.id===state.modalMeta.id;});
      if(!m)return '';
      var transfer=state.modalMeta.action==="transfer";
      header=transfer?"Transferir propriedade":"Remover participante";
      body='<p class="r2-confirm">'+(transfer?"Transferir a propriedade de <b>"+safe(activeHouse().name)+"</b> para <b>"+safe(m.name)+"</b>? Você continuará participante, mas deixará de ser proprietário.":"Remover <b>"+safe(m.name)+"</b> desta casa? Essa pessoa perderá o acesso ao conteúdo compartilhado.")+'</p><p class="r2-form-note">Confirmação simulada. Nenhuma permissão real será modificada.</p>';
      primary=transfer?"Confirmar transferência":"Confirmar remoção";
      submit=false;
    }
    return '<div class="r2-overlay"><div class="r2-sheet" role="dialog" aria-modal="true" aria-labelledby="r2-sheet-title"><header class="r2-sheet-head"><div><h3 id="r2-sheet-title">'+header+'</h3><p>'+safe(activeHouse().name)+' · prévia interativa</p></div><button class="r2-icon-button" data-close="1" aria-label="Fechar">'+ic("x")+'</button></header>'+
      '<div class="r2-sheet-body">'+body+'</div><footer class="r2-sheet-foot"><button class="r2-outline" data-close="1">'+footCancel+'</button><button class="r2-primary" '+(submit?'type="submit" form="r2Form"':'data-confirm="1"')+'>'+ic(mode==="confirmMember"?"check":"plus",16)+primary+'</button></footer></div></div>';
  }
  function appMarkup(){
    return '<div class="app-layout">'+(state.device==="1440"?sidebar():"")+'<section class="app-body">'+appHeader()+
      '<div class="scroll"><div class="r2-main-content"><main class="r2-main-column r2-route">'+viewHtml()+'</main><aside class="r2-desktop-aside">'+asideHtml()+'</aside></div></div>'+
      (state.device==="1440"?'':bottomHtml())+'</section></div>'+
      (state.houseMenu?houseMenu():'')+modalHtml()+'<div class="r2-toast" id="r2Toast" hidden role="status"></div>';
  }
  function notesHtml(){
    var m=screenMeta[state.view],palette=paletteOptions[state.palette];
    return '<section class="note"><div class="r2-note-head"><span class="r2-bubble">'+ic(m.icon,17)+'</span><span class="note-label">CONSOLIDAÇÃO / '+m.title+'</span></div><h3>'+m.subtitle+'</h3><p>'+m.why+'</p><ul>'+m.rules.map(function(r){return '<li>'+r+'</li>';}).join("")+'</ul><div class="r2-problem">'+m.findings[0]+'</div></section>'+
      '<section class="note"><div class="note-label">Identidade visual</div><h3>'+palette.name+' <small class="r27-note-tag">'+palette.tag+'</small></h3><p>'+palette.desc+'</p><div class="r2-token-grid">'+palette.colors.map(function(c){return '<span class="r2-swatch" title="'+c+'" style="background:'+c+'"></span>';}).join("")+'</div>'+
      '<div class="r2-pair"><span>Marca</span><b>'+palette.colors[0]+'</b></div><div class="r2-pair"><span>Ação</span><b>'+palette.colors[1]+'</b></div><div class="r2-pair"><span>Destaque</span><b>'+palette.colors[2]+'</b></div><div class="r2-pair"><span>Tipografia</span><b>Nexa / Manrope</b></div><p class="r27-type-disclaimer">A Nexa precisa de licença e arquivos de webfont. Esta prévia renderiza Manrope, com Nexa priorizada no stack quando disponível.</p></section>'+
      '<section class="note r3-motion-note"><div class="note-label">Movimento com função</div><h3>Feedback em situações reais</h3><ul><li>Marque um produto: valor e barra respondem juntos em 360 ms.</li><li>Troque de seção: entrada discreta de 180 ms.</li><li>Abra “Adicionar item”: sheet de 260 ms e foco no formulário.</li></ul><p>Use “Movimento reduzido” acima para comparar o mesmo fluxo sem animações. As ações permanecem simuladas.</p></section>';
  }
  function labShell(){
    document.querySelector(".brand").innerHTML='<span class="brand-mark">r<span class="r27-brand-dot">.</span></span><span>restok<span class="r27-brand-dot">.</span> <span class="r25-brand-slash">/</span> identidade</span><span class="crumb">Demonstração independente</span>';
    document.querySelector(".top-badge").textContent="CONSOLIDAÇÃO V1";
    var main=document.querySelector("main.page");
    main.innerHTML='<section class="hero"><div><h1>Raiz & Eucalipto, consolidado.</h1><p>Referência visual escolhida para o Restok: componentes leves, gasto em destaque e navegação objetiva. Explore os quatro fluxos antes do planejamento de implementação.</p></div></section>'+
      '<nav class="r2-nav" aria-label="Fluxos do Restok">'+Object.keys(screenMeta).map(function(k){var m=screenMeta[k];return '<button class="r2-navbtn" data-nav="'+k+'">'+ic(m.icon,17)+m.title+'</button>';}).join("")+'</nav>'+
      '<div class="r27-identity-toolbar"><div class="r4-identity-lock"><span class="r4-lock-dot" aria-hidden="true"></span><strong>Raiz & Eucalipto</strong><span class="r4-lock-tag">Direção escolhida</span></div><div class="r4-handoff-tools"><button class="r3-motion-toggle" data-motion-toggle="1" type="button" aria-pressed="false">Movimento: padrão</button><a href="handoff/" class="r4-doc-link">Consultar Design System v1 '+ic("arrow",14)+'</a></div></div>'+
      '<div class="r2-toolrow"><div class="r2-statusline">Prévia navegável · Dados fictícios</div><div class="tools"><div class="seg" aria-label="Dispositivo"><button data-device="390">Mobile 390</button><button data-device="320">320 compacto</button><button data-device="1440">Desktop 1440</button></div></div><button id="r25Focus" class="r25-focus-toggle" type="button" aria-pressed="false">Ver só o app '+ic("arrow",14)+'</button></div>'+
      '<div class="layout"><section class="preview"><div class="preview-head"><div><b id="r2PreviewName">Compra / Raiz & Eucalipto</b><small id="r2PreviewSize">Mobile 390 × 844</small></div><span class="demo-badge">Dados simulados</span></div><div class="stage" id="stage"><div class="frame" id="frame"><div class="app a" id="app"></div></div></div></section><aside class="notes r2-note" id="notes"></aside></div>'+
      '<section class="audit"><div><h3>Próxima decisão: implementação</h3><p>Esta prévia define a linguagem visual, não a arquitetura do produto real. O próximo agente deverá inventariar estilos e instruções antigas, preservar todas as funcionalidades e propor substituição completa do design legado em fases. <a href="handoff/">Leia o handoff consolidado</a>.</p></div></section>'+
      '<div class="footer">Estudo independente · Nenhuma alteração no código ou nos dados reais do Restok</div>';
  }
  function dimensions(){return {w:state.device==="1440"?1440:Number(state.device),h:state.device==="1440"?900:state.device==="320"?640:844};}
  function motionAllowed(){return state.motion==="standard"&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches;}
  function animateMoney(el,from,to){
    if(!el||!Number.isFinite(from)||!Number.isFinite(to)||from===to)return;
    var start=null,duration=360;
    el.textContent=brl(from);
    function frame(now){
      if(!el.isConnected)return;
      if(start===null)start=now;
      var t=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-t,3);
      el.textContent=brl(from+(to-from)*ease);
      if(t<1)requestAnimationFrame(frame);else el.textContent=brl(to);
    }
    requestAnimationFrame(frame);
  }
  function resize(){
    var stage=document.getElementById("stage"),frame=document.getElementById("frame"),app=document.getElementById("app");
    if(!stage||!frame||!app)return;
    var sz=dimensions(),scale=Math.min(1,Math.max(.25,(stage.clientWidth-36)/sz.w));
    frame.style.width=(sz.w*scale+2)+"px";frame.style.height=(sz.h*scale+2)+"px";frame.className="frame"+(state.device==="1440"?" desktop":"");
    app.style.width=sz.w+"px";app.style.height=sz.h+"px";app.style.transform="scale("+scale+")";stage.style.minHeight=Math.ceil(sz.h*scale+60)+"px";
  }
  var lastRenderedView=null;
  function draw(preserveScroll){
    var oldScroll=document.querySelector("#app .scroll"),oldTop=preserveScroll&&oldScroll?oldScroll.scrollTop:0;
    document.body.dataset.palette=state.palette;
    document.body.dataset.motion=state.motion;
    document.querySelectorAll(".r2-navbtn").forEach(function(b){var active=b.dataset.nav===state.view;b.classList.toggle("active",active);b.setAttribute("aria-current",active?"page":"false");});
    document.querySelectorAll("[data-device]").forEach(function(b){b.classList.toggle("active",b.dataset.device===state.device);});
    var motionToggle=document.querySelector("[data-motion-toggle]");
    if(motionToggle){motionToggle.setAttribute("aria-pressed",String(state.motion==="reduced"));motionToggle.textContent=state.motion==="reduced"?"Movimento: reduzido":"Movimento: padrão";}
    var sz=dimensions(),app=document.getElementById("app");
    var routeChanged=lastRenderedView!==state.view;
    var priorBudget=app.querySelector(".budget-number"),priorRemaining=app.querySelector(".budget-available b"),priorProgress=app.querySelector(".progress i");
    var oldSpent=priorBudget?Number(priorBudget.dataset.value):null,oldRemaining=priorRemaining?Number(priorRemaining.dataset.value):null;
    var oldWidth=priorProgress?priorProgress.style.width:null,sameHouse=app.dataset.house===state.house;
    var oldFocused=document.activeElement,focusKey=null;
    if(oldFocused&&app.contains(oldFocused)){
      ["data-purchase-toggle","data-purchase-have","data-product-owned","data-add-catalog"].some(function(key){
        var v=oldFocused.getAttribute(key);
        if(v!==null){focusKey='['+key+'="'+v+'"]';return true;}
        return false;
      });
    }
    app.className="app a"+(state.device==="1440"?" desktop":"")+(state.device==="320"?" compact":"")+(routeChanged?" route-change":"")+(state.filterChanged?" r3-filter-change":"");
    app.innerHTML=appMarkup();
    app.dataset.house=state.house;
    lastRenderedView=state.view;
    state.filterChanged=false;
    document.getElementById("r2PreviewName").textContent=activeViewLabel()+" / "+paletteOptions[state.palette].name;
    document.getElementById("r2PreviewSize").textContent=(state.device==="1440"?"Desktop":"Mobile")+" · "+sz.w+" × "+sz.h+" · interativo";
    document.getElementById("notes").innerHTML=notesHtml();
    resize();
    var scroll=app.querySelector(".scroll");if(scroll&&preserveScroll)scroll.scrollTop=oldTop;
    if(state.modal){var field=app.querySelector(".r2-sheet input");if(field)field.focus();}
    else if(focusKey){var next=app.querySelector(focusKey);if(next)next.focus({preventScroll:true});}
    if(motionAllowed()&&!routeChanged&&sameHouse&&state.view==="compra"){
      var newSpent=app.querySelector(".budget-number"),newRemaining=app.querySelector(".budget-available b"),newProgress=app.querySelector(".progress i");
      if(newSpent)animateMoney(newSpent,oldSpent,Number(newSpent.dataset.value));
      if(newRemaining)animateMoney(newRemaining,oldRemaining,Number(newRemaining.dataset.value));
      if(newProgress&&oldWidth!==null&&oldWidth!==newProgress.style.width){
        newProgress.animate([{width:oldWidth},{width:newProgress.style.width}],{duration:360,easing:"cubic-bezier(.2,.8,.2,1)"});
      }
    }
  }
  var toastTimer;
  var modalReturnSelector=null;
  function modalFocusFrom(button){
    var attr=["data-modal","data-member-transfer","data-member-remove"].find(function(key){return button.hasAttribute(key);});
    modalReturnSelector=attr?'['+attr+'="'+button.getAttribute(attr)+'"]':null;
  }
  function restoreModalFocus(){
    if(!modalReturnSelector)return;
    var buttons=Array.from(document.querySelectorAll('#app '+modalReturnSelector));
    var target=buttons.find(function(el){return el.getClientRects().length>0;});
    if(target)target.focus({preventScroll:true});
    modalReturnSelector=null;
  }
  function toast(msg){
    var el=document.getElementById("r2Toast");
    if(!el)return;el.textContent=msg;el.hidden=false;clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){el.hidden=true;},1900);
  }
  function gotoView(view){
    state.view=view;state.q="";state.purchaseFilter="all";state.productCategory="Todos";state.historyDetail=null;state.modal=null;state.houseMenu=false;state.error="";
    draw();
  }
  function openModal(name,meta){state.modal=name;state.modalMeta=meta||null;state.error="";state.houseMenu=false;draw(true);}
  function parseMoney(text){
    var v=String(text||"").trim().replace(/R\$/g,"").replace(/\s/g,"");
    if(!v)return null;
    if(!/^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/.test(v))throw new Error("Use um valor como 4,50 ou 1.234,50.");
    var n=Number(v.replace(/\./g,"").replace(",","."));
    if(!Number.isFinite(n)||n<0)throw new Error("O valor deve ser igual ou maior que zero.");
    return n;
  }
  document.addEventListener("click",function(e){
    var b=e.target.closest("button");
    if(!b){if(e.target.classList.contains("r2-overlay")){state.modal=null;draw(true);restoreModalFocus();}return;}
    if(b.dataset.motionToggle){state.motion=state.motion==="standard"?"reduced":"standard";draw(true);return;}
    if(b.id==="r25Focus"){var focused=document.body.classList.toggle("r25-focus");b.innerHTML=focused?'Voltar ao estudo '+ic("x",14):'Ver só o app '+ic("arrow",14);b.setAttribute("aria-pressed",String(focused));resize();return;}
    if(b.dataset.nav){gotoView(b.dataset.nav);return;}
    if(b.dataset.device){state.device=b.dataset.device;state.modal=null;state.houseMenu=false;draw();return;}
    if(b.dataset.houseMenu){state.houseMenu=!state.houseMenu;draw(true);return;}
    if(b.dataset.house){state.house=b.dataset.house;localStorage.setItem("restok-r25-active-house",state.house);state.houseMenu=false;state.invite=null;state.q="";state.purchaseFilter="all";state.productCategory="Todos";state.historyDetail=null;draw();toast("Casa ativa: "+activeHouse().name);return;}
    if(b.dataset.purchaseFilter){state.purchaseFilter=b.dataset.purchaseFilter;state.filterChanged=true;draw(true);return;}
    if(b.dataset.category){state.productCategory=b.dataset.category;state.filterChanged=true;draw(true);return;}
    if(b.dataset.clearList){state.q="";state.purchaseFilter="all";state.productCategory="Todos";state.filterChanged=true;draw(true);return;}
    if(b.dataset.purchaseToggle){
      var item=activeHouse().items.find(function(i){return i.id===Number(b.dataset.purchaseToggle);});
      if(item){item.state=item.state==="done"?"todo":"done";state.lastChanged=item.id;draw(true);toast(item.state==="done"?"Item marcado como comprado":"Item voltou para pendentes");setTimeout(function(){state.lastChanged=null;},280);}return;
    }
    if(b.dataset.purchaseHave){
      var item2=activeHouse().items.find(function(i){return i.id===Number(b.dataset.purchaseHave);});
      if(item2){item2.state=item2.state==="have"?"todo":"have";state.lastChanged=item2.id;draw(true);toast(item2.state==="have"?"Marcado como Já temos":"Item voltou para pendentes");setTimeout(function(){state.lastChanged=null;},280);}return;
    }
    if(b.dataset.productOwned){
      var prod=activeHouse().catalog.find(function(i){return i.id===Number(b.dataset.productOwned);});
      if(prod){prod.have=!prod.have;draw(true);toast(prod.have?"Já temos este produto":"Produto marcado como necessário");}return;
    }
    if(b.dataset.addCatalog){
      var p=activeHouse().catalog.find(function(i){return i.id===Number(b.dataset.addCatalog);});
      if(!p)return;var existing=activeHouse().items.some(function(i){return i.name===p.name&&i.state==="todo";});
      if(existing){toast("Este produto já está pendente na compra");return;}
      activeHouse().items.unshift({id:Date.now(),name:p.name,qty:p.qty,detail:p.qty+" un. · "+p.detail,price:null,state:"todo",cat:p.cat});
      state.lastAdded=activeHouse().items[0].id;draw(true);toast("Adicionado à compra atual");setTimeout(function(){state.lastAdded=null;},420);return;
    }
    if(b.dataset.historyMonth){state.historyMonth=b.dataset.historyMonth;state.filterChanged=true;draw(true);return;}
    if(b.dataset.historyOpen){state.historyDetail=b.dataset.historyOpen;draw();return;}
    if(b.dataset.historyBack){state.historyDetail=null;draw();return;}
    if(b.dataset.modal){modalFocusFrom(b);openModal(b.dataset.modal);return;}
    if(b.dataset.memberTransfer){modalFocusFrom(b);openModal("confirmMember",{id:b.dataset.memberTransfer,action:"transfer"});return;}
    if(b.dataset.memberRemove){modalFocusFrom(b);openModal("confirmMember",{id:b.dataset.memberRemove,action:"remove"});return;}
    if(b.dataset.close){state.modal=null;state.error="";draw(true);restoreModalFocus();return;}
    if(b.dataset.confirm){
      if(state.modal==="invite"){state.invite="RSTK-EXEMPLO-"+String(Math.floor(Math.random()*9000)+1000);state.modal=null;draw(true);toast("Convite fictício gerado");return;}
      if(state.modal==="confirmMember"){
        var m=activeHouse().members.find(function(i){return i.id===state.modalMeta.id;});
        if(!m){state.modal=null;draw();return;}
        var resultMessage;
        if(state.modalMeta.action==="transfer"){activeHouse().members.forEach(function(i){if(i.role==="owner")i.role="member";});m.role="owner";resultMessage="Transferência simulada concluída";}
        else{activeHouse().members=activeHouse().members.filter(function(i){return i.id!==m.id;});resultMessage="Participante removido da simulação";}
        state.modal=null;draw(true);toast(resultMessage);return;
      }
    }
    if(b.dataset.sort){toast("Ordenação por categoria · demonstração");return;}
  });
  document.addEventListener("input",function(e){
    if(!e.target.matches(".r2-search-field"))return;
    state.q=e.target.value;
    if(state.view==="compra"){
      var target=document.getElementById("purchaseItems");if(target)target.innerHTML=purchaseRows();
      var n=document.getElementById("purchaseCount");if(n)n.textContent="· "+visibleItems().length+" itens";
    }
    if(state.view==="casa"){
      var rows=document.getElementById("catalogRows");if(rows)rows.innerHTML=catalogRows();
      var count=document.getElementById("catalogCount");if(count)count.textContent=visibleProducts().length+" encontrados";
    }
  });
  document.addEventListener("submit",function(e){
    if(e.target.id!=="r2Form")return;
    e.preventDefault();
    var f=new FormData(e.target),mode=e.target.dataset.form,name=String(f.get("name")||"").trim(),qty=Number(f.get("qty")||0);
    try{
      if(mode==="newItem"){
        if(!name||!Number.isInteger(qty)||qty<1||qty>9999)throw new Error("Informe nome e quantidade válida.");
        var price=parseMoney(f.get("price"));
        activeHouse().items.unshift({id:Date.now(),name:name,qty:qty,detail:qty+" "+(qty===1?"unidade":"unidades"),price:price,state:"todo",cat:"Adicionados"});
        state.q="";state.purchaseFilter="all";state.modal=null;state.lastAdded=activeHouse().items[0].id;draw();restoreModalFocus();toast(name+" adicionado à compra");setTimeout(function(){state.lastAdded=null;},420);
      }else if(mode==="budget"){
        var budget=parseMoney(f.get("budget"));
        if(budget===null)throw new Error("Informe um orçamento.");
        activeHouse().budget=budget;state.modal=null;draw(true);restoreModalFocus();toast("Meta atualizada");
      }else if(mode==="newCatalog"){
        if(!name||!Number.isInteger(qty)||qty<1||qty>9999)throw new Error("Informe nome e quantidade válida.");
        activeHouse().catalog.unshift({id:Date.now(),name:name,cat:String(f.get("cat")||"Outros"),detail:"Novo produto",qty:qty,have:false,active:true});
        state.q="";state.productCategory="Todos";state.modal=null;draw();restoreModalFocus();toast("Produto incluído no catálogo");
      }
    }catch(error){
      state.error=error.message;
      var formEl=document.getElementById("r2Form"),err=formEl&&formEl.querySelector(".r2-form-error");
      if(formEl&&!err){err=document.createElement("div");err.className="r2-form-error";err.setAttribute("role","alert");formEl.appendChild(err);}
      if(err)err.textContent=state.error;
    }
  });
  document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){
      if(state.modal){state.modal=null;draw(true);restoreModalFocus();}
      else if(state.houseMenu){state.houseMenu=false;draw(true);}
      else if(document.body.classList.contains("r25-focus")){
        document.body.classList.remove("r25-focus");
        var focusButton=document.getElementById("r25Focus");
        if(focusButton){focusButton.innerHTML='Ver só o app '+ic("arrow",14);focusButton.setAttribute("aria-pressed","false");}
        resize();
      }
    }
  });
  labShell();draw();
  if(typeof ResizeObserver!=="undefined")new ResizeObserver(resize).observe(document.getElementById("stage"));else window.addEventListener("resize",resize);
})();

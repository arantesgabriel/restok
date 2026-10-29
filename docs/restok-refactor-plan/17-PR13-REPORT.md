# PR13: retirada da cascata legada e integração pública mínima

29/10/2026 · America/Sao_Paulo. Autorizado com PR12. Base302f851; unidade local separada. Sem PR14/15, push, merge, deploy, dependências novas ou banco.

## Implementação

app/layout.tsx ativa restok-theme no html e importa apenas globals.css novo. Globals agora agrega base, motion e reset semântico e utilitários Tailwind, sem preflight ou paleta antigos. ThemeColor passa para F7FAF5. styles/reset.css substitui os contratos estruturais que antes vinham do preflight: margem, box sizing, bordas, headings/listas, mídia, fontes dos controles e movimento reduzido. Foco e Manrope vêm da base nova.

tailwind.config.ts usa o vocabulário semântico compartilhado em tailwind.raiz.config.ts, com pesos reais; não há aliases primary/sage/terracotta ou override de bold para600. Retirados app/ui.css e o components/action-menu.tsx antigo sem consumidores. Reexports de módulos de compatibilidade permanecem quando necessários a testes históricos; não são aliases de paleta.

Landing mantém composição, conteúdo, demos locais, links, IDs e fluxo SSR anteriores, com referências diretas aos papéis novos em seu CSS e BrandMark do primitivo. O aviso de sessão usa text-action. Não foi implementada a reconstrução editorial ou demos novas do PR14. O core não importa CSS histórico.

CSS/config anteriores foram preservados em tests/e2e/legacy e carregam somente em rotas /before-* do harness. O config desse arquivo examina fixtures históricas, não o bundle do produto. tests/e2e/entry.tsx usa a base nova por padrão e cria a mesma fronteira de tema do layout real. Não se iniciou servidor4173 nem se criou bypass de autenticação no app.

## Validação

- **223/223 testes em38 arquivos** no conjunto final:220 após PR12 e três testes de migração. Cobertura nova verifica resolução de todas as variáveis da página pública, emissão de papéis/alpha e peso700 sem aliases antigos e ausência de imports históricos no grafo de fontes de produção. Esta execução também cobre as regressões de lifecycle/avisos do PR12.
- Lint, typecheck sem incremental, build Webpack final e diff-check passaram. Helper de medição também passou em ESLint. Build concluiu as mesmas rotas públicas/autenticadas e mantém middleware; aviso de convenção proxy permanece fora desta mudança.
- Auditoria do CSS emitido: nenhuma definição da paleta antiga, seletor login-panel/restok-app ou fonte Restok Geist; Manrope presente. Busca nas fontes app/components/styles não encontrou referências aos tokens antigos de cor. Resultados em evidence/pr13/emitted-css-audit.json.
- Nenhuma mudança em lib, app/auth, middleware.ts ou supabase em relação ao PR12. Guardas/RLS/RPC, persistência e snapshots não foram alterados. Hashes de next-env/package/lock/tsconfig/seed idênticos aos anteriores; next-env restaurado aos bytes capturados após build. Alterações preexistentes continuam fora do commit.

## Custo do build

Medição reproduzível por tests/e2e/measure-build-assets.mjs, sem executar manifestos. before-assets.json é o buildPR12 produzido nesta rodada; after-assets.json é o buildPR13. Cada rota soma referências JS/CSS únicas do respectivo client-reference manifest; é o grafo de dependências, **não requisições observadas de primeiro acesso**. Gzip por arquivo, fontes públicas medidas separadamente. Assets compartilhados aparecem em mais de uma rota; não somar linhas como transferência de um usuário.

| Rota | Antes raw/gzip bytes | Depois raw/gzip bytes |
| --- | --- | --- |
| / |72421 /22160 |77809 /23043 |
| /app |473524 /130927 |458891 /127297 |
| /login |378189 /103814 |363557 /100184 |
| /reset-password |372701 /102012 |358069 /98382 |

Todos os JS/CSS emitidos:1394716→1380083 bytes raw;418369→414737 gzip. A rota pública cresce883 bytes gzip no grafo ao receber a base nova; o core reduz3630 bytes gzip. Sem biblioteca de motion ou telemetria. Não é medição de FPS/LCP/INP/CLS, hardware ou rede de campo.

## Gate visual e limites

O navegador interno continua bloqueado ao criar seu processo seguro, HRESULT0x800700E1. As tentativas desta rodada não chegaram à página. Não houve screenshots/vídeos novos, seis viewports, reader, zoom nativo, hardware ou engines adicionais. **A retirada está implementada e validada por código/build, mas o aceite visual do novo reset/cascata permanece aberto.** Tests e auditoria do CSS não certificam aparência final. Skill UI Craft Loop exige render para declarar UI concluída; por isso este relatório não declara convergência visual ou release aprovado. Nenhuma evidência anterior foi reapresentada como nova.

O PR12 tem a mesma limitação de ambiente e mantém pendentes as evidências adiadas dos PR04–05/07. A autorização para implementar12–13 não dispensa esses gates. Voltar ao navegador interno3001 quando o ambiente permitir e conferir core, auth, landing, sheets longos/erro, foco/reduced nas seis dimensões do06 antes de aceitar visualmente estas unidades. Leitor e zoom reais exigem ensaio próprio.

Remanescentes com destino: composição pública e demos no PR14; retirada total de fontes/assets/normas antigas no PR15; master vetorial/licença e hardware nos gates já registrados. Fontes e evidências históricas não são lixo descartável. Nenhuma segunda paleta foi mantida no bundle para disfarçar consumidores pendentes.

## Rollback

Reverter PR13 com seus imports, layout, CSS, Tailwind e consumidores como unidade, sem alterar banco, auth ou dados. Não restaurar somente globals antigos sobre módulos novos; usar o estado íntegro anterior. PR12 possui commit separado302f851. Preservar arquivos do usuário e registros de autorização/evidência. **Parar antes14; implementação12–13 disponível para revisão, QA visual/reader/zoom não encerrado.**

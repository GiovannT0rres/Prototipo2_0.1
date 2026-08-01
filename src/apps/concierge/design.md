# Design System — Entrada Segura / Portaria (App Concierge)

> Documento oficial de referência para toda a interface do app de portaria.
> Escopo: `src/apps/concierge/`. Escrito a partir da auditoria das 16 telas
> existentes (`components/`), não de intenções.
>
> **Regra de ouro:** sempre que houver conflito entre estética e eficiência
> operacional, vence a eficiência. O melhor elogio possível é *"é impossível
> se perder — basta responder o que a tela pergunta."*

---

## 0. Os 10 princípios inegociáveis (a Constituição)

Estes 10 itens são **não-negociáveis**. Toda tela nova, todo PR, toda revisão
deve ser checada contra esta lista. Se uma tela viola qualquer um deles, ela
está errada — não o princípio.

| # | Princípio | Regra mensurável |
|---|---|---|
| **1** | **Uma única ação principal por tela** | Exatamente **um** botão primário (fundo `--es-navy` ou `--es-success`) visível por vez. Todo o resto é secundário, terciário ou navegação. |
| **2** | **Alvo de toque mínimo de 56 px** | Nenhum elemento tocável abaixo de `56px` de altura. Ação primária: `64px`. Nunca menor — o usuário tem ~60 anos, está em pé e usa uma mão. |
| **3** | **Tipografia nunca abaixo de 17 px** | `17px` é o piso absoluto para qualquer texto que o porteiro precise **ler**. Corpo padrão `19px`. Pergunta `28px`. Metadados decorativos não existem: se não pode ter 17px, não deve estar na tela. |
| **4** | **Máximo de 3 ações por tela** | Somando primária + secundárias + destrutivas. Voltar não conta. Se precisa de mais, a tela está fazendo trabalho de duas telas. |
| **5** | **Uma pergunta por tela** | Um dado coletado por vez, em linguagem de pergunta direta ("Qual o **DESTINO**?"). Nunca formulários com múltiplos campos empilhados. |
| **6** | **Contraste mínimo 7:1 (WCAG AAA) para texto** | Operação sob luz solar direta. `4.5:1` (AA) é **insuficiente** aqui e está proibido para texto de conteúdo. Ícones e bordas: mínimo `3:1`. |
| **7** | **Zero confirmações para ações reversíveis** | Confirmação (modal) existe **somente** para o que não se desfaz: recusar autorização, cancelar atendimento. Dar entrada/saída nunca pede confirmação — é reversível com um toque. |
| **8** | **A cor nunca é o único portador de significado** | Todo estado (sucesso/erro/alerta) carrega **ícone + texto** junto da cor. Daltonismo + reflexo de sol tornam a cor sozinha inutilizável. |
| **9** | **Ação primária sempre na zona do polegar** | Bloco de ação ancorado no **rodapé fixo**, nos últimos 25% inferiores da tela. Nunca exigir scroll para alcançar a ação principal. |
| **10** | **Nenhum estado sem saída visível** | Toda tela tem sempre um caminho de volta e um caminho adiante evidentes. Não existe beco sem saída, nem tela cuja próxima ação exija interpretação. |

---

## 1. Princípios de UX

### 1.1 Velocidade acima de tudo
O porteiro atende fila. A métrica que importa não é "cliques por tarefa"
isoladamente, mas **tempo até a liberação**. Um clique a mais numa tela óbvia
é mais rápido que zero cliques numa tela ambígua — porque a ambiguidade custa
segundos de leitura e, pior, custa erro.

**Implicação:** prefira telas ultra-simples em sequência a uma tela densa.
O wizard atual (`PortariaWizard.tsx`) já acerta nisso e deve ser mantido como
padrão arquitetural.

### 1.2 Fluxo guiado, não navegação
O operador **nunca navega por menus**. O sistema pergunta, ele responde, o
sistema conduz. Referências: Waze (uma instrução por vez), Wise (um dado por
tela), Apple Setup Assistant.

Consequência dura: **o app de portaria não tem menu**. Tem um ponto de
entrada (busca de CPF) e um fluxo. Tudo o mais é consequência.

### 1.3 Redução de erros por design, não por validação
Impedir é melhor que avisar. Avisar é melhor que corrigir.

- Botão desabilitado até o dado ser válido (já feito em `CampoBuscaComOk`)
- Chips de sugestão que **preenchem** mas não **confirmam** (padrão correto já
  existente em `PerguntaDestino`/`PerguntaAutorizador` — manter, é excelente)
- Formatação automática de máscara (CPF, telefone, placa) — já feito

### 1.4 Reconhecimento, não memorização
O porteiro nunca deve lembrar de um código, sigla ou nome exato. Tudo é
seleção visual, busca com sugestão, ou recentes. O sistema de "usados
recentemente" (`utils/recentSelections.ts`) é a aplicação correta deste
princípio e deve ser estendido a todo campo de escolha.

### 1.5 Feedback imediato e inequívoco
Toda ação tem resposta em **menos de 100 ms** (estado visual local) e
confirmação clara em até 1 s. O padrão "Dar Entrada → Liberado (transitório)
→ Saída" de `PerfilPessoa.tsx` é exemplar: mostra que a ação funcionou antes
de mudar o significado do botão.

---

## 2. Conceitos de navegação

### 2.1 Modelo mental: CADASTRO → AUTORIZAÇÃO → LIBERAÇÃO
Três fases, nunca misturadas na mesma tela. Cada tela pertence a exatamente
uma fase, e o cabeçalho declara qual:

| Fase | Pergunta que responde | Telas | Rótulo no header |
|---|---|---|---|
| **CADASTRO** | Quem é a pessoa? | CPF, Validação, WhatsApp, Placa | `Cadastro` |
| **AUTORIZAÇÃO** | O que pode fazer, onde, até quando? | Motivo, Empresa, Destino, Autorizador, Período, Observações | `Autorização` |
| **LIBERAÇÃO** | Está entrando/saindo agora? | Perfil, Dar Entrada/Saída, Quem está no clube | `Liberação` |

**Ao criar qualquer tela nova, a primeira pergunta é: isto é CADASTRO,
AUTORIZAÇÃO ou LIBERAÇÃO?** Erro já cometido no passado: Destino e
Autorizador viviam dentro da tela de Motivo.

### 2.2 Arquitetura de fluxo: pilha linear, não árvore
Um `Step` por vez, com histórico linear. Voltar sempre volta **uma pergunta**,
nunca reinicia. (`ValidacaoNovoUser` já trata isso corretamente com
`etapaInicial` — voltar do WhatsApp cai na pergunta 2, não na 1.)

### 2.3 Os dois caminhos
```
                    ┌─ CPF conhecido ──→ Selfie → Placa → PERFIL ─→ [Dar Entrada]
  Busca de CPF ─────┤                                        └─→ [Nova Autorização] ─┐
                    └─ CPF novo ──→ Validação → WhatsApp → Placa → Motivo ──────────→ Destino
                                                                                → Autorizador
                                                                                → Período
                                                                                → Observações
                                                                                → SUCESSO
```

**Regra:** o caminho do CPF conhecido é o caminho de 90% dos atendimentos e
deve ser sempre o mais curto. Otimize-o primeiro.

### 2.4 Indicador de progresso
Obrigatório em todo fluxo com mais de 2 telas (`ProgressoAtendimento.tsx`).
Máximo de **3 etapas nomeadas** — mais que isso vira ruído e assusta. Etapas
com nomes de substantivo curto ("Pessoa", "Veículo", "Autorização"), nunca
verbos ou frases.

---

## 3. Personalidade da interface

| É | Não é |
|---|---|
| Corporativo, sóbrio | Lúdico, colorido, arredondado demais |
| Tecnológico, preciso | Futurista, com gradientes e glow |
| Confiável, institucional | Rede social, com avatares grandes e curtidas |
| Limpo, muito espaço em branco | ERP denso, com tabelas e menus laterais |
| Grande, legível, direto | Elegante-e-pequeno, delicado |

**Tom de voz:** direto, na segunda pessoa implícita, sempre em forma de
pergunta ou instrução. Nunca jargão técnico ("autenticação falhou"), sempre
consequência prática ("Este CPF não confere. Chame o supervisor.").

---

## 4. Paleta de cores

### 4.1 Fundamento técnico
A operação acontece **sob luz solar direta**, em tela de smartphone,
frequentemente com reflexo. Isso muda tudo:

- **Luminância ambiente** de até 100.000 lux contra os ~600 nits de um
  smartphone comum → o contraste efetivo percebido cai drasticamente.
- Por isso o requisito **7:1 (WCAG AAA)**, não 4.5:1. Um par que passa AA em
  ambiente interno **falha na prática** no sol.
- **Fundo claro vence fundo escuro** em ambiente externo: telas escuras viram
  espelho sob sol. Portanto **o app é light-mode-first**, e dark mode é
  explicitamente **não suportado** nesta aplicação.
- Usuários acima de 60 anos têm **amarelecimento do cristalino**, que reduz a
  discriminação na faixa azul-violeta. Por isso o azul institucional só é
  usado em **áreas grandes e texto grande**, nunca em texto fino de 12px.

### 4.2 Tokens

```css
:root {
  /* ---------- MARCA ---------- */
  --es-navy:          #0F2744;  /* Azul institucional Entrada Segura */
  --es-navy-press:    #0A1B30;  /* Estado pressionado */
  --es-navy-soft:     #E8EDF4;  /* Fundo de destaque suave */

  /* ---------- SEMÂNTICAS (ação) ---------- */
  --es-success:       #0B7A3B;  /* Liberar / Entrada. Verde escurecido p/ 7:1 */
  --es-success-soft:  #E3F5EA;
  --es-danger:        #B3261E;  /* Recusar / Saída / Bloqueio */
  --es-danger-soft:   #FCEAE8;
  --es-warning:       #8A5000;  /* Atenção / pendência */
  --es-warning-soft:  #FFF4E0;
  --es-info:          #0F2744;  /* = navy, informação é institucional */

  /* ---------- NEUTROS ---------- */
  --es-ink:           #101828;  /* Texto principal — 16.1:1 sobre branco */
  --es-ink-2:         #344054;  /* Texto secundário — 9.7:1 ✓ AAA */
  --es-ink-3:         #475467;  /* Piso do texto legível — 7.5:1 ✓ AAA */
  --es-border:        #D0D5DD;  /* Bordas — 3:1 mínimo p/ não-texto */
  --es-border-strong: #98A2B3;  /* Borda de campo (precisa ser vista no sol) */
  --es-surface:       #FFFFFF;
  --es-bg:            #F2F4F7;  /* Fundo da aplicação */
}
```

### 4.3 Contraste verificado (sobre `--es-surface` #FFFFFF)

| Token | Ratio | WCAG | Uso permitido |
|---|---|---|---|
| `--es-ink` #101828 | **16.1:1** | AAA | Texto principal, perguntas |
| `--es-ink-2` #344054 | **9.7:1** | AAA | Texto secundário, labels |
| `--es-ink-3` #475467 | **7.5:1** | AAA | **Piso** — nada mais claro para texto |
| `--es-navy` #0F2744 | **14.8:1** | AAA | Texto de marca, fundo de botão primário |
| `--es-success` #0B7A3B | **5.9:1** | AA+ | **Só** em texto ≥19px bold, ou como fundo com texto branco |
| `--es-danger` #B3261E | **7.2:1** | AAA | Texto de erro, fundo de botão destrutivo |
| `--es-warning` #8A5000 | **7.6:1** | AAA | Texto de alerta |

> **Proibido:** qualquer cinza mais claro que `--es-ink-3` (#475467) para
> texto. Isso elimina `text-gray-400` e `text-gray-300` do código atual, que
> hoje aparecem em metadados de `PerfilPessoa.tsx` e `HomeBusca.tsx` e são
> **ilegíveis no sol** (`#9CA3AF` = 2.8:1 — falha até AA).

### 4.4 Uso do branco sobre cor

| Fundo | Texto branco | Ratio | Status |
|---|---|---|---|
| `--es-navy` #0F2744 | #FFFFFF | 14.8:1 | ✓ AAA |
| `--es-success` #0B7A3B | #FFFFFF | 5.9:1 | ✓ AA (só ≥19px bold) |
| `--es-danger` #B3261E | #FFFFFF | 7.2:1 | ✓ AAA |

---

## 5. Tipografia

### 5.1 Escolha da fonte: **Inter**

**Recomendação: `Inter` (Google Fonts), com fallback `-apple-system, Segoe UI, Roboto`.**

Justificativa técnica, avaliando especificamente o perfil "60+, óculos, sol,
tela pequena, leitura rápida":

1. **Altura-x elevada.** Inter tem uma das maiores razões altura-x/altura-de-
   caixa entre as sans humanistas (~0.727). Altura-x grande é o fator
   isolado mais correlacionado com legibilidade em corpo pequeno e em baixa
   acuidade visual — o olho identifica a palavra pelo miolo das minúsculas,
   não pelas ascendentes.

2. **Desambiguação de caracteres.** Inter oferece a variante estilística
   `ss02`/`cv05` com **l com cauda** e **1 com base**, e mantém `I`/`l`/`1` e
   `O`/`0` distinguíveis. Isso é **crítico** aqui: o app lida com **CPF,
   placa de veículo e telefone** — campos onde confundir `0`/`O` ou `1`/`l`
   causa erro operacional real, não estético.

3. **Aberturas amplas (apertures).** Os terminais de `c`, `e`, `s`, `a` são
   abertos, o que impede que essas letras "fechem" e virem manchas sob baixo
   contraste ou desfoque — exatamente o que acontece com presbiopia e com
   reflexo solar.

4. **Fonte variável, com eixo óptico.** Permite ajustar peso com precisão sem
   carregar múltiplos arquivos, e o `font-optical-sizing` melhora o
   espaçamento em corpos grandes.

5. **Desenhada para telas.** Inter foi projetada para UI em pixel, não
   adaptada de tipo impresso — diferente de fontes como Lato ou Open Sans.

**Por que não as alternativas:**
- *Roboto*: formas mais condensadas e apertadas; `I`/`l` idênticos. Pior para
  placas e CPF.
- *Open Sans / Lato*: altura-x menor, aberturas mais fechadas.
- *Segoe UI (Windows)*: boa, mas indisponível em Android — e a operação é
  **exclusivamente mobile**, majoritariamente Android. Serve só como fallback.
- *Atkinson Hyperlegible*: excelente em desambiguação e uma alternativa
  legítima, mas com personalidade menos corporativa e família de pesos mais
  restrita. **Considerar se testes de campo com os porteiros indicarem
  dificuldade persistente de leitura.**

```css
--es-font: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
font-feature-settings: 'ss02' 1, 'cv05' 1; /* l com cauda, 1 com base */
font-variant-numeric: tabular-nums;        /* CPF/placa/hora alinhados */
```

### 5.2 Escala tipográfica

Escala **1.25 (terça maior)** a partir de `19px`. Deliberadamente grande —
esta é uma escala de acessibilidade, não uma escala de marketing.

| Token | Tamanho | Peso | Line-height | Tracking | Uso |
|---|---|---|---|---|---|
| `display` | **36px** | 700 | 1.15 | -0.02em | Nome na confirmação de identidade |
| `question` | **28px** | 600 | 1.25 | -0.01em | A pergunta da tela — *o* elemento |
| `title` | **23px** | 600 | 1.3 | -0.01em | Título de seção, nome da pessoa |
| `body-lg` | **21px** | 500 | 1.5 | 0 | Valor de dado importante (CPF, destino) |
| `body` | **19px** | 400/500 | 1.55 | 0 | **Padrão.** Texto corrido, opções de lista |
| `label` | **17px** | 600 | 1.4 | 0.01em | Rótulo de campo, metadado. **Piso absoluto** |
| `button` | **21px** | 600 | 1 | 0.01em | Texto de botão primário |

**Regras rígidas:**
- **Nada abaixo de 17px.** Se um dado não merece 17px, ele não merece a tela.
  Isso elimina os `text-[10px]`, `text-[11px]`, `text-[12px]` e `text-[13px]`
  hoje espalhados por `HomeBusca`, `PerfilPessoa`, `ProgressoAtendimento`.
- **Máximo 2 pesos por tela** (ex.: 600 + 400). Mais que isso vira hierarquia
  confusa.
- **Nunca `font-weight: 300` ou menor.** Traço fino desaparece no sol.
- **Line-height mínimo 1.5** para texto corrido — leitores com presbiopia
  dependem de linhas bem separadas para não pular de linha.
- **Nunca CAPS em frases.** Apenas em uma ou duas palavras de ênfase dentro da
  pergunta (padrão atual `Qual o **DESTINO**?` está correto) e em labels
  curtos. CAPS em frase inteira destrói o contorno da palavra e derruba a
  velocidade de leitura em ~15%.

---

## 6. Espaçamentos e grid

### 6.1 Base 4, escala 8
```
--es-space-1:  4px    --es-space-5: 24px
--es-space-2:  8px    --es-space-6: 32px
--es-space-3: 12px    --es-space-7: 40px
--es-space-4: 16px    --es-space-8: 56px
```

### 6.2 Grid e margens
- **Coluna única.** Sempre. Não há grid multi-coluna neste app — colunas
  exigem varredura ocular em duas direções, o que é lento e propenso a erro.
- **Margem lateral: `24px`** (`--es-space-5`). Confortável para o polegar sem
  desperdiçar largura em telas de 360px.
- **Largura máxima de conteúdo: `520px`**, centralizado (o container atual de
  `480px` em `PortariaWizard.tsx` está bom — ampliar ligeiramente para
  acomodar a tipografia maior).
- **Espaço entre blocos: `32px`.** Entre itens de uma lista: `12px`.
- **Respiro obrigatório acima da ação primária: `32px` mínimo.** Impede toque
  acidental vindo do conteúdo acima.

### 6.3 Anatomia vertical padrão de tela

```
┌─────────────────────────────┐
│  HEADER (fixo, 64px)        │  ← Voltar + fase (Cadastro/Autorização)
├─────────────────────────────┤
│  PROGRESSO (opcional, 72px) │  ← Só em fluxo de 3+ telas
├─────────────────────────────┤
│                             │
│  PERGUNTA (28px)            │  ← 32px de margem superior
│                             │
│  CONTEÚDO / OPÇÕES          │  ← Área rolável
│                             │
│         (flex-grow)         │
│                             │
├─────────────────────────────┤
│  AÇÃO PRIMÁRIA (fixa)       │  ← 64px alt. + 24px padding + safe-area
└─────────────────────────────┘
```

**A ação primária é `position: sticky` no rodapé**, sempre visível, nunca
dependente de scroll. Isso corrige uma falha do código atual, onde o botão
"Continuar" de `PerguntaPeriodo.tsx` e `PerguntaObservacoes.tsx` fica no fluxo
do conteúdo e pode sair da tela quando o teclado virtual abre.

Respeitar `env(safe-area-inset-bottom)` para não colidir com a barra de gestos
do iOS/Android.

---

## 7. Componentes

### 7.1 Botões

| Variante | Altura | Fundo | Texto | Uso |
|---|---|---|---|---|
| **Primário** | **64px** | `--es-navy` | Branco 21/600 | A ação da tela. Um por tela. |
| **Sucesso** | **64px** | `--es-success` | Branco 21/600 | Liberar entrada. Ação afirmativa final. |
| **Destrutivo** | **64px** | `--es-danger` | Branco 21/600 | Recusar, cancelar. Só após confirmação. |
| **Secundário** | **56px** | `--es-surface` + borda 2px `--es-border-strong` | `--es-ink` 19/600 | Alternativa legítima ("Não") |
| **Terciário** | **56px** | transparente | `--es-ink-2` 19/600 | "Pular", "Sem veículo" |
| **Ícone** | **56×56px** | transparente | `--es-ink-2` | Voltar, atualizar. **Sempre com `aria-label`.** |

**Regras:**
- `border-radius: 14px` (retangular o bastante para parecer corporativo,
  arredondado o bastante para parecer moderno). Botões nunca `rounded-full`
  exceto chips.
- **Largura total** para a ação primária. Alvo máximo, zero ambiguidade.
- **Ícone à esquerda do texto**, 24px, sempre acompanhado de rótulo textual.
  Nunca botão só-ícone para ação de consequência.
- **Estado desabilitado:** opacidade `0.45` + `cursor: not-allowed`. Manter
  visível (não esconder) para que a próxima ação continue previsível — o
  usuário precisa ver que o botão existe e entender que falta preencher algo.
- **Feedback de toque:** `transform: scale(0.98)` + escurecimento em `:active`,
  em ≤100ms. Sem isso, o operador toca duas vezes.
- **Nunca dois botões primários lado a lado.** A exceção única e justificada é
  o par binário Sim/Não da confirmação de identidade (`ConfirmacaoSelfie`),
  onde as duas opções são simétricas em legitimidade — e mesmo aí o "Sim" usa
  `--es-success` e o "Não" usa secundário, não dois primários.

### 7.2 Campos de entrada

- **Altura mínima: 64px.** Padding `20px` horizontal.
- **Borda 2px `--es-border-strong`** — bordas de 1px em cinza claro somem no
  sol. Ao focar: 2px `--es-navy` + halo `0 0 0 4px rgba(15,39,68,0.12)`.
- **Texto digitado: 21px, peso 600.** O porteiro precisa conferir o que digitou
  à distância de braço.
- **Label sempre acima e sempre visível.** **Placeholder nunca substitui
  label** — placeholder some ao digitar, e o usuário perde o contexto do que
  está preenchendo. Erro clássico de acessibilidade.
- **Teclado correto por tipo:**
  - CPF, telefone: `inputMode="numeric"` (já feito em `PerguntaWhatsapp`)
  - Placa: `inputMode="text"` + `autocapitalize="characters"` (já feito)
  - Observações: `inputMode="text"` + `enterkeyhint="done"`
- **Máscara automática** aplicada durante a digitação, nunca validação
  posterior. Já implementado corretamente para CPF e telefone.
- **`font-variant-numeric: tabular-nums`** em todo campo numérico, para que os
  dígitos não "dancem" enquanto a máscara é aplicada.

### 7.3 Listas de opção (o padrão dominante deste app)

Toda escolha entre 2–6 alternativas usa **cartões de opção verticais em
largura total**:

- Altura mínima **72px**, padding `20px`
- Ícone circular 48px à esquerda (opcional, ajuda reconhecimento pré-textual)
- Rótulo 21px/600 `--es-ink`
- Chevron à direita indicando avanço
- Borda 2px `--es-border`; ao tocar, borda `--es-navy` + fundo `--es-navy-soft`
- **Toque em qualquer ponto do cartão seleciona** — a área tocável é o cartão
  inteiro, nunca só o texto

**Acima de 6 opções**, mudar para o padrão de **busca + chips de sugestão**
(`CampoBuscaComOk` + `SugestaoChip`), já implementado corretamente em
`PerguntaDestino` e `PerguntaAutorizador`.

> **Destaque de acerto do código atual:** o chip **preenche** o campo mas não
> **confirma** — só a seta confirma. Isso previne confirmação acidental por
> toque impreciso, que é o erro mais comum de dedo grande em tela pequena.
> **Manter este comportamento e replicá-lo em qualquer novo campo de busca.**

### 7.4 Cartões de pessoa

Usado em "Quem está no clube" e nas autorizações do perfil.

- Foto 64px circular (identificação visual é o dado mais rápido de processar)
- Nome 21px/600
- CPF mascarado 19px, `tabular-nums`, `--es-ink-3`
- Hora de entrada 17px com ícone de relógio
- Ação (Registrar Saída) como botão de 56px, largura total no mobile

### 7.5 Chips

- Altura **44px**, `border-radius: 22px`, padding horizontal `18px`
- Texto 17px/600
- Não-selecionado: fundo branco, borda 1.5px `--es-border-strong`
- Selecionado: fundo `--es-navy`, texto branco
- Usados para: atalhos de preenchimento, presets de período, sugestões
- **Chip nunca é a ação final** — sempre preenche algo que ainda será
  confirmado

### 7.6 Barra superior (header)

- Altura **64px**, fundo `--es-surface`, borda inferior 1px
- **Esquerda:** botão Voltar (56×56, ícone 24px) — sempre presente exceto na
  Home
- **Centro:** rótulo da fase (`Cadastro` / `Autorização` / `Liberação`), 19px/600
- **Direita:** vazio por padrão. Nada de ações escondidas em menu "…"
- **Sem logotipo dentro do fluxo** — o logo pertence à Home e à tela de login.
  Dentro do atendimento ele é ruído que rouba espaço vertical.

### 7.7 Indicador de progresso

- Máximo **3 etapas**
- Círculo 40px, número 19px/700 (o código atual usa 36px/13px — pequeno demais)
- Concluída: fundo `--es-success` + ícone de check
- Ativa: fundo branco, borda 3px `--es-navy`, texto `--es-navy`
- Futura: fundo `#EAECF0`, texto `--es-ink-3`
- Rótulo abaixo, 17px/600
- Conector: linha 3px

### 7.8 Mensagens e alertas (toasts)

- Posição **topo-centro** (já correto), pois o rodapé é ocupado pela ação e o
  polegar pode cobrir o inferior da tela
- Altura mínima **72px**, texto **19px/600**
- **Ícone + cor + texto** sempre juntos (Princípio 8)
- Duração: sucesso 3s, erro **8s** (erro exige leitura e decisão; não pode
  sumir antes de ser lido)
- Erro exige toque para dispensar — nunca desaparece sozinho
- **Um único ponto de montagem do `<Toaster>` por fluxo visível**, no
  componente pai persistente. Montar em step condicional faz o toast não
  aparecer — bug já ocorrido em `PortariaWizard.tsx`

### 7.9 Modais de confirmação

Reservados a ações irreversíveis (Princípio 7).

- **Bottom sheet**, não modal centralizado — nasce na zona do polegar
- Ícone 64px no topo, título 28px/700, corpo 19px
- Botões empilhados verticalmente, 64px cada, **destrutivo em cima,
  cancelar embaixo**
- **O rótulo do botão descreve a ação, nunca "OK"/"Sim".** "Sim, recusar" está
  correto; "OK" está proibido
- Toque fora fecha (equivale a cancelar)

### 7.10 Ícones

- **Biblioteca: Lucide** (já em uso). Traço consistente, geometria aberta.
- **Tamanho: 24px** padrão, 28px em botão primário, 20px é o mínimo absoluto.
  O código atual usa 12–16px em vários pontos — muito pequeno.
- **`stroke-width: 2.25`** — o padrão 2 desaparece sob luz solar.
- **Ícone nunca sozinho** quando representa ação de consequência. Voltar e
  atualizar são as únicas exceções aceitas (convenção universal), e mesmo
  assim exigem `aria-label`.
- **Vocabulário fixo** — o mesmo conceito usa sempre o mesmo ícone:

| Conceito | Ícone |
|---|---|
| Entrada / liberar | `CheckCircle2` |
| Saída | `LogOut` |
| Buscar | `Search` |
| Pessoa | `User` |
| Visitante | `Ticket` |
| Prestador | `Briefcase` |
| Destino | `MapPin` |
| Autorizador | `UserCheck` |
| Período | `Calendar` |
| Veículo | `Car` |
| Recusar / bloquear | `Ban` |
| Alerta | `AlertTriangle` |
| Histórico | `History` |

---

## 8. Estados dos componentes

Todo componente interativo define **seis** estados. A ausência de qualquer um
é um bug de design.

| Estado | Tratamento |
|---|---|
| **Default** | Repouso. Borda e contraste plenos. |
| **Hover** | Irrelevante em mobile — nunca a única indicação de nada. |
| **Focus** | Halo 4px `rgba(15,39,68,0.12)` + borda `--es-navy`. **Nunca `outline: none` sem substituto.** |
| **Active/Press** | `scale(0.98)` + fundo escurecido, ≤100ms. |
| **Disabled** | Opacidade 0.45, `cursor: not-allowed`, visível. |
| **Loading** | Texto muda para gerúndio ("Salvando…") + spinner. Botão bloqueado contra duplo toque. |

**Estados vazios** (lista sem itens) sempre trazem: ícone, o que aconteceu, e
**o que fazer a seguir**. `HomeBusca` já faz isso corretamente e distingue
"ninguém no clube" de "nada encontrado na busca" — padrão a ser replicado.

---

## 9. Hierarquia visual

Ordem de leitura desenhada, em toda tela:

1. **Pergunta** (28px, escuro) — o que o sistema quer saber
2. **Opções / campo** — como responder
3. **Ação primária** (rodapé, cor sólida, 64px) — como avançar
4. **Auxiliares** (17px, `--es-ink-3`) — contexto opcional

Ferramentas de hierarquia, em ordem de força: **tamanho > peso > posição >
cor**. Cor é a mais fraca (Princípio 8) e nunca deve carregar hierarquia
sozinha.

**Regra de densidade:** no máximo **7 elementos visuais distintos** por tela.
Cada elemento adicional custa tempo de varredura. Se a contagem passa de 7,
divida a tela.

---

## 10. Regras de acessibilidade

- **Contraste 7:1** para texto (AAA), 3:1 para elementos gráficos
- **Alvo de toque 56px mínimo** — excede o mínimo WCAG 2.2 (24px) e a
  recomendação Apple (44pt) e Material (48dp), justificado pelo perfil de idade
  e pela operação em pé, sob pressão e com uma mão
- **Espaçamento mínimo de 12px entre alvos tocáveis** — previne toque errado
- **Todo campo tem `<label>` associado**, nunca só placeholder
- **Todo botão de ícone tem `aria-label`**
- **Foco visível sempre** — nunca remover outline sem substituto de contraste
  equivalente
- **Suporte a zoom de texto até 200%** sem quebra de layout — usar `rem` para
  tipografia, nunca `px` fixo em contêiner de texto
- **`prefers-reduced-motion`**: desativar transições de slide; manter apenas
  fades de ≤150ms. As animações de `motion/react` atualmente não respeitam
  essa preferência — corrigir
- **Nenhuma informação exclusivamente por cor, som ou animação**
- **Ordem de foco de teclado segue a ordem visual**
- **Idioma declarado** (`lang="pt-BR"`) para leitores de tela

---

## 11. Recomendações para operação em ambiente externo

1. **Light mode obrigatório, dark mode não suportado.** Tela escura sob sol
   direto vira espelho. Fundo claro maximiza a luminância útil.
2. **Contraste AAA** como piso, não como meta (§4.1).
3. **Áreas de cor sólida e grandes**, não gradientes nem transparências —
   ambos colapsam sob reflexo.
4. **Sem sombras sutis para transmitir informação.** Sombra pode decorar,
   nunca separar. A separação estrutural é feita por **borda** e **espaço**.
5. **Sem texto sobre imagem ou foto.**
6. **Operação com uma mão:** toda ação essencial nos 25% inferiores da tela.
7. **Tolerância a rede instável:** o porteiro sai da guarita. Toda ação de
   liberação deve ter feedback local otimista e reconciliação posterior —
   nunca uma tela travada em spinner esperando servidor.
8. **Sem hover como fonte de informação** — não existe cursor.

---

## 12. Recomendações para baixa familiaridade tecnológica

1. **Zero gestos ocultos.** Sem swipe para excluir, sem long-press, sem
   pull-to-refresh como única via. Toda ação tem botão visível. (O botão
   explícito de atualizar em `HomeBusca` está correto.)
2. **Sem menus hambúrguer, abas ou navegação hierárquica.** Um fluxo linear.
3. **Rótulos descrevem consequência**, não função: "Dar Entrada" (bom), não
   "Confirmar" (ruim); "Sim, recusar" (bom), não "OK" (ruim).
4. **Nada de ícones sozinhos** para ações de consequência.
5. **Nunca dois caminhos para a mesma coisa** — escolha reduz velocidade e
   aumenta insegurança.
6. **Erro nunca culpa o usuário** e sempre diz o próximo passo: "Este CPF não
   confere. Chame o supervisor." em vez de "Falha na validação".
7. **Nada de tempo limite invisível.** Se a sessão expira, avise antes.
8. **Toda tela é auto-explicativa fora de contexto** — o porteiro é
   interrompido o tempo todo; ao voltar ao telefone, a tela precisa dizer
   sozinha o que ela quer.

---

## 13. Recomendações para usuários acima de 60 anos

Fundamento: presbiopia (perda de acomodação para perto), redução da
sensibilidade ao contraste, amarelecimento do cristalino, e queda da precisão
motora fina.

1. **Tipografia grande é o item mais impactante** — 19px de corpo, 17px de
   piso (§5.2).
2. **Line-height ≥1.5** — reduz o "pulo de linha", erro comum com presbiopia.
3. **Evitar azul-violeta em texto pequeno** — o cristalino amarelado filtra
   essa faixa. Azul institucional só em área grande ou texto grande.
4. **Alvos generosos e bem espaçados** — compensa tremor e imprecisão motora.
5. **Sem timeouts curtos.** Tempo de reação é maior; nada deve sumir em menos
   de 5 segundos.
6. **Animações lentas e simples** (200–300ms). Transições rápidas ou
   paralaxe causam desorientação.
7. **Consistência absoluta de posição.** Botão primário sempre no mesmo lugar,
   em todas as telas. Memória motora compensa memória de trabalho.
8. **Confirmação visual explícita após cada ação.** O padrão transitório
   "Liberado" de `PerfilPessoa.tsx` é exatamente isso e deve ser o padrão.

---

## 14. Auditoria das telas atuais

### 14.1 `HomeBusca.tsx` — Busca de CPF + Quem está no clube

**Problemas de UX**
- A tela faz **duas coisas** ao mesmo tempo: iniciar atendimento e consultar
  quem está no clube. Viola o Princípio 1. Com uma fila esperando, os dois
  blocos competem visualmente.
- **Dois campos de busca simultâneos** (CPF principal e filtro da lista). Alto
  risco de digitar no campo errado — e o erro é silencioso.
- Botão "Buscar" desabilitado até 14 caracteres, mas **sem dizer por quê**.
- A dica de CPFs de teste é conteúdo de protótipo exposto ao usuário final.

**Problemas de UI**
- `text-[10px]`, `text-[11px]`, `text-[12px]`, `text-[13px]` — abaixo do piso
  de 17px (Princípio 3).
- `text-gray-400` (#9CA3AF) = **2.8:1**, falha até WCAG AA. Ilegível no sol.
- Botão de atualizar: `p-2.5` ≈ 36px de alvo — muito abaixo dos 56px.
- Avatar de 48px e ícones de 12–16px são pequenos demais.

**Proposta**
1. **Separar em duas telas.** A Home é **só** a busca de CPF: campo enorme,
   teclado numérico já aberto, botão de 64px. "Quem está no clube" vira um
   botão secundário grande no rodapé, com contador — e uma tela própria.
   *Motivo:* uma ação principal por tela; iniciar atendimento é o caminho
   quente e deve ficar sozinho.
2. **Teclado numérico dedicado na tela**, opcional. Um teclado grande na
   própria interface elimina a dependência do teclado do sistema, que varia
   entre aparelhos e costuma ter teclas pequenas.
   *Motivo:* CPF é o dado mais digitado da operação; otimizá-lo tem o maior
   retorno de todo o app.
3. **Avanço automático ao completar 11 dígitos**, sem exigir toque no botão.
   Mantém o botão visível como rede de segurança.
   *Motivo:* elimina um toque no caminho mais frequente.
4. Elevar toda tipografia ao mínimo de 17px e trocar `gray-400` por
   `--es-ink-3`.
5. Remover a dica de CPFs de teste do build de produção.

### 14.2 `ValidacaoNovoUser.tsx` — Quiz de identidade

**Problemas de UX**
- **Falha grave:** o botão "Nenhuma das Alternativas" tem tratamento de
  **ação primária** (azul, largura total, rodapé fixo). Pela hierarquia visual,
  ele parece ser o caminho normal — quando na verdade é a saída de exceção que
  **cancela o atendimento**. Um porteiro apressado tocará nele por hábito
  posicional, abortando um cadastro válido.
- Resposta errada **cancela o processo inteiro** sem chance de correção. Não
  há tolerância a toque acidental numa ação irreversível — viola o Princípio 7
  ao contrário: uma ação destrutiva sem confirmação nenhuma.
- O selo "Correta" é dica de protótipo visível ao usuário.

**Problemas de UI**
- Opções sem ícone e com peso visual idêntico entre si e ao botão de exceção.
- `text-[10px]` no selo, `text-[14px]` no rótulo de etapa.

**Proposta**
1. **Rebaixar "Nenhuma das Alternativas" para terciário** — texto simples,
   sem fundo, separado por divisória, abaixo das opções. **Esta é a correção
   mais importante de toda a auditoria.**
   *Motivo:* a hierarquia visual deve refletir a hierarquia de intenção. Ação
   de exceção nunca pode parecer ação padrão.
2. **Confirmação antes de cancelar:** ao tocar em "Nenhuma", abrir bottom
   sheet — "Nenhum destes nomes confere? Isso encerra o atendimento."
   *Motivo:* Princípio 7 — a ação é irreversível.
3. Opções em cartões de 72px, 21px/600.
4. Remover o selo "Correta" em produção.

### 14.3 `ConfirmacaoSelfie.tsx` — Verificação visual

**Acertos** — a melhor tela do app hoje. Uma pergunta, foto grande, duas
respostas simétricas, zero ruído.

**Problemas**
- **Fundo escuro** (`#0F2744` em tela cheia): vira espelho sob luz solar
  direta. Viola a diretriz de ambiente externo (§11.1).
- `text-gray-400` sobre o navy = contraste insuficiente para o CPF.
- Botões de 4rem estão bons, mas "Não" com `bg-white/10` tem contraste fraco.

**Proposta**
1. **Inverter para fundo claro**, com a foto como elemento de destaque.
   *Motivo:* legibilidade sob sol supera o impacto estético do fundo escuro.
2. CPF em `--es-ink-2`, 21px, `tabular-nums`.
3. "Não" como secundário com borda 2px sólida; "Sim" em `--es-success`.
   *Motivo:* mantém a simetria de legitimidade sem dois primários.

### 14.4 `PerguntaMotivo` / `PerguntaWhatsapp` / `PerguntaPlaca`

**Acertos** — o padrão "uma pergunta por tela" está correto. Os chips de
atalho ("DDD 51", "Sem veículo") são excelentes: economizam digitação sem
esconder a opção.

**Problemas**
- Botões de opção em 72px de altura estão no limite; texto em 15–16px está
  abaixo do piso.
- `PerguntaPlaca`: o rótulo do botão primário muda entre "Confirmar" e
  "Continuar sem Placa" **e** existe um chip "Sem veículo" que faz a mesma
  coisa. **Dois caminhos para o mesmo resultado** — viola §12.5.
- Botão de continuar no fluxo do conteúdo, não fixo no rodapé: sai da tela
  quando o teclado abre.

**Proposta**
1. Elevar tipografia (opções 21px, botão 21px) e altura de opção para 80px.
2. `PerguntaPlaca`: manter **apenas** o chip "Sem veículo" como via de escape e
   deixar o botão primário sempre rotulado "Confirmar", desabilitado até haver
   placa.
   *Motivo:* um caminho por resultado; rótulo estável constrói memória motora.
3. Fixar o botão primário no rodapé com `position: sticky`.

### 14.5 `PerguntaDestino` / `PerguntaAutorizador` — Busca + chips

**Acertos** — o melhor padrão de interação do código atual. Recentes primeiro,
chip preenche mas não confirma, seta só desbloqueia com correspondência exata.
**Preservar integralmente.**

**Problemas**
- A seta de confirmar (`CampoBuscaComOk`) tem 36px de alvo — abaixo de 56px.
- Ela é a **ação primária disfarçada de detalhe**: um chevron cinza de 22px
  dentro do campo. O usuário não a reconhece como "o botão de avançar".
- Chips de nomes longos ("Clube Inteiro (Convidado Patrocinado)") quebram o
  ritmo visual da grade.
- Nenhum feedback quando o texto digitado não corresponde a nada — a seta
  simplesmente não acende, sem explicar.

**Proposta**
1. **Substituir a seta embutida por um botão primário fixo no rodapé**
   ("Confirmar destino"), desabilitado até haver correspondência, exibindo o
   valor escolhido.
   *Motivo:* Princípio 9 — a ação principal pertence à zona do polegar e deve
   ter tratamento de ação principal, não de ornamento dentro do campo.
2. **Chips viram lista vertical** quando há mais de 6 resultados, com rótulo
   completo em 19px.
   *Motivo:* lista vertical é varredura em um eixo; grade de chips é em dois.
3. Quando não há correspondência, mensagem explícita de 19px logo abaixo do
   campo.
4. Encurtar rótulos: "Clube Inteiro" com "Convidado patrocinado" como linha
   secundária dentro do item.

### 14.6 `PerguntaPeriodo.tsx`

**Problemas de UX**
- **Viola "uma pergunta por tela":** pergunta início **e** término, cada um com
  seu conjunto de chips e possível campo de data. É a tela mais densa do app.
- `<input type="date"` nativo é um dos controles mais hostis que existem em
  mobile para usuários idosos — abre um seletor denso, com alvos minúsculos e
  comportamento diferente em cada navegador.
- Não há resumo do que foi escolhido antes de avançar.

**Problemas de UI**
- Chips de 34px de altura — muito abaixo do mínimo.
- Chips de 13px de texto.

**Proposta**
1. **Assumir "Hoje" como início por padrão e não perguntar.** Oferecer
   "Começa em outro dia" como link terciário.
   *Motivo:* a esmagadora maioria dos acessos de portaria começa agora.
   Eliminar a pergunta elimina a metade densa da tela (Princípio 5).
2. A tela passa a perguntar só: **"Até quando?"**, com presets em cartões de
   72px em largura total, incluindo **"Só hoje"** como primeira opção (hoje
   ausente, apesar de ser o caso mais comum de visitante).
   *Motivo:* o preset mais frequente deve ser o mais fácil de alcançar.
3. Substituir `<input type="date">` por seletor próprio de calendário com
   alvos de 48px, ou por presets de dias ("+7 dias", "+15 dias", "+30 dias").
4. Chips → cartões de 72px, 21px.

### 14.7 `PerguntaObservacoes.tsx`

**Problemas**
- É a **última etapa de um fluxo de 6 telas e é opcional** — pede esforço
  justamente onde o operador quer terminar.
- `autoFocus` no textarea abre o teclado e **empurra o botão "Salvar e Liberar"
  para fora da tela**. O usuário precisa fechar o teclado para concluir. Falha
  operacional direta.
- Não há **nenhum resumo** do que está sendo autorizado antes de salvar. O
  porteiro confirma às cegas o resultado de 6 telas.

**Proposta**
1. **Transformar em tela de revisão com observação embutida.** Mostrar o
   resumo — Pessoa, Motivo, Destino, Autorizador, Período — em lista legível,
   com "Observação (opcional)" como campo colapsado ao final.
   *Motivo:* fecha o ciclo de feedback do fluxo inteiro e permite detectar erro
   antes de gravar, sem custar uma tela extra. Também dá sentido à etapa final,
   que hoje é a mais fraca do fluxo.
2. **Remover `autoFocus`.** O teclado só abre se o porteiro tocar no campo.
   *Motivo:* o caminho mais comum (sem observação) não deve custar um teclado
   aberto.
3. Botão fixo no rodapé, rotulado **"Confirmar autorização"**.
4. Cada linha do resumo é tocável e leva de volta à sua tela para correção.

### 14.8 `PerfilPessoa.tsx`

**Problemas de UX**
- A tela mais densa do app: cabeçalho + dados + acesso/autorizações +
  histórico + rodapé. Muito acima do limite de 7 elementos.
- **A ação mais importante — "Dar Entrada" — não é a ação primária visual.**
  Ela aparece dentro de cartões, com 40px de altura e 13px de texto, enquanto
  "Nova Autorização" ocupa o rodapé fixo, que é a posição de destaque. **A
  hierarquia está invertida:** dar entrada é o que acontece em quase todo
  atendimento; nova autorização é a exceção.
- O botão de recusar é um ícone `Ban` cinza-claro de 15px, sem rótulo — ação
  destrutiva escondida em alvo minúsculo, próxima do botão de entrada.
- Histórico de acessos compete por atenção com a ação do momento.

**Problemas de UI**
- Texto em 10, 12 e 13px em quase todos os metadados.
- `text-gray-300` no botão de recusar = contraste ~1.9:1.
- Botões de ação com 40px de altura.

**Proposta**
1. **Inverter a hierarquia:** quando há exatamente uma autorização vigente (o
   caso dominante), **"Dar Entrada" vira o botão primário fixo do rodapé**,
   64px, `--es-success`, com o destino escrito nele: *"Dar entrada — Salão
   Principal"*.
   *Motivo:* Princípio 1 e 9. A ação de 90% dos casos merece a posição de 100%
   do destaque.
2. Havendo várias autorizações, o rodapé pergunta **"Qual autorização?"** e a
   lista vira seleção — a entrada acontece na sequência.
   *Motivo:* mantém uma ação por tela mesmo no caso ramificado.
3. **Mover histórico para uma tela secundária**, atrás de um link "Ver
   histórico de acessos".
   *Motivo:* é dado de consulta, não de operação; não pertence ao caminho quente.
4. **"Nova Autorização" rebaixado a secundário**, acima do primário.
5. **Recusar sai do cartão** e vira item da tela de detalhe da autorização,
   com rótulo textual.
   *Motivo:* ação destrutiva nunca deve ser adjacente à ação afirmativa mais
   frequente — é a receita clássica do erro de toque.
6. Elevar toda tipografia ao piso de 17px.

### 14.9 `ProgressoAtendimento.tsx`

**Acertos** — 3 etapas, nomes curtos, estados claros. Conceito correto.

**Problemas** — círculos de 36px, números de 13px, rótulos de 11px. Todo o
componente está subdimensionado e ocupa espaço vertical sem ser legível.

**Proposta** — círculos de 40px, números 19px/700, rótulos 17px/600, conector
de 3px. Se o espaço vertical ficar apertado, prefira **reduzir a altura do
header** a encolher o progresso.

### 14.10 `ConciergeLayout.tsx`

**Problemas**
- "Voltar ao Hub" e "Sair" são ações administrativas ocupando espaço permanente
  numa tela de operação. O porteiro nunca usa nenhuma das duas durante o turno.
- Os rótulos somem no mobile (`hidden sm:inline`), deixando **dois ícones
  sozinhos** — exatamente o que §12.4 proíbe. E "Sair" é destrutivo.
- O header do layout **duplica** o header interno de `HomeBusca`: dois blocos
  "PORTARIA" empilhados, consumindo ~120px de altura vertical numa tela onde a
  altura é o recurso mais escasso.

**Proposta**
1. **Remover o header do layout durante o fluxo de atendimento.** Ele existe
   só na Home.
   *Motivo:* recupera ~64px de altura útil em todas as telas de pergunta.
2. Mover "Sair" e "Voltar ao Hub" para dentro de uma tela de ajustes, acessível
   a partir da Home por um único botão rotulado.
   *Motivo:* ação destrutiva não deve estar permanentemente a um toque de
   distância durante a operação.
3. Eliminar a duplicação de identidade visual entre layout e `HomeBusca`.

---

## 15. Padrões reutilizáveis

### 15.1 Padrão "Pergunta"
O esqueleto de toda tela de coleta:

```
Header (Voltar + fase)
Progresso (se aplicável)
─────────────────────────
Pergunta 28px  ·  "Qual o DESTINO?"
Auxiliar 17px  ·  (opcional)

[ Conteúdo: opções, campo ou busca ]
─────────────────────────
[ Ação primária 64px — fixa ]
```

### 15.2 Padrão "Escolha"
- 2–6 opções → cartões verticais de 72px
- 7+ opções → busca + recentes + lista
- Sempre com recentes no topo quando houver histórico

### 15.3 Padrão "Confirmação destrutiva"
Bottom sheet · ícone 64px · título 28px · corpo 19px · botão destrutivo com
verbo explícito · cancelar abaixo · toque fora cancela.

### 15.4 Padrão "Sucesso"
Ícone circular 80px animado · título 23px · nome da pessoa · retorno
automático em 2s **com botão de avançar imediatamente**.
*(Hoje `PerguntaObservacoes` só aguarda o timer — o operador com fila não pode
ser obrigado a esperar 2 segundos. Adicionar "Continuar".)*

### 15.5 Padrão "Estado vazio"
Ícone 48px · o que houve (21px/600) · o que fazer (19px, `--es-ink-3`) ·
ação sugerida quando existir.

---

## 16. Checklist de revisão

Antes de considerar qualquer tela pronta:

- [ ] Tem exatamente **uma** ação primária?
- [ ] A ação primária está fixa no rodapé, na zona do polegar?
- [ ] Todos os alvos tocáveis têm ≥56px?
- [ ] Todo texto tem ≥17px?
- [ ] Todo texto passa em 7:1?
- [ ] Há no máximo 3 ações e 7 elementos visuais?
- [ ] Responde a **uma** pergunta?
- [ ] Nenhum estado depende só de cor?
- [ ] Ações reversíveis estão livres de confirmação; irreversíveis, protegidas?
- [ ] Todos os 6 estados de cada componente estão definidos?
- [ ] A tela se explica sozinha para quem acabou de ser interrompido?
- [ ] Funciona com o teclado virtual aberto?
- [ ] Legível sob luz solar direta (teste real, na rua)?

---

## 17. Prioridade de implementação

Ordenada por impacto operacional sobre esforço:

| # | Mudança | Impacto | Esforço |
|---|---|---|---|
| 1 | Rebaixar "Nenhuma das Alternativas" a terciário + confirmação (§14.2) | **Crítico** — evita cancelamento acidental de atendimento | Baixo |
| 2 | Elevar tipografia ao piso de 17px em todo o app | **Crítico** — legibilidade é o requisito central | Médio |
| 3 | Substituir cinzas abaixo de `--es-ink-3` | **Crítico** — contraste sob sol | Baixo |
| 4 | Inverter hierarquia do `PerfilPessoa`: "Dar Entrada" como primário fixo (§14.8) | **Alto** — otimiza a ação mais frequente | Médio |
| 5 | Ação primária fixa no rodapé em todas as telas | **Alto** — corrige quebra com teclado aberto | Médio |
| 6 | Alvos de toque para 56px mínimo | **Alto** — reduz erro motor | Médio |
| 7 | Separar Home em busca + lista (§14.1) | **Alto** — uma ação por tela | Médio |
| 8 | `PerguntaObservacoes` → tela de revisão (§14.7) | **Alto** — fecha o ciclo de feedback | Médio |
| 9 | Simplificar `PerguntaPeriodo` para uma pergunta (§14.6) | **Médio** | Médio |
| 10 | Remover header duplicado do layout (§14.10) | **Médio** — recupera altura útil | Baixo |
| 11 | Fundo claro na `ConfirmacaoSelfie` (§14.3) | **Médio** | Baixo |
| 12 | Adotar Inter + `tabular-nums` + `ss02` | **Médio** | Baixo |
| 13 | `prefers-reduced-motion` | **Baixo** | Baixo |

---

## 18. Resumo

O protótipo atual **já acerta a decisão arquitetural mais difícil**: o fluxo
guiado, uma pergunta por tela, com o padrão busca-mais-recentes e chips que
preenchem sem confirmar. Essa fundação está correta e não deve ser mexida.

Os problemas são de **calibragem para o usuário real**, e se concentram em
três eixos:

1. **Escala.** A interface foi desenhada com a escala tipográfica e de alvos
   de um app de consumo para adultos jovens em ambiente interno. O usuário
   real tem 60 anos, usa óculos e está no sol. Praticamente tudo precisa
   crescer.

2. **Hierarquia.** Em três telas a ação mais importante não é a mais
   proeminente — e em uma delas (`ValidacaoNovoUser`) a ação *destrutiva* é a
   que parece primária. Essa é a correção de maior urgência do documento.

3. **Contraste.** Os cinzas claros herdados do Tailwind padrão (`gray-300`,
   `gray-400`) falham inclusive em WCAG AA e são inutilizáveis no ambiente
   real de operação.

Nenhuma dessas correções exige repensar o produto. Todas são ajustes de
sistema — o que é exatamente o motivo deste documento existir: aplicadas como
tokens e padrões, elas se propagam para todas as telas futuras sem que a
decisão precise ser retomada a cada uma.

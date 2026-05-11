# Guia de Estilo: Sinfonia da Brasa Premium (V2)

Este documento oficializa o Design System Rústico, Industrial e Premium do **Mister Churras**. O Coder deverá utilizar estas classes utilitárias do Tailwind CSS e diretrizes para construir a aplicação.

## 1. A Alma do Negócio (Tone of Voice & Copywriting)
*   **Tom:** Épico, confiante, de Mestre para Guardião. A jornada é um ritual.
*   **Textos Chave (Copy):**
    *   *Setup de Pessoas:* Em vez de "Quantas pessoas?", use **"Defina o Batalhão"**.
    *   *Setup de Tempo:* Em vez de "Duração?", use **"O Ritual de Fogo (horas)"**.
    *   *Resultados:* A lista final não é uma lista de compras, é a **"Lista do Mestre"**.

## 2. Paleta de Cores 'Sinfonia da Brasa'

O Tailwind CSS do projeto (`tailwind.config.js`) deve estar mapeado com as seguintes cores:

### Backgrounds (Estrutura)
*   **Carvão Ativado:** `#1A1A1A` (Fundo primário de seções e cards).
*   **Noite Profunda:** `#121212` (Background do App).
*   *Efeitos:* Uso de gradientes que simulam fumaça ou cimento queimado.
    *   *Classes Tailwind:* `bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#121212]`

### Acentos (Ação e Foco)
*   **Brasa Viva:** `#D35400` (Botões primários ativos, ícones de destaque, bordas em foco).
*   **Cinza de Madeira:** `#E67E22` (Hover states para Brasa Viva).
*   **Fogo Profundo:** `#C0392B` (Alertas críticos ou botão final "Finalizar Ritual").

### Tipografia (Contraste)
*   **Off-white Papel:** `#F4F4F4` (Texto principal de alto contraste).
*   **Alumínio Escovado:** `#BDC3C7` (Textos secundários, legendas descritivas, placeholders).

## 3. Tipografia com Peso

*   **Títulos (H1, H2, H3):** Fonte serifada robusta e imponente, trazendo o tom épico.
    *   *Família:* `Playfair Display` (ou `Cinzel`).
    *   *Classes Tailwind:* `font-serif font-bold tracking-wide`
*   **Corpo e Numerais:** Fonte sem serifa clara, moderna e legível.
    *   *Família:* `Inter` (Corpo) ou `Roboto Mono` (Para contadores de pessoas/horas).
    *   *Classes Tailwind:* `font-sans text-base` ou `font-mono text-xl`

## 4. Visual Elements (Texturas e Componentes)

O Coder deve aplicar a estética rústico-industrial através da sobreposição de sombras e bordas espessas.

### Cards e Containers (Metal Prensado)
Os containers não são de plástico; são blocos pesados.
*   **Estilo:** Bordas imitando ferro batido/metal oxidado. Sombras internas (inset).
*   **Classes Tailwind (Referência):** 
    `bg-[#1A1A1A] border-4 border-neutral-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_10px_30px_rgba(0,0,0,0.5)] rounded-xl backdrop-blur-md`

### Botões (Chapa Quente e Madeira)
*   **Botão Primário (Avançar / Finalizar):** Aspecto de chapa de ferro quente pulsando.
    *   **Classes Tailwind (Referência):** 
        `bg-gradient-to-r from-[#C0392B] via-[#D35400] to-[#C0392B] text-[#F4F4F4] font-serif font-bold uppercase border-y-2 border-neutral-900 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] transition-all transform active:scale-95`
*   **Botão Secundário:** Textura de madeira carbonizada/ferro fosco.
    *   **Classes Tailwind (Referência):**
        `bg-[#1A1A1A] text-[#F4F4F4] border-x-4 border-neutral-700 hover:border-neutral-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]`

## 5. Microinterações
*   **Pulsação da Brasa (Glow):** Elementos chamativos devem pulsar suavemente como carvão aceso.
    *   *Implementação:* Criar chave `@keyframes pulse-brasa` alternando as sombras (box-shadow) entre intensidades de `#D35400`. Aplicar via `animate-[pulse-brasa_2s_infinite]`.
*   **Faíscas:** Ao confirmar o cálculo ("Gerar Lista do Mestre"), pequenos brilhos/faíscas podem cruzar o background antes da transição da tela.

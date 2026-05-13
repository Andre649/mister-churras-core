# Guia de Estilo Final - Mister Churras Chronicles (Estética 1890)

## 1. Paleta de Cores (A Alma do Fogo)
| Elemento | Hex | Nome | Uso |
| :--- | :--- | :--- | :--- |
| **Fundo** | `#F4ECD8` | Papel Pergaminho | Background principal das telas e cards |
| **Texto** | `#1A1A1A` | Tinta de Prensa | Títulos, parágrafos e comandos |
| **Primária** | `#B8860B` | Ouro Velho | Selos, destaques e ícones importantes |
| **Secundária** | `#8B0000` | Sangue de Boi | Botões de ação, alertas e estados ativos |
| **Bordas** | `#4A3728` | Madeira Tostada | Divisores, molduras e filetes vitorianos |

## 2. Tipografia (A Prensa do Mestre)
- **Títulos**: `Cinzel` ou `Old Standard TT` (Serifada Imponente, peso bold)
- **Corpo**: `Special Elite` ou `Courier Prime` (Estilo Máquina de Escrever)
- **Números**: `Roboto Mono` (Precisão técnica em gramaturas)

## 3. Dicionário do Ritual (UX Copy)
| Termo Moderno | Termo Chronicles |
| :--- | :--- |
| Login | Entrar na Confraria |
| Quantas Pessoas | Tamanho do Batalhão |
| Cortes de Carne | O Mapa da Brasa |
| Calcular | Acender o Fogo |
| Lista de Compras | Provisões do Açougue |
| Configurações | Afiando a Faca |
| Finalizar | Consagrar o Corte |

## 4. Elementos Visuais
- **Cards**: Sem bordas arredondadas (`rounded-none`). Bordas duplas vitorianas (`border-double border-4`).
- **Inputs**: Estilo linha única ou caixa com borda fina, fundo ligeiramente mais escuro que o pergaminho.
- **Botões**: Visual de carimbo de cera ou prensa de metal. Efeito de pressão ao clicar (`active:scale-95`).
- **FAB**: Selo de Lacre Bucanero (Circular, vermelho/ouro, animação pulse).

## 5. Classes Tailwind Utilitárias
- `bg-pergaminho`: `bg-[#F4ECD8]`
- `text-prensa`: `text-[#1A1A1A]`
- `border-madeira`: `border-[#4A3728]`
- `btn-ritual`: `bg-[#8B0000] text-[#F4ECD8] font-serif uppercase tracking-widest`
- `card-cronica`: `bg-[#F4ECD8] border-double border-4 border-[#4A3728] shadow-lg`

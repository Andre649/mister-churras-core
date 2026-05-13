# Plano Mestre - Mister Churras (5W2H)

Este é o documento oficial de governança do aplicativo **Mister Churras**. Ele detalha nossa jornada desde a concepção até os próximos passos usando o framework 5W2H, garantindo que o Maestro e toda a equipe técnica (Arquiteto, Designer e Coder) estejam na mesma página.

---

### 1. WHAT (O que será feito?)
O desenvolvimento de um aplicativo web progressivo (PWA) de ponta chamado **Mister Churras**. O app atua como o "Mestre da Brasa" virtual, calculando exatamente a quantidade de carnes, bebidas e suprimentos para um churrasco perfeito, com base no número de pessoas, tempo de duração e tipos de corte desejados.

### 2. WHY (Por que será feito?)
Para resolver a principal dor de quem organiza um churrasco: o medo de faltar carne ou o excesso de desperdício. O app é construído sob a "Filosofia do Churrasco", onde a "Margem de Segurança do Mestre" garante fartura na medida exata, entregando autoridade e tranquilidade ao usuário na hora das compras.

### 3. WHERE (Onde será feito?)
- **Frontend:** Aplicação PWA para uso offline na beira da churrasqueira (React + Tailwind CSS).
- **Backend/Dados:** Nuvem estruturada no Supabase (PostgreSQL) com total privacidade via Row Level Security (RLS).
- **Repositório Atual:** Pasta raiz do projeto (`mister-churras-core`).

### 4. WHEN (Quando será feito?)
O cronograma do projeto é dividido em Fases de Entregas Contínuas:
- ✅ **Fase 1: Documentação de Engenharia (Concluída)** - Criação de *Arquitetura*, *Design System*, *Banco de Dados* e *Algoritmos*.
- ✅ **Fase 2: Frontend e Lógica Base (Concluída)** - Restauração do projeto Vite, implementação da UI e motor de cálculo `calculator.ts`.
- ✅ **Fase 3: Integração Backend (Concluída)** - Conexão com Supabase Auth e banco de dados para salvar "Eventos" e "Listas de Compras".
- ⏳ **Fase 4: Otimização PWA e Deploy (Atual)** - Cache offline (Service Workers) e publicação do app (Vercel).

### 5. WHO (Quem fará?)
A execução está sendo guiada pelo time de Inteligência Artificial:
- **O Usuário (Mestre Supremo):** Dá a visão de produto e valida as etapas.
- **O Maestro (Agente Orquestrador):** Coordena as fases, redige os planos mestres e garante o alinhamento técnico.
- **O Arquiteto:** Fornece as lógicas precisas de cálculo e modelagem de dados seguros.
- **O Designer:** Define o visual Rústico-Premium (Carvão, Brasa e Off-White).
- **O Coder:** O executor sênior do código React/TypeScript e integrações complexas.

### 6. HOW (Como será feito?)
Seguindo o fluxo do Design System e o Stack moderno:
1.  **Tecnologia:** React 19, TypeScript, Vite, Tailwind CSS.
2.  **UI/UX:** Interface escura (Carvão), destaques dinâmicos (Brasa) e micro-interações `.glow-brasa`.
3.  **Lógica:** Cálculo matemático de "consumo base" somado ao "acelerador de tempo" (eventos > 4 horas) e "margem de segurança" (15%).
4.  **Integração:** Client do Supabase com requisições assíncronas no frontend.

### 7. HOW MUCH (Quanto custará?)
- **Recursos Financeiros (Infraestrutura):** Custo **ZERO** na fase de lançamento. Utilizaremos o "Free Tier" do Supabase (para Auth e Database) e o "Free Tier" da Vercel/Netlify para hospedagem do Frontend.
- **Recursos Operacionais:** Dedicação contínua da equipe de Agentes de IA orquestrada pelas solicitações do Mestre.

---
*Documento gerado pelo Maestro na transição da Fase 2 para a Fase 3.*

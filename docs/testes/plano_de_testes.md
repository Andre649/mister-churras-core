# Plano de Testes: Mister Churras (QA Maestro Edition)

Este documento descreve os cenários de teste para garantir a robustez e o "Luxo Técnico" do Mister Churras.

## 1. Fluxo Principal: Ritual de Fogo (Calculadora)
- **Cenário 1.1: Churrasco Padrão**
  - Inputs: 10 Guerreiros, 5 Guardiãs, 3 Crianças, 4 Horas.
  - Resultado Esperado: Cálculo proporcional de carnes, carvão e bebidas.
- **Cenário 1.2: Churrasco de Longa Duração**
  - Inputs: 12 horas de fogo.
  - Resultado Esperado: Multiplicador de fome/sede aplicado corretamente (Fator Tempo).
- **Cenário 1.3: Seleção de Carnes**
  - Ação: Marcar/Desmarcar tipos de carne específicos.
  - Resultado Esperado: A lista de compras deve refletir apenas as carnes selecionadas.

## 2. Autenticação: Caderneta do Mestre
- **Cenário 2.1: Login com Sucesso (WhatsApp OTP)**
  - Fluxo: Inserir número -> Receber OTP -> Inserir OTP -> Logar.
  - Resultado Esperado: Sessão ativa e nome/telefone no cabeçalho.
- **Cenário 2.2: Erro de Código Inválido**
  - Ação: Inserir código diferente do gerado.
  - Resultado Esperado: Mensagem de erro "Código inválido".
- **Cenário 2.3: Persistência de Sessão**
  - Ação: Logar e recarregar a página.
  - Resultado Esperado: Continuar logado (Sessão mantida).

## 3. Persistência de Dados (Supabase)
- **Cenário 3.1: Gravar na Caderneta**
  - Fluxo: Realizar cálculo -> Clicar em "Gravar na Caderneta" (Logado).
  - Resultado Esperado: Mensagem de sucesso e registro criado na tabela `events`.
- **Cenário 3.2: Tentativa de Gravar Sem Login**
  - Fluxo: Realizar cálculo -> Clicar em "Gravar na Caderneta" (Deslogado).
  - Resultado Esperado: Abertura automática do Modal de Autenticação.

## 4. Interface e UX (Sanity Check)
- **Cenário 4.1: Responsividade Mobile**
  - Ação: Visualizar em 375px de largura.
  - Resultado Esperado: Botões clicáveis e textos legíveis sem scroll horizontal.
- **Cenário 4.2: Estética Rústico-Premium**
  - Ação: Verificar animações de brasa e sombras de metal forjado.
  - Resultado Esperado: Identidade visual consistente em todos os passos.

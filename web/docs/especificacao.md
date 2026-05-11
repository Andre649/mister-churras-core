# Especificação Lógica: Motor do Churrasco

## Terminologia do Domínio
O algoritmo de cálculo agora reflete o vocabulário épico do Mestre da Brasa:
- **Homens** passam a ser tratados como **Guerreiros**.
- **Mulheres** passam a ser tratadas como **Guardiãs**.
- **Crianças** passam a ser tratadas como **Aprendizes**.
- **Duração** passa a ser **Tempo de Fogo**.

## Lógica Principal (Multiplicador de Fome)
A Margem de Segurança Base continua sendo definida pelo Arquiteto. No entanto, o **Tempo de Fogo** é o fator primordial:
- Eventos até 4 horas: Cálculo Base Padrão.
- Acelerador Térmico (Fome Estendida): Para cada hora extra além da 4ª, aplica-se uma taxa de voracidade de `+10%` no total do volume, multiplicando agressivamente os insumos para acompanhar o ritmo dos Guerreiros e Guardiãs.

*(Nota: Esta especificação altera o Copy das interfaces e garante que a lógica esteja perfeitamente alinhada com o Tom de Voz do projeto)*

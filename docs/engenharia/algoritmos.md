# Lógica e Algoritmos de Cálculo - Mister Churras

## 1. Variáveis Base de Consumo
O cálculo padrão do Arquiteto assume um consumo base por tipo de pessoa durante um evento de **4 horas**:

### Consumo Base (Carnes - 4 horas):
- **Homem:** ~600g
- **Mulher:** ~400g
- **Criança:** ~250g

### Acelerador de Tempo (Duração do Evento):
Se o evento durar mais de 4 horas, aplica-se um acréscimo proporcional para as horas adicionais.
- A cada hora extra, soma-se 10% a 15% ao consumo base, ou uma fração da gramatura horária (ex: 100g extra por hora por adulto).

## 2. Divisão por Tipos de Cortes (Média Padrão)
O usuário poderá selecionar quais cortes deseja. O peso total de carnes calculado deverá ser distribuído entre os cortes escolhidos. Exemplo de proporção caso o usuário escolha todos:
- Bovino (Picanha, Alcatra, Fraldinha): 50%
- Suíno / Frango / Linguiça: 40%
- Pão de Alho / Queijo Coalho: 10% (Tratados à parte ou dentro do volume total dependendo da escolha)

## 3. Bebidas (Estimativa 4 horas)
- **Cerveja:** 5 a 6 latas/long necks por adulto que bebe.
- **Refrigerante / Água:** 1 litro por pessoa (inclusive crianças).

## 4. Margem de Segurança do Mestre
O verdadeiro mestre nunca deixa faltar carne. Após todos os cálculos base:
- **Total de Carnes:** `Total * 1.15` (Acréscimo de 15%).
- **Total de Bebidas:** `Total * 1.10` (Acréscimo de 10%).

## 5. Suprimentos Extras
- **Carvão:** 1kg de carvão para cada 1kg de carne (Proporção 1:1 segura).
- **Sal Grosso:** 500g para cada 10kg de carne.

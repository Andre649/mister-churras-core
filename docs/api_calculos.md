# API de Cálculos - Motor "Fartura com Inteligência"

Este documento descreve o contrato da API de cálculos para o Mister Churras. A API é responsável por processar a matriz de consumo e retornar os valores com a "Margem do Mestre" aplicada.

## 1. Endpoint Principal

**POST** `/api/v1/calcular-churrasco`

Este endpoint recebe a configuração do evento e devolve a lista de compras precisa e segura.

### Request Payload (Entrada)

```json
{
  "evento": {
    "adultos": 50,
    "criancas": 10,
    "tempo_fogo_horas": 8
  }
}
```
* **adultos** (int): Número de adultos.
* **criancas** (int): Número de crianças (calculadas como 0.5 adulto).
* **tempo_fogo_horas** (float): Duração prevista do churrasco.

---

### Response Payload (Saída)

A resposta retorna os itens processados utilizando a fórmula base ($200g + 50g \times T$) cruzada com a Matriz de Consumo de proteínas, aplicando ao final a Margem de 10%.

```json
{
  "sucesso": true,
  "dados": {
    "parametros_calculados": {
      "pessoas_equivalentes": 55.0,
      "base_gramas_pessoa": 600,
      "margem_aplicada": 1.10
    },
    "carnes": [
      {
        "id": "bovina",
        "nome": "Carne Bovina (Picanha, Contrafilé)",
        "quantidade_kg": 18.15,
        "proporcao_matriz": "50%"
      },
      {
        "id": "suina",
        "nome": "Carne Suína (Costelinha, Pernil)",
        "quantidade_kg": 7.26,
        "proporcao_matriz": "20%"
      },
      {
        "id": "frango",
        "nome": "Frango (Asinha, Coração)",
        "quantidade_kg": 5.45,
        "proporcao_matriz": "15%"
      },
      {
        "id": "linguica",
        "nome": "Linguiça (Toscana, Apimentada)",
        "quantidade_kg": 5.45,
        "proporcao_matriz": "15%"
      }
    ],
    "totais": {
      "carne_kg": 36.30
    }
  }
}
```

## 2. Regras de Negócio e Validações HTTP

* **HTTP 400 (Bad Request):**
  * `adultos` não pode ser negativo. Se `adultos` = 0 e `criancas` > 0, o evento não faz sentido prático para o churrasco, retornar erro.
  * `tempo_fogo_horas` deve ser no mínimo 1 hora e no máximo 24 horas.
* **HTTP 200 (OK):** O cálculo foi processado e a Margem do Mestre aplicada.
* **Segurança:** O endpoint pode ser protegido ou aberto dependendo da implementação do Frontend com o Supabase (Edge Functions), mas a lógica de cálculo deve sempre viver no Backend/Edge para evitar adulterações pelo cliente.

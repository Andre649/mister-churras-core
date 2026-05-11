def calcular_churrasco(adultos, criancas, tempo_horas):
    peq = adultos + (criancas * 0.5)
    
    # Formula base do Arquiteto: 200 + 50 * T
    base_total = 200 + (50 * tempo_horas)
    
    # Matriz de Consumo (Proporcoes)
    bovina_base = base_total * 0.50
    suina_base = base_total * 0.20
    frango_base = base_total * 0.15
    linguica_base = base_total * 0.15
    
    # Aplicando Pessoas Equivalentes e Margem do Mestre (1.10)
    margem = 1.10
    
    # Transformando em Kg
    total_bovina = (peq * bovina_base * margem) / 1000
    total_suina = (peq * suina_base * margem) / 1000
    total_frango = (peq * frango_base * margem) / 1000
    total_linguica = (peq * linguica_base * margem) / 1000
    total_geral = (peq * base_total * margem) / 1000
    
    return {
        "adultos": adultos,
        "criancas": criancas,
        "tempo_horas": tempo_horas,
        "peq": peq,
        "base_g_pessoa": base_total,
        "bovina_kg": round(total_bovina, 3),
        "suina_kg": round(total_suina, 3),
        "frango_kg": round(total_frango, 3),
        "linguica_kg": round(total_linguica, 3),
        "total_kg": round(total_geral, 3)
    }

if __name__ == "__main__":
    cenarios = [
        {"adultos": 10, "criancas": 0, "tempo": 4},
        {"adultos": 50, "criancas": 10, "tempo": 8},
        {"adultos": 100, "criancas": 20, "tempo": 2}
    ]

    print("=======================================")
    print("SIMULADOR QA - MISTER CHURRAS")
    print("=======================================\n")
    
    for c in cenarios:
        res = calcular_churrasco(c["adultos"], c["criancas"], c["tempo"])
        print(f"--- Simulação: {c['adultos']} Adultos, {c['criancas']} Crianças, {c['tempo']}h ---")
        print(f"Pessoas Equivalentes: {res['peq']} | Base/Pessoa: {res['base_g_pessoa']}g")
        print(f"Total de Carne (com 10% margem): {res['total_kg']:.2f} kg")
        print(f" - Bovina (50%):   {res['bovina_kg']:.2f} kg")
        print(f" - Suína (20%):    {res['suina_kg']:.2f} kg")
        print(f" - Frango (15%):   {res['frango_kg']:.2f} kg")
        print(f" - Linguiça (15%): {res['linguica_kg']:.2f} kg\n")

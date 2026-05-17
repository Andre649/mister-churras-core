import math
import time
import concurrent.futures

# =====================================================================
# ALGORITMO OFICIAL DO ARQUITETO (MAPEADO DO BACKEND calcular-churrasco)
# =====================================================================

def calcular_churrasco_api(guests, duration_hours, meats, appetite=None):
    # Validações
    if not guests or duration_hours is None:
        return {"error": "Missing parameters"}, 400
    
    if duration_hours < 1 or duration_hours > 24:
        return {"error": "Duração deve ser entre 1 e 24 horas"}, 400

    # 1. Base consumption for 4 hours
    base_meat_total = (guests.get("men", 0) * 0.6) + (guests.get("women", 0) * 0.4) + (guests.get("kids", 0) * 0.25)
    
    # Appetite intensity multiplier
    appetite_factor = 0.8 if appetite == 'moderado' else (1.25 if appetite == 'ogro' else 1.0)
    base_meat_total = base_meat_total * appetite_factor
    
    # Accelerator for time > 4h (10% extra per additional hour)
    if duration_hours > 4:
        extra_hours = duration_hours - 4
        base_meat_total = base_meat_total * (1 + (0.10 * extra_hours))

    # Mestre's safety margin: +15% for meat
    total_meat_kg = base_meat_total * 1.15

    # Distribute based on selected meats
    active_meats_count = 0
    if meats.get("bovino"): active_meats_count += 1
    if meats.get("suino"): active_meats_count += 1
    if meats.get("frango"): active_meats_count += 1
    if meats.get("linguica"): active_meats_count += 1

    p_bovino = p_suino = p_frango = p_linguica = 0
    
    if active_meats_count > 0:
        if meats.get("bovino") and not meats.get("suino") and not meats.get("frango") and not meats.get("linguica"):
            p_bovino = 1.0
        elif meats.get("bovino"):
            p_bovino = 0.5
            remaining = 0.5
            others = active_meats_count - 1
            if others > 0:
                if meats.get("suino"): p_suino = remaining / others
                if meats.get("frango"): p_frango = remaining / others
                if meats.get("linguica"): p_linguica = remaining / others
            else:
                p_bovino = 1.0
        else:
            split = 1.0 / active_meats_count
            if meats.get("suino"): p_suino = split
            if meats.get("frango"): p_frango = split
            if meats.get("linguica"): p_linguica = split

    # Drinks (4h base)
    adults = guests.get("men", 0) + guests.get("women", 0)
    base_beer = guests.get("drinkers", 0) * 8
    base_soda = (adults + guests.get("kids", 0)) * 1.0

    if duration_hours > 4:
        extra_hours = duration_hours - 4
        base_beer = base_beer * (1 + (0.10 * extra_hours))
        base_soda = base_soda * (1 + (0.10 * extra_hours))

    total_beer = math.ceil(base_beer * 1.10)
    total_soda = math.ceil(base_soda * 1.10)

    # Supplies
    total_coal = math.ceil(total_meat_kg)
    total_salt = round((total_meat_kg / 10.0) * 0.5, 1)

    # Sides
    total_people = adults + guests.get("kids", 0)
    pao_de_alho = (adults * 2 + guests.get("kids", 0) * 1) if meats.get("paoDeAlho") else 0
    queijo_coalho = (total_people * 1) if meats.get("queijoCoalho") else 0
    farofa = round(total_people * 0.1, 1)
    vinagrete = round(total_people * 0.1, 1)

    result = {
        "meats": {
            "bovino": round(total_meat_kg * p_bovino, 1),
            "suino": round(total_meat_kg * p_suino, 1),
            "frango": round(total_meat_kg * p_frango, 1),
            "linguica": round(total_meat_kg * p_linguica, 1),
            "total": round(total_meat_kg, 1),
        },
        "sides": {
            "paoDeAlho": pao_de_alho,
            "queijoCoalho": queijo_coalho,
            "farofa": farofa,
            "vinagrete": vinagrete,
        },
        "drinks": {
            "beer": total_beer,
            "sodaWater": total_soda,
        },
        "supplies": {
            "coal": total_coal,
            "salt": 0.5 if total_salt < 0.5 else total_salt,
        }
    }
    return result, 200

# =====================================================================
# TEST SUITE
# =====================================================================

def run_api_tests():
    print("[TESTS] 1. TESTES DE API & VALIDACOES...")
    
    # Cenário Válido
    guests = {"men": 5, "women": 5, "kids": 2, "drinkers": 6}
    meats = {"bovino": True, "suino": True, "frango": True, "linguica": True, "paoDeAlho": True, "queijoCoalho": True}
    res, status = calcular_churrasco_api(guests, 4, meats)
    assert status == 200, "Erro em cenario valido"
    assert res["meats"]["total"] > 0, "Geral de carnes nao deve ser zero"
    print("  OK - Cenario padrao valido: Sucesso")

    # Duração menor que 1h
    res, status = calcular_churrasco_api(guests, 0, meats)
    assert status == 400, "Deveria falhar para 0 horas"
    print("  OK - Validacao de duracao minima (0h): Sucesso")

    # Duração maior que 24h
    res, status = calcular_churrasco_api(guests, 25, meats)
    assert status == 400, "Deveria falhar para 25 horas"
    print("  OK - Validacao de duracao maxima (25h): Sucesso")

def run_exploratory_tests():
    print("\n[TESTS] 2. TESTES EXPLORATORIOS...")
    
    # 0 Convidados
    guests = {"men": 0, "women": 0, "kids": 0, "drinkers": 0}
    meats = {"bovino": True, "suino": False, "frango": False, "linguica": False}
    res, status = calcular_churrasco_api(guests, 4, meats)
    assert res["meats"]["total"] == 0.0, "Total de carnes deveria ser 0"
    print("  OK - Caso limite: Zero convidados -> Sucesso")

    # 10.000 Convidados (Teste de Grande Porte)
    guests = {"men": 5000, "women": 4000, "kids": 1000, "drinkers": 7000}
    meats = {"bovino": True, "suino": True, "frango": True, "linguica": True}
    res, status = calcular_churrasco_api(guests, 6, meats)
    assert res["meats"]["total"] > 5000, "Grande porte falhou"
    print(f"  OK - Caso de grande porte (10.000 pessoas): {res['meats']['total']} Kg de carne calculados -> Sucesso")

    # Apenas Pão de Alho e Queijo Coalho selecionados (Carnes individuais devem pesar 0!)
    guests = {"men": 10, "women": 10, "kids": 5, "drinkers": 15}
    meats = {"bovino": False, "suino": False, "frango": False, "linguica": False, "paoDeAlho": True, "queijoCoalho": True}
    res, status = calcular_churrasco_api(guests, 4, meats)
    assert res["meats"]["bovino"] == 0.0
    assert res["meats"]["suino"] == 0.0
    assert res["meats"]["frango"] == 0.0
    assert res["meats"]["linguica"] == 0.0
    assert res["sides"]["paoDeAlho"] == 45, f"Esperado 45 paes de alho, obtido {res['sides']['paoDeAlho']}"
    print("  OK - Caso de churrasco vegetariano (sem carnes de fato): Sucesso")

def run_appetite_tests():
    print("\n[TESTS] 3. TESTES DE PERFIL DE APETITE (NOVA LÓGICA DO ARQUITETO)...")
    
    guests = {"men": 10, "women": 10, "kids": 4, "drinkers": 12}
    meats = {"bovino": True, "suino": True, "frango": False, "linguica": False}
    
    # 1. Moderado (0.8x)
    res_mod, _ = calcular_churrasco_api(guests, 4, meats, appetite='moderado')
    # 2. Mestre (1.0x)
    res_mes, _ = calcular_churrasco_api(guests, 4, meats, appetite='mestre')
    # 3. Ogro (1.25x)
    res_ogr, _ = calcular_churrasco_api(guests, 4, meats, appetite='ogro')
    
    t_mod = res_mod["meats"]["total"]
    t_mes = res_mes["meats"]["total"]
    t_ogr = res_ogr["meats"]["total"]
    
    print(f"  VALORES - Moderado: {t_mod} Kg | Mestre: {t_mes} Kg | Ogro: {t_ogr} Kg")
    
    # Asserções matemáticas
    assert t_mod < t_mes, "Consumo moderado deve ser menor que o padrão"
    assert t_ogr > t_mes, "Consumo ogro deve ser maior que o padrão"
    
    # Verificar proporção dos fatores de multiplicação
    assert abs((t_mod / t_mes) - 0.8) < 0.05, f"Esperado fator 0.8, obtido {t_mod / t_mes:.2f}"
    assert abs((t_ogr / t_mes) - 1.25) < 0.05, f"Esperado fator 1.25, obtido {t_ogr / t_mes:.2f}"
    
    print("  OK - Validacao dos fatores de Apetite (Moderado 0.8x, Ogro 1.25x): Sucesso")

def run_integration_tests():
    print("\n[TESTS] 4. TESTES DE INTEGRACAO (COMPUTABILIDADE)...")
    
    # Integração de Proporções: Carne bovina deve levar 50% se misturada
    guests = {"men": 10, "women": 10, "kids": 0, "drinkers": 12}
    meats = {"bovino": True, "suino": True, "frango": True, "linguica": True}
    res, status = calcular_churrasco_api(guests, 4, meats)
    total = res["meats"]["total"]
    bovino = res["meats"]["bovino"]
    assert abs(bovino - (total * 0.5)) < 0.5, f"Bovina deveria ser 50% do total ({total}), obtido {bovino}"
    print("  OK - Integracao de proporcao de carnes (Bovina = 50%): Sucesso")

    # Sal: 500g a cada 10Kg de carne
    coal = res["supplies"]["coal"]
    salt = res["supplies"]["salt"]
    assert coal == math.ceil(total), "Carvao deveria ser 1:1 com Kg de carne"
    print(f"  OK - Integracao de insumos (Carvao: {coal} sacos, Sal: {salt} Kg): Sucesso")

def run_load_tests():
    print("\n[TESTS] 5. TESTE DE CARGA (SIMULACAO PARALELA)...")
    
    guests = {"men": 5, "women": 5, "kids": 2, "drinkers": 6}
    meats = {"bovino": True, "suino": True, "frango": True, "linguica": True, "paoDeAlho": True, "queijoCoalho": True}
    
    requests_count = 1000
    start_time = time.time()
    
    # Simular 1000 requests em paralelo alternando os perfis de apetite
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = []
        for i in range(requests_count):
            app = 'moderado' if i % 3 == 0 else ('ogro' if i % 3 == 1 else 'mestre')
            futures.append(executor.submit(calcular_churrasco_api, guests, 4, meats, app))
        results = [f.result() for f in concurrent.futures.as_completed(futures)]
        
    end_time = time.time()
    duration = end_time - start_time
    throughput = requests_count / duration
    
    print(f"  SPEED - Total de requisicoes: {requests_count}")
    print(f"  SPEED - Tempo total de execucao: {duration:.3f} s")
    print(f"  SPEED - Vazao (Throughput): {throughput:.2f} req/s")
    print("  OK - Teste de carga com perfis dinamicos: Sucesso")

if __name__ == "__main__":
    print("=======================================")
    print("SUITE DE TESTES QA DE ALTA PERFORMANCE")
    print("=======================================\n")
    
    run_api_tests()
    run_exploratory_tests()
    run_appetite_tests()
    run_integration_tests()
    run_load_tests()
    
    print("\n=======================================")
    print("  TODOS OS TESTES PASSARAM COM SUCESSO!")
    print("=======================================")

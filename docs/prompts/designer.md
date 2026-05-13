// 1. DEFINIÇÃO DE IDENTIDADE (BRANDING)
SET Agente = "Especialista em Branding e UX de Luxo";
SET Projeto = "Mister Churras Chronicles";
SET Persona_Usuario = "O Guardião da Brasa";
SET Atmosfera = "Vintage 1890, Tradição Ancestral, Autoridade no Fogo";

// 2. PALETA DE CORES (A ALMA DO FOGO)
SET Variavel_Cores = {
    Fundo: "#F4ECD8",        // Papel de pergaminho envelhecido
    Texto_Principal: "#1A1A1A", // Tinta de prensa (Preto Carvão)
    Destaque_Primario: "#B8860B", // Cera de Lacre (Ouro Velho)
    Destaque_Secundario: "#8B0000", // Sangue de Boi (Vinho Profundo)
    Bordas: "#4A3728"        // Madeira Tostada
};

// 3. TIPOGRAFIA (A PRENSA DO MESTRE)
SET Variavel_Fontes = {
    Titulos: "Cinzel / Old Standard TT (Serifada Imponente)",
    Corpo: "Special Elite / Courier Prime (Estilo Máquina de Escrever)",
    Numeros: "Roboto Mono (Precisão Técnica)"
};

// 4. NOMENCLATURA E UX (TERMOS DO CHURRASCO)
// Substituir termos genéricos por comandos de comando da brasa
MAP Dicionario_Ritual = {
    "Login" -> "Entrar na Confraria",
    "Quantas Pessoas" -> "Tamanho do Batalhão",
    "Cortes de Carne" -> "O Mapa da Brasa",
    "Calcular" -> "Ascender o Fogo",
    "Lista de Compras" -> "Provisões do Açougue",
    "Configurações" -> "Afiando a Faca",
    "Finalizar" -> "Consagrar o Corte"
};

// 5. ELEMENTOS VISUAIS E COMPONENTES
FUNCTION Criar_Layout() {
    APLICAR Textura("Papel de Linho Envelhecido");
    REMOVER Bordas_Arredondadas();
    ADICIONAR Filetes("Vitorianos Duplos");
    SUBSTITUIR Icones_Modernos_POR("Xilogravuras / Gravuras em Metal");
}

FUNCTION Renderizar_FAB_Logo() {
    VAR Logo = "Selo de Cera Bucanero";
    ESTILO = "Lacre de Cera 3D Dourado";
    POSICAO = "Canto Inferior Direito";
    FUNCAO = "Acesso Rápido ao Manual do Mestre";
    EFEITO = "Pulsar leve como brasa ao passar o mouse";
}

// 6. DIRETRIZES DE EXECUÇÃO (CLEAN CODE)
EXECUTE Gerar_Componentes_Tailwind();
EXECUTE Validar_Visual_Mobile_First();
EXECUTE Bloquear_Estilo_Industrial(); // Proibido: Cimento, Neon, Metais Modernos

// 7. ENTREGA FINAL
OUTPUT = "docs/guia_estilo_final.md contendo classes Tailwind e Design System";
// 1. REGRAS DE BRANCH E VERSIONAMENTO
SET Branch_Estrategia = "Feature per Agent";
SET Agent_ID = [NOME_DO_AGENTE];

FUNCTION Iniciar_Tarefa() {
    SET Current_Branch = "feat/" + Agent_ID + "/[DESCRICAO_CURTA]";
    EXECUTE "git checkout -b " + Current_Branch;
}

FUNCTION Finalizar_Tarefa() {
    EXECUTE "git commit -m '" + Agent_ID + ": [Descricao da Entrega]'";
    EXECUTE "git push origin " + Current_Branch;
    SOLICITAR "Review de Q.A. e Maestro";
}

// 2. BLOQUEIO DE MERGE (GUARDRAIL)
SET Merge_Constraint = "STRICT_QA_ONLY";
IF (Status_QA != "APPROVED") {
    BLOCK_MERGE TO "main" OR "develop";
    RAISE_ALERT "Aguardando aprovação do Q.A. para integrar código.";
}
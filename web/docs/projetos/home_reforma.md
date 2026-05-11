# Projeto: Reforma da Home (Luxo Rústico)

## 1. Visão do Designer (UI/UX)
A tela inicial (Home) será o portal cerimonial para o churrasco.
- **Copyriting Ritualístico:** O título do formulário será **"Defina o Batalhão"**, e não uma mera pergunta sobre "pessoas". O tempo será **"O Ritual de Fogo (horas)"**.
- **Counters (Contadores):** O componente `Counter.tsx` deve ser refeito como um bloco de metal forjado. O fundo deve ser `#1A1A1A` com bordas espessas laterais (border-x-4) e sombras internas sutis. Os botões de `+` e `-` ganharão hover em Brasa Viva (`#D35400`) para simular calor.
- **Botão de Ação:** O botão final mudará de "Avançar" para **"Iniciar o Ritual"**, utilizando o gradiente premium já definido no Guia de Estilo, com animação pulsante.

## 2. Visão do Arquiteto (Validação de Variáveis)
A fundação técnica para a home deve assegurar regras estritas:
- `Guerreiros` (`men`): `int >= 0`
- `Guardiãs` (`women`): `int >= 0`
- `Aprendizes` (`kids`): `int >= 0`
- `Bebem Cerveja` (`drinkers`): `int >= 0 && int <= (men + women)`
- `Ritual de Fogo` (`durationHours`): `int >= 1`

*(Este documento serve como autorização para o Coder iniciar as modificações nos arquivos `SetupStep.tsx` e `Counter.tsx`.)*

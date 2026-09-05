# SurveyBenefits — Protótipo público

Protótipo estático da foundation UX/UI M0.5 do SurveyBenefits.

- não implementa autenticação nem funcionalidades de negócio;
- não recolhe nem envia credenciais;
- usa exclusivamente dados fictícios;
- demonstra landing, autenticação, shells de Plataforma e Tenant, tema escuro e `Atuar como`.

O produto e a documentação técnica vivem num repositório privado separado.

## Personalização de Tenant

Cada Tenant fornece uma pequena identidade de marca, sem alterar a estrutura do produto:

- **Cor principal** em hexadecimal (`#RRGGBB`). O shell deriva automaticamente a cor de hover, a superfície clara e o fundo escuro da barra lateral.
- **Logótipo horizontal**: SVG preferencialmente (ou PNG transparente), proporção aproximada **4:1**; área de desenho recomendada **300 × 72 px**. No shell é apresentado até **172 × 43 px**.
- **Ícone de marca**: SVG preferencialmente (ou PNG transparente), quadrado; área de desenho recomendada **72 × 72 px**. No menu recolhido é apresentado a **45 × 45 px**.

Os ficheiros devem ter fundo transparente e uma margem de segurança de pelo menos 10%. O exemplo Horizon usa `horizon-logo.svg` e `horizon-mark.svg`.

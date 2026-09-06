# SurveyBenefits — Protótipo público

Protótipo estático da foundation UX/UI M0.5 e dos fluxos aprovados do SurveyBenefits.

- não implementa autenticação, API, base de dados nem persistência real de negócio;
- não recolhe nem envia credenciais;
- usa exclusivamente dados fictícios;
- demonstra landing, autenticação, shells de Plataforma e Tenant, Aparência clara/escura, `Atuar como` e o mockup M1.1 de questionários em preparação.

## M1.1 — Questionário em preparação

O catálogo e o formulário de questionário são apenas uma simulação navegável. Demonstram listagem, pesquisa, estados de interface, criação e edição dos dados base de um rascunho; não guardam questionários nem executam regras de negócio reais.

- catálogo: `questionarios.html?tenant=horizon`;
- criar: `questionario.html?tenant=horizon`;
- editar: `questionario.html?tenant=horizon&id=1`;
- estados alternativos: parâmetro `state` com `empty`, `no-results`, `loading`, `error` ou `forbidden`.
- vista de Responsável por Questionários: `questionarios.html?tenant=horizon&role=owner`.

O produto e a documentação técnica vivem num repositório privado separado.

## Personalização de Tenant

Cada Tenant fornece uma pequena identidade de marca, sem alterar a estrutura do produto. A Aparência (`Sistema`, `Claro`, `Escuro`) é uma preferência pessoal do utilizador autenticado e adapta superfícies neutras; não troca o logótipo nem a cor de marca.

- **Cor principal** em hexadecimal (`#RRGGBB`). É o único input de cor: o shell deriva automaticamente hover, superfícies claras/escuras, seleção, foco e fundos escuros da barra lateral. Não existe cor secundária livre nem CSS enviado pelo Tenant.
- **Logótipo horizontal**: PNG ou WebP transparente, proporção aproximada **4:1**; ficheiro recomendado **600 × 144 px**. No shell é apresentado até **172 × 43 px**.
- **Ícone de marca**: PNG ou WebP transparente, quadrado; ficheiro recomendado **144 × 144 px**. No menu recolhido é apresentado a **45 × 45 px**.

Os ficheiros devem ter fundo transparente e uma margem de segurança de pelo menos 10%. O exemplo Horizon usa SVG apenas por ser um asset estático controlado do protótipo.

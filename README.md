# Konoha Classic — Clean Architecture

SPA React (tema Naruto) em que o Hokage gerencia ninjas da Vila da Folha e missões locais. A API [Dattebayo](https://dattebayo-api.onrender.com) fornece personagens; missões e overrides persistem em `localStorage`.

## Arquitetura

`domain` (entidades, use cases, ports) → `infra` (API, storage, cache) → `presentation` (controllers, páginas React) → `main/factories` (injeção de dependência manual).

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest
npm run build    # dist/ para produção
```

## Rotas

- `/ninjas` — lista de ninjas de Konoha
- `/ninjas/:ninjaId` — detalhe e promoção
- `/missions` — aceitar e concluir missões

Use o botão **Modo Hokage** no header para alternar tema claro/escuro.

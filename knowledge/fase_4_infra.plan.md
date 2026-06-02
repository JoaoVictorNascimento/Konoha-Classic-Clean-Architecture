# Plano de implementação: Fase 4 — Infra (Konoha Classic)

## Visão geral

A Fase 4 conecta o domínio (Fases 1–3) à **API Dattebayo** e à **persistência local** no frontend.

- **Ninjas:** leitura via `/characters`; `save` grava overrides locais (rank, histórico).
- **Missões:** seed inicial + CRUD via `StoragePort` (memória nos testes, `localStorage` no app).

## Decisões de arquitetura

| Decisão | Escolha |
|---------|---------|
| HTTP | axios |
| Base URL | `https://dattebayo-api.onrender.com` |
| Alias | `@/infra/*` |
| ID ninja | `ninja-{externalId}` |
| Vila Konoha | `villageId: 'konoha'` |
| Persistência | StoragePort híbrido |

## Lista de tarefas

- [x] Task 0: Bootstrap infra (axios, alias, pastas)
- [x] Task 1: AxiosClient
- [x] Task 2: StoragePort + adapters
- [x] Task 3: DattebayoTypes + NinjaMapper
- [x] Task 4: ApiNinjaRepository
- [x] Task 5: Seed + ApiMissionRepository
- [x] Task 6: Barrel infra

## Commits sugeridos

1. `chore: add axios and infra layer scaffolding`
2. `feat: add AxiosClient for Dattebayo API`
3. `feat: add StoragePort with memory and localStorage adapters`
4. `feat: add Dattebayo ninja mapper and types`
5. `feat: add ApiNinjaRepository with local overrides`
6. `feat: add ApiMissionRepository with mission seed`

## Fora do escopo

- Controllers (Fase 5), React (Fase 6), factories/DI (Fase 7)

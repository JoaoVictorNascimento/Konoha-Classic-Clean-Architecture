# Plano de implementação: Fase 3 — Use Cases (Konoha Classic)

## Visão geral

A Fase 3 adiciona a **camada de aplicação** em `src/domain/usecases/`: classes que coordenam **repositórios** (Fase 2) e **regras nas entidades** (Fase 1), sem React, Axios ou controllers.

O fluxo do cenário Hokage em `tests/domain/scenarios/hokage-mission-flow.test.ts` será formalizado em `CompleteMissionUseCase`.

**Escopo:** os 4 use cases do roadmap **mais** `GetMissionsUseCase` para suportar "Listar missões" na Fase 6.

## Decisões de arquitetura

| Decisão | Escolha | Rationale |
|---------|---------|-----------|
| Formato | Classes com `execute()` | Roadmap: projeto em classe |
| Injeção | Constructor com interfaces | DI manual na Fase 7 |
| Regras | Nas entidades | Use cases orquestram |
| Not found | `DomainError` | Consistente com o domínio |
| Accept | Validar `ninja.villageId === mission.villageId` | Orquestração entre agregados |
| Testes | Vitest + `InMemory*Repository` | Reutilizar doubles da Fase 2 |

## Estrutura alvo

```
src/domain/usecases/
├── GetNinjasUseCase.ts
├── GetMissionsUseCase.ts
├── PromoteNinjaUseCase.ts
├── AcceptMissionUseCase.ts
├── CompleteMissionUseCase.ts
└── index.ts
tests/domain/usecases/
└── *.test.ts
```

## Contratos dos use cases

### GetNinjasUseCase
- Deps: `NinjaRepository`
- `execute(input?: { villageId?: string }): Promise<Ninja[]>`

### GetMissionsUseCase
- Deps: `MissionRepository`
- `execute(input?: { villageId?: string }): Promise<Mission[]>`

### PromoteNinjaUseCase
- Deps: `NinjaRepository`
- `execute({ ninjaId }): Promise<Ninja>`

### AcceptMissionUseCase
- Deps: `MissionRepository`, `NinjaRepository`
- `execute({ missionId, ninjaId }): Promise<Mission>`
- Valida mesma vila antes de `mission.accept()`

### CompleteMissionUseCase
- Deps: `MissionRepository`, `NinjaRepository`
- `execute({ missionId }): Promise<{ mission: Mission; ninja: Ninja }>`

## Lista de tarefas

- [x] Task 0: Estrutura `domain/usecases`
- [x] Task 1: `GetNinjasUseCase` e `GetMissionsUseCase`
- [x] Task 2: `PromoteNinjaUseCase`
- [x] Task 3: `AcceptMissionUseCase`
- [x] Task 4: `CompleteMissionUseCase`
- [x] Task 5: Barrel exports e `src/main/index.ts`

## Commits sugeridos

1. `feat: add GetNinjasUseCase and GetMissionsUseCase`
2. `feat: add PromoteNinjaUseCase`
3. `feat: add AcceptMissionUseCase`
4. `feat: add CompleteMissionUseCase`
5. `feat: export use cases from domain entry point`

## Fora do escopo

- Infra (Fase 4), Controllers/React (Fases 5–6), DI/factories (Fase 7)

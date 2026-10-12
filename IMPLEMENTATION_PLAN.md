# Supply Chain Production Explorer — plan wdrożenia

## Cel i zakres

Powstanie frontendowy prototyp do analizy produkcji wybranego produktu w krajach świata w okresie 2010–2026. Dane są deterministycznymi danymi testowymi i interfejs musi je wyraźnie oznaczać. Zakres nie obejmuje backendu, autoryzacji, danych rzeczywistych ani płatnych usług mapowych.

Użytkownik może rozpocząć wybór od kraju lub produktu; drugi filtr pokazuje wyłącznie zgodne wartości. Mapa, wykres i podsumowania korzystają z tych samych aktywnych filtrów.

## Ustalenia zgodne z repozytorium

- React, TypeScript, Vite i Tailwind CSS pozostają podstawą aplikacji.
- Struktura komponentów stosuje **Atomic Design** zgodnie z `AGENTS.md`: `atoms`, `molecules`, `organisms`, `templates` i `pages`.
- Lintowanie i formatowanie realizują odpowiednio **Oxlint** i **Oxfmt**. Nie dodajemy ESLint ani Prettier.
- Pakiety instaluje się przez `npm`; aktualizowany jest `package-lock.json`.
- Do testów używamy Vitest, React Testing Library i Playwright.
- MUI Core, MapLibre GL JS, Recharts i Zod mogą zostać dodane dopiero w odpowiedniej fazie, po potwierdzeniu konkretnego zastosowania.

## Docelowa architektura

```text
src/
  app/                         # kompozycja aplikacji i strony
  components/
    atoms/                     # pojedyncze, wielokrotnego użytku elementy
    molecules/                 # małe kompozycje atomów
    organisms/                 # sekcje domenowe, np. filtry i mapa
    templates/                 # układy stron bez konkretnych danych
  hooks/                       # współdzielone hooki React
  features/
    production-explorer/
      data/                    # deterministyczne dane testowe
      model/                   # typy, selektory i reduktor filtrów
      hooks/                   # hooki specyficzne dla eksploratora
      utils/                   # funkcje domenowe, jeśli będą potrzebne
  test/                        # współdzielona konfiguracja testów
  main.tsx
```

Komponenty umieszczamy w katalogach kebab-case i eksportujemy przez `index.ts`. Komponenty opakowujące element DOM używają `forwardRef`, nie udostępniają `className` w natywnych propsach i mają `displayName`.

Logika filtrowania i agregacji pozostaje poza komponentami prezentacyjnymi. Nie przechowujemy wartości pochodnych w stanie React.

## Model i reguły danych

Definiujemy typy `Country`, `Product`, `ProductionRecord` i `ProductionFilters`. Kody krajów są ISO 3166-1 alpha-3. Zbiór rekordów pokrywa lata 2010–2026, zawiera wiele krajów i produktów, częściowe kombinacje oraz zmienne wartości, lecz nie generuje losowych danych podczas renderowania.

Selekory muszą obsługiwać:

- dostępne produkty dla kraju i kraje dla produktu;
- filtrowanie z inkluzywnym zakresem lat;
- agregację po kraju tylko dla zgodnej jednostki;
- serię roczną i wartości podsumowania;
- brak danych odmienny od wartości zero.

Zmiana filtra usuwa niezgodny drugi wybór. Bez wybranego produktu mapa nie sumuje różnych produktów i pokazuje neutralny stan dostępności danych.

## Interfejs i mapa

Widok zawiera nagłówek, filtry kraju i produktu, dostępny zakres lat, reset, mapę z legendą, podsumowania i wykres roczny. Jest responsywny, obsługiwalny z klawiatury i ma czytelne stany ładowania, błędu oraz pustych danych.

Po dodaniu MapLibre mapa pokaże granice państw, sekwencyjną skalę kolorów, legendę, tooltip z krajem/produktem/wartością/jednostką/okresem, kliknięcie krajów i zaznaczenie wybranego kraju. Źródło danych geograficznych, licencja i atrybucja zostaną opisane w README. Obsługa życia mapy i nasłuchiwania zdarzeń nie może powodować zbędnego tworzenia instancji.

## Jakość, testy i automatyzacja

Skrypty jakościowe:

```bash
npm run lint
npm run format:check
npx tsc -b
npm run test
npm run test:coverage
npm run test:e2e
npm run build
```

- Oxlint sprawdza kod, a Oxfmt jego formatowanie.
- Vitest testuje selektory i przejścia stanu: zgodność filtrów, lata graniczne, agregacje, jednostki, brak danych i reset.
- React Testing Library testuje zachowanie filtrów, reset oraz widoczne stany.
- Playwright obejmuje główne ścieżki kraj→produkt, produkt→kraj, zmianę okresu i reset; testy nie mogą zależeć od zewnętrznych kafelków mapy.
- GitHub Actions na `push` i `pull_request` do `main` instaluje zależności przez `npm ci`, uruchamia formatowanie, lint, typy, testy jednostkowe, build i E2E.

## Fazy realizacji

1. **Przygotowanie** — utrzymanie `AGENTS.md`, trzech lokalnych skillów, konfiguracji testów i CI; sprawdzenie bazowych kontroli.
2. **Domena** — typy, deterministyczne dane, selektory, reduktor i testy jednostkowe.
3. **Filtry** — atomy i molekuły filtrów, zakres lat, reset oraz testy komponentowe.
4. **Mapa** — dane geograficzne, integracja MapLibre, legenda, tooltipy, kliknięcia i stany awaryjne.
5. **Dashboard** — organizmy podsumowań i wykresu, szablon oraz konkretna strona responsywna.
6. **Finalizacja** — E2E dla gotowego interfejsu, README, pełne bramki jakości i przegląd różnic.

## Kryteria ukończenia

- Obie kolejności wyboru filtrów działają, a niezgodne kombinacje nie pozostają aktywne.
- Zakres 2010–2026 jest inkluzywny; mapa, wykres i podsumowanie są spójne.
- Brak danych różni się od zera, a jednostki nie są sumowane niepoprawnie.
- Widok jest responsywny i dostępny, a dane testowe są oznaczone.
- Przechodzą: Oxlint, Oxfmt, typy, testy Vitest, build i scenariusze Playwright.
- README opisuje uruchomienie, skrypty, architekturę, reguły agregacji, źródło/atrybucję mapy oraz decyzje techniczne.

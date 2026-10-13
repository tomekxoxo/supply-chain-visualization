# Supply Chain Production Explorer — plan wdrożenia

## Cel i zakres

Powstanie frontendowy prototyp do analizy produkcji wybranego produktu w krajach świata w okresie 2010–2026. Dane są deterministycznymi danymi testowymi i interfejs musi je wyraźnie oznaczać. Zakres nie obejmuje backendu, autoryzacji, danych rzeczywistych ani płatnych usług mapowych.

Użytkownik może rozpocząć wybór od kraju lub produktu; drugi filtr pokazuje wyłącznie zgodne wartości. Mapa, wykres i podsumowania korzystają z tych samych aktywnych filtrów.

## Ustalenia zgodne z repozytorium

- React, TypeScript, Vite i Tailwind CSS pozostają podstawą aplikacji.
- Stosujemy **Atomic Design** dla współdzielonych komponentów w `components/`. To aplikacja z jedną domeną, dlatego jej logika i interfejs należą do `production-explorer/`, bez sztucznego katalogu `features/`.
- Lintowanie i formatowanie realizują odpowiednio **Oxlint** i **Oxfmt**. Nie dodajemy ESLint ani Prettier.
- Pakiety instaluje się przez `yarn`; aktualizowany jest `yarn.lock`.
- Do testów używamy Vitest, React Testing Library i Playwright.
- MUI Core, MapLibre GL JS, Recharts i Zod mogą zostać dodane dopiero w odpowiedniej fazie, po potwierdzeniu konkretnego zastosowania.

## Docelowa architektura

```text
e2e/
  production-explorer/         # scenariusze E2E domeny
  support/                     # współdzielone page objects Playwright

src/
  app/                         # kompozycja aplikacji i strony
  components/
    atoms/                     # pojedyncze, wielokrotnego użytku elementy
    molecules/                 # małe kompozycje atomów
    organisms/                 # sekcje domenowe, np. filtry i mapa
    templates/                 # układy stron bez konkretnych danych
  hooks/                       # współdzielone hooki React
  production-explorer/
    data/                      # deterministyczne dane testowe
    model/                     # typy, selektory i reduktor filtrów
    hooks/                     # hooki specyficzne dla eksploratora
    components/                # filtry, mapa i podsumowania specyficzne dla domeny
  test/                        # współdzielona konfiguracja testów
  main.tsx
```

Komponenty umieszczamy w katalogach kebab-case i eksportujemy przez `index.ts`. Komponenty opakowujące element DOM używają `forwardRef`, nie udostępniają `className` w natywnych propsach i mają `displayName`.

Testy E2E są organizowane według zachowania domeny w `e2e/production-explorer/`. Wspólne lokatory i akcje Playwright trafiają do `e2e/support/`, gdy są używane przez więcej niż jeden scenariusz.

Granica architektury jest jednokierunkowa: `production-explorer/*` może korzystać z `components/*`, lecz współdzielone `components/*` nie importują z domeny. Komponent pozostaje w domenie, dopóki nie jest użyteczny bez jej modelu danych.

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
yarn lint
yarn format:check
yarn tsc -b
yarn test
yarn test:coverage
yarn test:e2e
yarn build
```

- Oxlint sprawdza kod, a Oxfmt jego formatowanie.
- Vitest testuje selektory i przejścia stanu: zgodność filtrów, lata graniczne, agregacje, jednostki, brak danych i reset.
- React Testing Library testuje zachowanie filtrów, reset oraz widoczne stany.
- Playwright obejmuje główne ścieżki kraj→produkt, produkt→kraj, zmianę okresu i reset; testy nie mogą zależeć od zewnętrznych kafelków mapy.
- GitHub Actions na `push` i `pull_request` do `main` instaluje zależności przez `yarn install --frozen-lockfile`, uruchamia formatowanie, lint, typy, testy jednostkowe, build i E2E.

## Fazy realizacji

### Stan na 12 października 2026

Zakończone i zweryfikowane:

- [x] **Przygotowanie** — Yarn 1.22.22 jest przypięty w `package.json`; alias `production-explorer/*` działa w TypeScript, Vite i Vitest; test setup czyści DOM po każdym teście.
- [x] **Domena** — typy, deterministyczne dane testowe 2010–2026, selektory, reduktor filtrów oraz testy jednostkowe.
- [x] **Stan funkcji** — `useProductionExplorer` łączy dane, selektory i reduktor w jedno API dla interfejsu.
- [x] **Filtry** — atomy `Button` i `Select`, domenowy `ProductionFilters`, wybór kraju/produktu/lat, reset oraz testy komponentowe.

Po tych etapach jest 14 testów Vitest. Ostatnio przeszły: `yarn format:check`, `yarn lint`, `yarn tsc -b`, `yarn test` i `yarn build`.

### Kolejne etapy — realizować jako osobne commity

1. **Kompozycja dashboardu**
   - Podłączyć `useProductionExplorer` i `ProductionFilters` w `App`.
   - Dodać semantyczny nagłówek, responsywny kontener oraz wyraźne stany zastępcze dla mapy, wykresu i podsumowań.
   - Nie dodawać jeszcze biblioteki map ani wykresów.
   - Sugerowany commit: `feat(app): compose production explorer dashboard`.

2. **Podsumowania produkcji**
   - Utworzyć domenowy komponent kart: suma, średnia, minimum i maksimum wraz z jednostką.
   - Dla `summary === null` pokazać stan „brak danych”; wartość `0` wyświetlać jako prawidłowy wynik.
   - Dodać testy komponentu.
   - Sugerowany commit: `feat(production-explorer): add production summary cards`.

3. **Wykres roczny**
   - Przed pracą potwierdzić użycie Recharts, zainstalować je przez Yarn i zaktualizować wyłącznie `yarn.lock`.
   - Zbudować wykres z `yearlyProduction`, dostępny opis tekstowy oraz stan braku danych.
   - Sugerowany commit: `feat(production-explorer): add annual production chart`.

4. **Dane geograficzne i mapa bazowa**
   - Przed pracą potwierdzić użycie MapLibre GL JS; dodać zależność przez Yarn.
   - Dodać lokalny, licencjonowany GeoJSON obejmujący kody krajów użyte w danych i udokumentować źródło.
   - Utworzyć mapę z jedną instancją, neutralnym stanem bez produktu, choropleth, legendą i bez zależności od zewnętrznych kafelków w testach.
   - Sugerowany commit: `feat(production-explorer): add production choropleth map`.

5. **Interakcje mapy**
   - Tooltip: kraj, produkt, wartość, jednostka i wybrany okres.
   - Kliknięcie kraju aktualizuje filtr kraju; aktywny kraj jest widocznie zaznaczony.
   - Dodać obsługę błędu inicjalizacji oraz testy logiki niezależne od MapLibre.
   - Sugerowany commit: `feat(production-explorer): add map selection and tooltips`.

6. **Integracja i E2E**
   - Rozszerzyć Playwright o kraj→produkt, produkt→kraj, zmianę zakresu oraz reset.
   - Nie asertywować zewnętrznych kafelków ani renderowania silnika mapy; testować zachowanie filtrów i widoczne dane.
   - Sugerowany commit: `test(e2e): cover production explorer flows`.

7. **Dokumentacja i automatyzacja**
   - Zastąpić README startera dokumentacją aplikacji: Yarn, uruchamianie, architektura, dane testowe, agregacja, mapa i atrybucja.
   - Dodać workflow GitHub Actions z `yarn install --frozen-lockfile`, bramkami jakości i E2E.
   - Sugerowany commit: `docs: document production explorer setup` oraz osobny `ci: add quality workflow`.

## Kryteria ukończenia

- Obie kolejności wyboru filtrów działają, a niezgodne kombinacje nie pozostają aktywne.
- Zakres 2010–2026 jest inkluzywny; mapa, wykres i podsumowanie są spójne.
- Brak danych różni się od zera, a jednostki nie są sumowane niepoprawnie.
- Widok jest responsywny i dostępny, a dane testowe są oznaczone.
- Przechodzą: Oxlint, Oxfmt, typy, testy Vitest, build i scenariusze Playwright.
- README opisuje uruchomienie, skrypty, architekturę, reguły agregacji, źródło/atrybucję mapy oraz decyzje techniczne.

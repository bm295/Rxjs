# RxJS Visual Lab

RxJS Visual Lab is a standalone Angular app for learning how higher-order RxJS mapping operators handle competing outer emissions and inner streams. The app currently focuses on four interactive visualizations:

- **`switchMap` typeahead** — simulates a user typing `COMPLETED`, starts a request for each typed value, and cancels older in-flight requests when the next value arrives.
- **`mergeMap` concurrent typeahead** — simulates a user typing `COMPLETED`, starts a request for each typed value, and lets every request complete concurrently.
- **`exhaustMap` rapid submit** — simulates repeated save-button clicks, accepts the first click while idle, and ignores later clicks until the current request finishes.
- **`concatMap` queued typeahead** — queues each typed value and runs its request only after the previous request completes.

The UI shows each demo as a timeline: outer stream events, inner request progress, canceled or ignored work, and the final subscriber output.

## Tech stack

- Angular standalone components
- Angular control-flow syntax (`@if` / `@for`)
- RxJS timers, higher-order mapping operators, and side-effect hooks
- TypeScript strict mode
- ESLint with Angular ESLint and TypeScript ESLint
- Karma + Jasmine unit tests

## Repository layout

```text
.
├── angular.json                 # Angular CLI build, serve, test, and lint targets
├── package.json                 # npm scripts and dependencies
├── src/
│   ├── main.ts                  # Bootstraps the standalone AppComponent
│   ├── styles.css               # Global document styles
│   └── app/
│       ├── app.component.*      # App shell, demo navigation, UI state, and styles
│       ├── demo-views/          # Per-demo Angular views and templates
│       └── demos/
│           ├── demo.models.ts   # Shared demo types and request phase labels
│           ├── switch-map-demo.ts
│           ├── merge-map-demo.ts
│           ├── concat-map-demo.ts
│           └── exhaust-map-demo.ts
└── tsconfig*.json               # TypeScript and Angular compiler settings
```

## How the demos work

### `switchMap` demo

The `switchMap` demo emits a progressively longer search term on a timer. Each term creates an inner request stream with multiple progress phases. When a new term arrives before the previous request completes, `switchMap` unsubscribes from the previous inner stream, and the UI marks that request as canceled. After typing settles, only the final request can complete and reach the subscriber.

Key files:

- `src/app/demos/switch-map-demo.ts` builds the timed typing stream and `switchMap` request pipeline.
- `src/app/app.component.ts` records typed values, request state, cancellations, and subscriber output.
- `src/app/demo-views/switch-map-demo-view/` renders the typeahead visualization.

### `mergeMap` demo

The `mergeMap` demo uses the same typeahead input pattern as `switchMap`, but it keeps every inner request subscribed. New values do not cancel old work, so multiple requests can progress together and every completed response reaches the subscriber log.

Key files:

- `src/app/demos/merge-map-demo.ts` builds the timed typing stream and `mergeMap` request pipeline.
- `src/app/app.component.ts` records typed values, concurrent request state, and subscriber output.
- `src/app/demo-views/merge-map-demo-view/` renders the concurrent typeahead visualization.

### `exhaustMap` demo

The `exhaustMap` demo emits a scheduled sequence of save clicks. The first click starts an inner request stream. While that request is active, later clicks are recorded as ignored by the visualization and do not create new inner request work. Once the request completes, the next click that arrives while idle can start a new request.

Key files:

- `src/app/demos/exhaust-map-demo.ts` builds the click schedule and `exhaustMap` request pipeline.
- `src/app/app.component.ts` records accepted and ignored clicks, request state, and subscriber output.
- `src/app/demo-views/exhaust-map-demo-view/` renders the rapid-submit visualization.

### `concatMap` demo

The `concatMap` demo uses the typeahead input pattern but queues outer values while an inner request is active. Each request starts only after the previous request completes, so subscriber output preserves source order.

Key files:

- `src/app/demos/concat-map-demo.ts` builds the timed typing stream and sequential `concatMap` request pipeline.
- `src/app/app.component.ts` records typed values, queued request state, and subscriber output.
- `src/app/demo-views/concat-map-demo-view/` renders the queued typeahead visualization.

## Prerequisites

Install Node.js and npm. The project has been verified locally with:

- Node.js `v22.21.0`
- npm `11.6.4`

## Install dependencies

```bash
npm install
```

## Run the app locally

Start the Angular development server:

```bash
npm start
```

Then open:

```text
http://localhost:4200
```

Notes:

- The dev server runs in watch mode and rebuilds when source files change.
- If port `4200` is already in use, Angular CLI may prompt you to choose another port.

## Build

Create a production build:

```bash
npm run build
```

The build output is written to:

```text
dist/typescript001-angular19
```

## Test and lint

Run unit tests once in headless Chrome:

```bash
npm test
```

Run tests in watch mode during development:

```bash
npm run test:watch
```

Lint TypeScript and Angular templates:

```bash
npm run lint
```

## Available npm scripts

| Script | Description |
| --- | --- |
| `npm start` | Runs `ng serve` for local development. |
| `npm run build` | Creates a production build. |
| `npm test` | Runs Karma/Jasmine tests once in Chrome Headless. |
| `npm run test:watch` | Runs Karma/Jasmine tests in watch mode. |
| `npm run lint` | Runs Angular ESLint over app TypeScript and templates. |

## Development notes

- The app uses a standalone root component, so there is no Angular module file.
- Demo logic is kept in `src/app/demos/` to separate RxJS stream behavior from UI rendering.
- Per-demo templates live in `src/app/demo-views/`, keeping `app.component.html` focused on menu and demo selection.
- Request progress is simulated with RxJS `timer` and a shared phase list, not real HTTP calls.
- `resetDemo()` unsubscribes from the current demo subscription so active timers stop when changing demos or resetting the view.

## Local package extraction

`packages/demo-timeline` is a framework-independent extraction from the
operator demos. Build it with `npm run build` from that folder before packaging
or consuming it as a local dependency.

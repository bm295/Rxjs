# RxJS Visual Lab

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

RxJS Visual Lab is a standalone Angular app for learning how higher-order RxJS mapping operators handle competing outer emissions and inner streams. The app currently focuses on four interactive visualizations:

- **`switchMap` typeahead** â€” simulates a user typing `COMPLETED`, starts a request for each typed value, and cancels older in-flight requests when the next value arrives.
- **`mergeMap` concurrent typeahead** â€” simulates a user typing `COMPLETED`, starts a request for each typed value, and lets every request complete concurrently.
- **`exhaustMap` rapid submit** â€” simulates repeated save-button clicks, accepts the first click while idle, and ignores later clicks until the current request finishes.
- **`concatMap` multiple file uploads** - queues a batch of files and uploads each one only after the previous upload completes.

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
â”œâ”€â”€ angular.json                 # Angular CLI build, serve, test, and lint targets
â”œâ”€â”€ package.json                 # npm scripts and dependencies
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ main.ts                  # Bootstraps the standalone AppComponent
â”‚   â”œâ”€â”€ styles.css               # Global document styles
â”‚   â””â”€â”€ app/
â”‚       â”œâ”€â”€ app.component.*      # App shell, demo navigation, UI state, and styles
â”‚       â”œâ”€â”€ demo-views/          # Per-demo Angular views and templates
â”‚       â””â”€â”€ demos/
â”‚           â”œâ”€â”€ demo.models.ts   # Shared demo types and request phase labels
â”‚           â”œâ”€â”€ switch-map-demo.ts
â”‚           â”œâ”€â”€ merge-map-demo.ts
â”‚           â”œâ”€â”€ concat-map-demo.ts
â”‚           â””â”€â”€ exhaust-map-demo.ts
â””â”€â”€ tsconfig*.json               # TypeScript and Angular compiler settings
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

The `concatMap` demo emits a batch of file names together and queues them while an upload is active. Each simulated upload starts only after the previous upload completes, so subscriber output preserves selection order. The UI shows which files are ready, queued, uploading, or uploaded.

Key files:

- `src/app/demos/concat-map-demo.ts` builds the file batch stream and sequential `concatMap` upload pipeline.
- `src/app/demo-views/concat-map-demo-view/` owns the upload configuration, state, subscription lifecycle, and visualization.
- `src/app/app.component.*` only mounts the concatMap component and handles its back-to-menu event; editing this demo does not require changes to the app shell.

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

# RxJS Visual Lab

This repo is a small Angular 19 app that visualizes RxJS behavior. The current screen demonstrates how `switchMap` cancels the previous inner stream when a new outer value arrives.

## Prerequisites

- Node.js
- npm

Verified locally with:

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

- The dev server runs in watch mode, so it rebuilds when you change files.
- If port `4200` is already in use, Angular CLI will ask to use a different port.

## Create a production build

```bash
npm run build
```

The build output is written to:

```text
dist/typescript001-angular19
```

## Lint the code

```bash
npm run lint
```

## Tests

Run the unit tests once in headless Chrome:

```bash
npm test
```

For watch mode during local development:

```bash
npm run test:watch
```

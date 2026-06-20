# RxJS Visualization Product To-Do List

Purpose: make RxJS functions easy to understand by visualizing how values move through streams. The marketable product should include as many RxJS function demos as possible, with each demo documented, named, and easy to test.

## Demo Coverage Roadmap

- [x] Update `src/app/demos/demo.models.ts` to add the `concatMap` operator name.
- [x] Create `src/app/demos/concat-map-demo.ts` for the `concatMap` visualization scenario.
- [x] Create `src/app/demo-views/concat-map-demo-view/concat-map-demo-view.component.ts` for the `concatMap` view component.
- [ ] Create `src/app/demo-views/concat-map-demo-view/concat-map-demo-view.component.html` for the `concatMap` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `concatMap` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `map` operator name.
- [ ] Create `src/app/demos/map-demo.ts` for the `map` visualization scenario.
- [ ] Create `src/app/demo-views/map-demo-view/map-demo-view.component.ts` for the `map` view component.
- [ ] Create `src/app/demo-views/map-demo-view/map-demo-view.component.html` for the `map` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `map` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `filter` operator name.
- [ ] Create `src/app/demos/filter-demo.ts` for the `filter` visualization scenario.
- [ ] Create `src/app/demo-views/filter-demo-view/filter-demo-view.component.ts` for the `filter` view component.
- [ ] Create `src/app/demo-views/filter-demo-view/filter-demo-view.component.html` for the `filter` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `filter` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `debounceTime` operator name.
- [ ] Create `src/app/demos/debounce-time-demo.ts` for the `debounceTime` visualization scenario.
- [ ] Create `src/app/demo-views/debounce-time-demo-view/debounce-time-demo-view.component.ts` for the `debounceTime` view component.
- [ ] Create `src/app/demo-views/debounce-time-demo-view/debounce-time-demo-view.component.html` for the `debounceTime` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `debounceTime` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `throttleTime` operator name.
- [ ] Create `src/app/demos/throttle-time-demo.ts` for the `throttleTime` visualization scenario.
- [ ] Create `src/app/demo-views/throttle-time-demo-view/throttle-time-demo-view.component.ts` for the `throttleTime` view component.
- [ ] Create `src/app/demo-views/throttle-time-demo-view/throttle-time-demo-view.component.html` for the `throttleTime` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `throttleTime` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `combineLatest` operator name.
- [ ] Create `src/app/demos/combine-latest-demo.ts` for the `combineLatest` visualization scenario.
- [ ] Create `src/app/demo-views/combine-latest-demo-view/combine-latest-demo-view.component.ts` for the `combineLatest` view component.
- [ ] Create `src/app/demo-views/combine-latest-demo-view/combine-latest-demo-view.component.html` for the `combineLatest` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `combineLatest` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `zip` operator name.
- [ ] Create `src/app/demos/zip-demo.ts` for the `zip` visualization scenario.
- [ ] Create `src/app/demo-views/zip-demo-view/zip-demo-view.component.ts` for the `zip` view component.
- [ ] Create `src/app/demo-views/zip-demo-view/zip-demo-view.component.html` for the `zip` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `zip` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `forkJoin` operator name.
- [ ] Create `src/app/demos/fork-join-demo.ts` for the `forkJoin` visualization scenario.
- [ ] Create `src/app/demo-views/fork-join-demo-view/fork-join-demo-view.component.ts` for the `forkJoin` view component.
- [ ] Create `src/app/demo-views/fork-join-demo-view/fork-join-demo-view.component.html` for the `forkJoin` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `forkJoin` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `catchError` operator name.
- [ ] Create `src/app/demos/catch-error-demo.ts` for the `catchError` visualization scenario.
- [ ] Create `src/app/demo-views/catch-error-demo-view/catch-error-demo-view.component.ts` for the `catchError` view component.
- [ ] Create `src/app/demo-views/catch-error-demo-view/catch-error-demo-view.component.html` for the `catchError` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `catchError` to the demo menu.
- [ ] Update `src/app/demos/demo.models.ts` to add the `retry` operator name.
- [ ] Create `src/app/demos/retry-demo.ts` for the `retry` visualization scenario.
- [ ] Create `src/app/demo-views/retry-demo-view/retry-demo-view.component.ts` for the `retry` view component.
- [ ] Create `src/app/demo-views/retry-demo-view/retry-demo-view.component.html` for the `retry` explanation and visualization layout.
- [ ] Update `src/app/app.component.ts` to add `retry` to the demo menu.

## Shared Visualization Building Blocks

- [ ] Create `src/app/demo-views/shared/stream-lane.component.ts` for reusable source stream lanes.
- [ ] Create `src/app/demo-views/shared/timeline-marker.component.ts` for reusable emitted value markers.
- [ ] Create `src/app/demo-views/shared/operator-card.component.ts` for reusable operator explanation cards.
- [ ] Create `src/app/demo-views/shared/subscriber-log.component.ts` for reusable subscriber output logs.
- [ ] Update `src/app/app.component.css` with shared class names for stream lanes, value markers, operator cards, and subscriber logs.
- [ ] Update `src/app/demos/demo.models.ts` with shared types for source emissions, transformed emissions, errors, completions, and timeline steps.

## Menu and Discovery

- [ ] Update `src/app/app.component.html` to group demos by RxJS category: transformation, filtering, combination, error handling, and utility.
- [ ] Update `src/app/app.component.ts` to add category metadata for every demo menu item.
- [ ] Update `src/app/app.component.html` to show a short difficulty label for every demo.
- [ ] Update `src/app/app.component.ts` to add difficulty metadata for every demo menu item.
- [ ] Update `src/app/app.component.html` to show a one-line learning goal for every demo.
- [ ] Update `src/app/app.component.ts` to add learning-goal metadata for every demo menu item.

## Demo Explanation Quality

- [ ] Update `src/app/demo-views/switch-map-demo-view/switch-map-demo-view.component.html` to explain when users should choose `switchMap`.
- [ ] Update `src/app/demo-views/merge-map-demo-view/merge-map-demo-view.component.html` to explain when users should choose `mergeMap`.
- [ ] Update `src/app/demo-views/exhaust-map-demo-view/exhaust-map-demo-view.component.html` to explain when users should choose `exhaustMap`.
- [ ] Update every new demo view HTML file with a plain-language description of the source stream.
- [ ] Update every new demo view HTML file with a plain-language description of the operator behavior.
- [ ] Update every new demo view HTML file with a plain-language description of the subscriber output.
- [ ] Update every new demo view HTML file with one real-world use case.

## QA and Release

- [ ] Create `QA_SCENARIOS.md` with one manual QA case for every RxJS demo.
- [ ] Update `QA_SCENARIOS.md` with the expected source emissions for every RxJS demo.
- [ ] Update `QA_SCENARIOS.md` with the expected transformed emissions for every RxJS demo.
- [ ] Update `QA_SCENARIOS.md` with the expected subscriber output for every RxJS demo.
- [ ] Create `docs/screenshots/demo-menu.png` showing the expanded demo menu.
- [ ] Create `docs/screenshots/operator-demo-example.png` showing one completed operator visualization.
- [ ] Update `LAUNCH_CHECKLIST.md` with the build command to run before release.
- [ ] Update `LAUNCH_CHECKLIST.md` with the lint command to run before release.
- [ ] Update `LAUNCH_CHECKLIST.md` with the test command to run before release.

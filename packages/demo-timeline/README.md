# @rxjs-playground/demo-timeline

A framework-independent package extracted from the ordered, step-based flows in
the RxJS operator demos. `selectFirstMatching` selects the first matching rule
and returns a fallback when none matches.

## Local development

Build it before consuming it through a `file:` dependency:

```powershell
npm run build
```

For a portable local installation, create a versioned artifact after building:

```powershell
npm pack --pack-destination <BrowserQuest>/vendor
```

BrowserQuest consumes that tarball and copies its compiled CommonJS output into
an AMD module so RequireJS can load it in the browser.

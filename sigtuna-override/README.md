# Sigtuna overrides

Keep Sigtuna's custom styles here so they can be reviewed separately when updating Origo.
Author styles in SCSS, following the project's `DEVELOPING.md`; do not edit generated CSS.

## Editing styles

- `scss/_infowindow.scss` contains infowindow and sidebar customizations.
- `scss/_legend.scss` contains legend customizations.
- `scss/sigtuna.scss` loads those partials in that order using Sass `@use`.

Preserve the order when adding partials. Scope every override selector to `.o-map`
so these styles only affect elements inside an Origo map. Use the existing component
classes within that scope and avoid adding IDs or deeper selector chains just to
increase priority.

Load `sigtuna.css` after Origo's stylesheet. Within the same cascade layer and
importance level, selector specificity takes precedence over stylesheet order;
the later declaration wins when specificity is equal. Keep selectors only as
specific as needed to override the corresponding Origo rule.

Use normal declarations by default. The highlighted-row selector is already more
specific than Origo's `.o-map .highlighted`, so it does not need `!important`.
The legend search background retains `!important` because Origo's `.awesomplete.black`
and `.awesomplete.grey` backgrounds also use it. Document the competing rule whenever
an `!important` declaration is necessary; do not add it preemptively.

## Separate packages

Origo and Sigtuna are independent npm packages with separate dependencies and lockfiles.
Origo's root scripts compile and copy Origo assets. This package compiles, watches,
and copies only Sigtuna styles. No npm workspace configuration is required.

Run these commands from the repository root:

| Purpose | Origo | Sigtuna |
| --- | --- | --- |
| Install dependencies | `npm ci` | `npm --prefix sigtuna-override ci` |
| Develop | `npm start` | `npm --prefix sigtuna-override start` |
| Production build | `npm run build` | `npm --prefix sigtuna-override run build` |
| Development build | `npm run build-dev` | `npm --prefix sigtuna-override run build-dev` |

Commands can also be run inside this folder without `--prefix sigtuna-override`.

## Compiling and watching

Start the Sigtuna watcher in one terminal:

```sh
npm --prefix sigtuna-override start
```

It compiles `css/sigtuna.css` in this folder and watches the SCSS partials for changes.
Then run Origo's `npm start` in a second terminal to start its server and core watchers.
Both processes are needed when developing the complete Sigtuna application.

To compile Sigtuna styles once without copying, use
`npm --prefix sigtuna-override run build-sass`. The `watch-sass` command exposes the
same watcher used by `start`; it does not update packaged build directories.

For changes limited to this package, use `build-sass` and verify infowindow scrolling,
highlighted rows, expanded groups, and legend search results on both narrow and wide
map views. Check that matching elements outside `.o-map` are unaffected. Do not run
`build` or `build-dev` for a package-only check: those commands also write to Origo's
build directories outside this folder.

The generated CSS, source map, and local `node_modules` are ignored by Git.
The source map embeds its SCSS sources so it also works in copied builds.
The root `index.html` loads this stylesheet after Origo's stylesheet using a path
relative to the application, including when hosted under a subdirectory.

## Packaged builds

Build Origo first, then run the matching Sigtuna build command from the table.
Sigtuna's `build` command compiles its styles and copies them into
`../build/sigtuna-override/css/`; `build-dev` uses `../build-dev/sigtuna-override/css/`.
The target Origo build directory must already exist.

The copy task validates both generated files before copying `sigtuna.css` and
`sigtuna.css.map`. It preserves other Origo assets. SCSS sources, package files,
and this README are not copied.

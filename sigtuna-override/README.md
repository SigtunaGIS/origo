# Sigtuna overrides

Keep Sigtuna's custom styles here so they can be reviewed separately when updating Origo.
Author styles in SCSS, following the project's `DEVELOPING.md`; do not edit generated CSS.

## Editing styles

- `scss/_infowindow.scss` contains infowindow and sidebar customizations.
- `scss/_legend.scss` contains legend customizations.
- `scss/sigtuna.scss` loads those partials in that order using Sass `@use`.

Preserve the order when adding partials. Scope new selectors to `.o-map` where possible
and explain any necessary `!important` declarations. The existing rules are preserved
from the original override styles.

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
this README, and the retained auxiliary HTML and JavaScript files are not copied.

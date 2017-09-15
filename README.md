## Angular Bazel Closure (ABC) Demo Build with AOT and Universal

**This is a demo**. There are a number of temporary patches included to get the browser code building with closure.

* demo is using Angular 5.0.0-beta.7

* server code with AOT and Universal is built with bazel angular ng_module rule and bundled with a demo bazel webpack rule

* browser code has two build options:
  1. `yarn build:webpack` - bazel build with angular ng_module rule and bundled with webpack rule (not minified)
  2. `yarn build:closure` - bazel build with angular ng_module rule and compiled and bundled using closure

### Usage

  * run `yarn install`
  * run either `yarn build:webpack` or `yarn build:closure` (these both build the server bundle as well)
  * run `yarn serve` to serve the app on port 8888
  * run `yarn explore:browser:closure` to launch source-map-explorer on the browser closure built bundle

### Some notes on configuration

* `build_bazel_rules_webpack` is a demo. Code is at https://github.com/gregmagolan/bazel_build_rules_webpack.

* `build_bazel_rules_nodejs` is set to tag _0.1.0_. More recent code breaks.

* `bazel_build_rules_typescript` is pulled from a fork at https://github.com/gregmagolan/rules_typescript.git
  * Patch in here to output ES6 `*.closure.js` files as ES2015 modules instead of CommonJS. Closure build didn't work with CommonJS modules.
  * Patch in here to force the output of the `*.closure.js` files from the ng_module build rule (there is probably a better way to do this but I'm new to bazel)
  * Patch in here to make prod output `*.closure.js` files configurable via `prod_output` rule attribute (so that ES6 build doesn't run for tooling builds as the tooling es6 build fails)
  * Patch in here to prevent tsickle output `.externs.js` from being listed as outputs of ng_module rule (tsickle doesn't run with ng_module)

* Angular bazel rule is pulled from a fork at https://github.com/gregmagolan/bazel-builds.git
  * Patch is needed to work with the latest `bazel_build_rules_typescript` code that is forked

* `postinstall` step runs the `angular-fix-for-closure.sh` script which copies the es2015 angular bundled into folders that closure can find:
  * Angular 5.0.0-beta.7 packages have es2015 bundles under `<package>/esm15/index.js`; script copies these to `@angular/<package>/<package.js>` where closure can find it (along with the `.js.map` files)
  * closure configuration to load `@angular/<package>` is:

```
--js node_modules/@angular/<package>/@angular/<package>.js
--js_module_root=node_modules/@angular/<package>
```

* for closure build, a copy of `bazel-bin` is made at `closure-bin` so a few import fixes can be made
  * ng_module rule outputs the ES6 build files as `*.closure.js` but doesn't modify the imports to match the file names; a replace-in-files script is run to fix these imports in closure-bin before running closure
  * bazel build outputs some angular imports as `node_modules/@angular/<package>/index`; replace-in-files is run to change these to `@angular/<package>` in closure-bin for the closure build

* webpack config for the webpack bazel build rule on the ES5 code has hard-coded aliases to handle the `node_modules/@angular/<package>/index` imports

* Using google closure compiler `20170409.0.0`. Build fails with newer versions.

* Bazel angular ng_module rule doesn't yet work with scss files

---

That's about it. This repo demonstrates that an Angular app with AOT/Universal can be built with Bazel and Closure. Still some work to be done so the patches are not needed and in the future a bazel build rule for the closure build is needed.

Brotli compressed browser bundle built with closure is 33950 bytes.

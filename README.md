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

* `bazel_build_rules_typescript` is pulled from a fork at https://github.com/gregmagolan/rules_typescript.git (tag abc-demo-fixes-2)
  * Patch in here to prevent tsickle output `.externs.js` from being listed as outputs of ng_module rule (tsickle doesn't run with ng_module)

* Angular bazel rule is pulled from a fork at https://github.com/gregmagolan/bazel-builds.git (tag rules-typescript-fix)
  * Patch is needed to work with the latest `bazel_build_rules_typescript` code that is forked

* for closure build, a copy of `bazel-bin` is made at `closure-bin` so a few import fixes can be made
  * ng_module rule outputs the ES6 build files as `*.closure.js` but doesn't modify the imports to match the file names; a replace-in-files script is run to fix these imports in closure-bin before running closure
  * bazel build outputs some angular imports as `node_modules/@angular/<package>/index`; replace-in-files is run to change these to `@angular/<package>` in closure-bin for the closure build

* webpack config for the webpack bazel build rule on the ES5 code has hard-coded aliases to handle the `node_modules/@angular/<package>/index` imports

* Using Alex Eagle's google closure compiler fork `git+https://github.com/alexeagle/closure-compiler.git#packagejson.dist`. Build fails with newer versions.

---

That's about it. This repo demonstrates that an Angular app with AOT/Universal can be built with Bazel and Closure. Still some work to be done so the patches are not needed and in the future the bazel build closure rule needs to work with the ng_module rule.

Brotli compressed browser bundle built with closure is 33950 bytes.

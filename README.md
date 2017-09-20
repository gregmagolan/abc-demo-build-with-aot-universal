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
  * Patch in here to prevent tsickle output `.externs.js` from being listed as outputs of ng_module rule (this output is not produced from the ng_module rule)

* Closure compiler dist is pulled from a forked build at https://github.com/gregmagolan/closure-compiler/tree/20170919.angular.dist
  * Built on fork from branch `angular-closure-fixes` off of the latest closure compiler code as of 2017-09-19 (commit 18ab0a89095f5a193377eba3d398fc1833bd2339)
  * A few patches to the compiler needed to get things working with the latest closure compiler code (Alex Eagle's forked dist at https://github.com/alexeagle/closure-compiler/tree/packagejson.dist was based on an older version of the closure compiler and there have been some regressions for building with Angular since then)

* Angular bazel rule is pulled from a fork at https://github.com/gregmagolan/bazel-builds.git (tag rules-typescript-fix)
  * Patch in here that defined `${name}_tsconfig.json` output needed to work with the latest `bazel_build_rules_typescript` code that is forked

* Using an `es6_consumer` rule by Alex Eagle pulled from https://github.com/gregmagolan/bazel_rules_abc_demo (tag 0.0.1) to act as a consumer of the ES6 outputs from the ng_module rules so that they are generated and available for the closure compiler. In the future, the closure bazel build rule should handle this

* For closure build, a copy of `bazel-bin` is made at `closure-bin` so a few import fixes can be made
  * ng_module rule outputs the ES6 build files as `*.closure.js` but doesn't modify the imports to match the file names; a replace-in-files script is run to fix these imports in closure-bin before running closure
  * bazel build outputs some angular imports as `node_modules/@angular/<package>/index`; replace-in-files is run to change these to `@angular/<package>` in closure-bin for the closure build

* Webpack config for the webpack bazel build rule on the ES5 code has hard-coded aliases to handle the `node_modules/@angular/<package>/index` imports

* Using Alex Eagle's google closure compiler fork `git+https://github.com/alexeagle/closure-compiler.git#packagejson.dist`. Build fails with newer versions.

---

That's about it. This repo demonstrates that an Angular app with AOT/Universal can be built with Bazel and Closure. Still some work to be done so the patches are not needed and in the future the bazel build closure rule needs to work with the ng_module rule.

Brotli compressed browser bundle built with closure is 34866 bytes.

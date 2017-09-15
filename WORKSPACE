load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

git_repository(
  name = "build_bazel_rules_nodejs",
  remote = "https://github.com/bazelbuild/rules_nodejs",
  tag = "0.1.0",
)

git_repository(
  name = "build_bazel_rules_typescript",
  remote = "https://github.com/gregmagolan/rules_typescript.git",
  tag = "abc-demo-fixes-2",
)

git_repository(
  name = "angular",
  remote = "https://github.com/gregmagolan/bazel-builds.git",
  tag = "rules-typescript-fix",
)

git_repository(
  name = "build_bazel_rules_webpack",
  remote = "https://github.com/gregmagolan/bazel_build_rules_webpack",
  tag = "0.0.1",
)

load("@build_bazel_rules_nodejs//:defs.bzl", "node_repositories")
node_repositories(package_json = ["//:package.json"])

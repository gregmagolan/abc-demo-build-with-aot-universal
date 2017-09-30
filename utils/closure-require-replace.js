const replace = require('replace-in-file');
const fs = require('fs');
const path = require('path');

const optionsClosureFixEs2015 = {
  files: [ 'closure-bin/**/*.closure.js' ],
  from: /from ['"][\.\/A-Za-z0-9-_]+['"]\;/g,
  to: (original, ...args) => {
    const file = args.pop();
    if (!file.includes('closure.js')) {
      return original;
    }
    let include = original.replace(/from ['"]/, '').replace(/['"]\;/, '');
    let folder = path.dirname(file);
    let testFile = path.join(path.resolve(), 'closure-bin', include + '.closure.js');
    if (/^\.\//.exec(include) || /^\.\.\//.exec(include)) {
      testFile = path.join(folder, include + '.closure.js');
    }
    if (fs.existsSync(testFile)) {
      let newInclude = include + '.closure';
      console.error(`${file}: ${include} => ${newInclude}`);
      return `from '${newInclude}';`;
    }
    return original;
  },
};

/**
 * For reference. Not used as module output from Bazel has been changed to ES2015.
 */
const optionsClosureFixCommonJs = {
  files: [ 'closure-bin/**/*.closure.js' ],
  from: /require\(['"][\.\/A-Za-z0-9-_]+['"]\)/g,
  to: (original, ...args) => {
    const file = args.pop();
    if (!file.includes('closure.js')) {
      return original;
    }
    let include = original.replace(/require\(['"]/, '').replace(/['"]\)/, '');
    let folder = path.dirname(file);
    let testFile = path.join(path.resolve(), 'closure-bin', include + '.closure.js');
    if (/^\.\//.exec(include) || /^\.\.\//.exec(include)) {
      testFile = path.join(folder, include + '.closure.js');
    }
    if (fs.existsSync(testFile)) {
      let newInclude = include + '.closure';
      console.error(`${file}: ${include} => ${newInclude}`);
      return `require("${newInclude}")`;
    }
    return original;
  },
};

try {
  console.log('Fixing .closure.js imports for closure...')
  let changedFiles = replace.sync(optionsClosureFixEs2015);
  console.log('Modified files:', changedFiles.join(', '));
}
catch (error) {
  console.error('Error occurred:', error);
}

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

const optionsNgFactoryFixEs2015 = {
  files: [ 'closure-bin/**/*.ngfactory.closure.js', 'closure-bin/**/*.ngsummary.closure.js' ],
  from: /from ['"]node_modules\/@angular\/([\.\/A-Za-z0-9-_]+)\/index['"]\;/g,
  to: (match, group, ...args) => {
    const file = args.pop();
    let newImport = `from '@angular/${group}';`;
    console.error(`${file}: ${match} => ${newImport}`);
    return newImport;
  },
}

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

/**
 * For reference. Not used as module output from Bazel has been changed to ES2015.
 */
const optionsNgFactoryFixCommonJs = {
  files: [ 'closure-bin/**/*.ngfactory.closure.js' ],
  from: /require\(['"]node_modules\/@angular\/([\.\/A-Za-z0-9-_]+)\/index['"]\)\;/g,
  to: (match, group, ...args) => {
    const file = args.pop();
    let newImport = `require('@angular/${group}');`;
    console.error(`${file}: ${match} => ${newImport}`);
    return newImport;
  },
}

try {
  console.log('Fixing .closure.js imports for closure...')
  let changedFiles = replace.sync(optionsClosureFixEs2015);
  console.log('Modified files:', changedFiles.join(', '));

  console.log('Fixing Angular imports for closure..')
  changedFiles = replace.sync(optionsNgFactoryFixEs2015);
  console.log('Modified files:', changedFiles.join(', '));
}
catch (error) {
  console.error('Error occurred:', error);
}

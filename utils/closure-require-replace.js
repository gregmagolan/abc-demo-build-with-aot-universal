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
  from: /from ['"]([\.\/A-Za-z0-9-_]+)['"]/g,
  to: (match, group, ...args) => {
    const file = args.pop();
    let folder = path.dirname(file);
    folder = folder.replace(/closure-bin\//, '');
    group = group.replace(folder, '.');
    console.error(`${file}: ${match} => ${group}`);
    return `from '${group}'`;
  },
}

try {
  console.log('Fixing .closure.js imports for closure...')
  let changedFiles = replace.sync(optionsClosureFixEs2015);
  console.log('Modified files:', changedFiles.join(', '));

  console.log('Fixing ambiguous imports for closure..')
  changedFiles = replace.sync(optionsNgFactoryFixEs2015);
  console.log('Modified files:', changedFiles.join(', '));
}
catch (error) {
  console.error('Error occurred:', error);
}

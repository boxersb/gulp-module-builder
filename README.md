[gulp-module-builder]:https://github.com/boxersb/gulp-module-builder.git

# gulp-module-builder

You can write module list file as modules `manifesto` and build by gulp.

## Install

```bash
npm install gulp-module-builder --save-dev
```

## Usage

### Manifesto

[gulp-module-builder] requires specific `manifesto`.
The manifesto follows `json` format and composit by `key-value(array)` pair.
`key` means name of module and `value` means file list as array for member of module.
You can write globbing pattern such as `*` or `**/*` in module list. So, plugin ignores no exist file in manifesto. By default, plugin not allows duplicate in file list.

***Manifesto example (`modules.json`)***:
```js
{
    "simple-module": [
        "./src/foo.js",
        "./src/bar.js",
        "./src/common/namespace.js",
        "./src/common/*.js",
        "./src/service/**/*.js"
    ]
}
```

### Write task

```js
var builder = require('gulp-module-builder');

gulp.task('build', function() {
    gulp.src('./modules.json')
        .pipe(builder())
        .pipe(gulp.dest('./dist/')); // ./dist/simple-module.js file created.
});
```



## Options

[gulp-module-builder] takes some options below.

### cwd
Plugin will parse file path in manifesto relative this `cwd`.
Default value is directory where you performed gulp task.

### encoding
File encoding to read. Default is ``utf8``.

### ext
Extension of built module. Default is ``js``.

### matches
You can assign module name list to build in manifesto.
For instance, you assigned like matches options to `['mymodule']`, plugin will build `mymodule` only. Default is `['*']` and build all modules in manifesto.

### prefix
Prefix of module name.

### separator
Separator between files. Default is `End Of Line` of your OS. (``require('os').EOL``)

### suffix
Suffix of module name.

### unique
You can specify whether plugin allow duplicate file contents in manifesto.
Default is `true`.
When you pass `R` to this option, plugin will merge from rear position.



## LICENSE

Copyright (c) 2014 boxersb <boxersb@gmail.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

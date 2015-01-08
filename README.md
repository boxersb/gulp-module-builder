[gulp-module-builder]:https://github.com/boxersb/gulp-module-builder.git

**[한국어로 보기](korean)**
<a name="english"></a>
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


----

<a name="korean"></a>
## Korean
**[for english](english)**

# gulp-module-builder

파일의 목록을 별도의 선언문(`manifesto`)으로 기술해두고, 해당 선언문을 바탕으로 모듈을 빌드하는 gulp 플러그인이다.

## Install

```bash
npm install gulp-module-builder --save-dev
```

## Usage

### 선언문(`manifesto`)

[gulp-module-builder]는 별도의 선언문(`manifesto`)을 요구한다.  
선언문은 `json` 형식을 따르며, `key-value(array)` 형태로 구성한다. 여기서 `key`는 모듈명을 뜻하며, 배열 형태의 `value`는 해당 모듈을 구성하는 파일들의 목록을 말한다.  
파일의 목록은 `*`나 `**/*`와 같은 globbing 패턴을 사용할 수 있다. 파일의 목록 중 존재하지 않는 파일은 무시되며, 기본적으로는 파일 목록내의 중복을 허용하지 않는다.

***선언문 예제 (`modules.json`)***:
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

### task 작성

```js
var builder = require('gulp-module-builder');

gulp.task('build', function() {
    gulp.src('./modules.json')
        .pipe(builder())
        .pipe(gulp.dest('./dist/')); // ./dist/simple-module.js 파일이 생성된다.
});
```
  
  
  
## Options

[gulp-module-builder]에서는 아래와 같은 옵션을 사용한다.

### cwd
모듈 목록파일에 기술된 파일의 위치를 cwd를 기준으로 해석한다.
기본값은 gulp 빌드를 실행한 디렉토리이다.

### encoding
읽어들일 파일의 인코딩을 지정한다. 기본값은 ``utf8``이다.

### ext
머지된 파일에 사용할 확장명이며, 기본값은 ``js`` 이다.

### matches
선언문에 기술된 모듈 항목들 중 빌드하려는 모듈의 목록을 지정한다.
`['mymodule']` 과 같이 지정하면 선언문 내 `mymodule` 모듈만을 빌드한다.  
기본값은 `['*']` 이며, 선언문 내 모든 모듈을 빌드한다.

### prefix
빌드된 모듈의 모듈명 앞에 붙을 Prefix이다.

### separator
각 파일 사이의 구분자를 설정한다. 기본값은 빌드를 수행하는 시스템의 개행 문자인 ``require('os').EOL`` 이다.

### suffix
빌드된 모듈의 모듈명 뒤에 붙을 Suffix이다.

### unique
하나의 모듈이 될 파일 목록들의 중복을 허용하지 않을지를 결정한다.
기본값은 true이다.
값을 'R'로 지정하면 중복된 파일중 뒤 항목을 우선으로 머지한다.
  
  
  
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

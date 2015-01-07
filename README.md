# gulp-module-builder

> 머지가 필요한 파일들의 목록을 json으로 기술하여 빌드를 수행한다.

[gulp-module-builder]: http://gitlab.map.naver.com/mantle/gulp-module-builder.git

## Getting Started
gulp-module-builder 는 gulp 플러그인이다.
public npm registry에는 등록하지 않았으므로, package.json의 dependencies 절에는 [gulp-module-builder]의 gitlab [URI][gulp-module-builder]를 사용해야한다.

**package.json**

```js
	"devDependencies" : {
		"gulp-module-builder" : "git+http://gitlab.map.naver.com/mantle/gulp-module-builder.git#master"
	}
```

gulp-module-builder를 사용할때는 특정 json 파일에 모듈명과 모듈 구성 목록을 기술해야한다.
해당 json 파일은 JSON5 모듈을 사용하므로, JSON이 아닌 일반 js파일처럼 주석도 사용할 수 있다.

**modules.json**

```js
	{
		module1 : [
			"src/file1.js",
			"src/file2.js"
		],

		module2 : [
			"src/file3.js",
			"src/file4.js"
		],

		module3: [
			"src/module3/**/*.js"
		]
	}
```

먼저, gulpfile.js에 task를 로드해야한다.

```js
	var builder = require('gulp-module-builder');
```

그리고, gulp-module-builder task를 작성한다.

```js
    gulp.task('merge', function() {
        return gulp.src('test/fixtures/modules1.json')
                    .pipe(builder({
                        suffix: '-optioned',
                        ext: 'ts',
                        separator: '\n;\n'
                    }))
                    .pipe('./build');
    });
```

----

## Options
#### separator
각 파일 사이의 구분자를 설정한다. 기본값은 ``os.EOL`` 이다.

#### ext
머지된 파일에 사용할 확장명이며, 기본값은 ``js`` 이다.

#### suffix
빌드된 모듈의 모듈명 뒤에 붙을 Suffix이며, 기본값은 없다.

#### cwd
모듈 목록파일에 기술된 파일의 위치를 cwd를 기준으로 해석한다.
기본값은 프로젝트의 root 디렉토리이다.

```js
	options: {
		cwd: './src'
	}

	// ./src 파일을 root로 인식하여 목록파일을 해석한다.
```

#### unique
하나의 모듈이 될 파일 목록들의 중복을 허용하지 않을지를 결정한다.
기본값은 true이다.
값을 'R'로 지정하면 중복된 파일중 뒤에 온 항목을 우선으로 머지한다.

----

## Release History
* 2014-11-10 v1.0.0
	* iron-modules-concat 에서 포팅

----

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

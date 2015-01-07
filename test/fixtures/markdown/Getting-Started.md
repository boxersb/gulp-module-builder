
## Getting Started

```bash
npm install gulp-module-builder --save-dev
```

### Usage

```js
var builder = require('gulp-module-builder');

gulp.task('build', function() {
    return gulp.src('path/to/manifesto.json')
                .pipe(builder())
                .pipe(gulp.dest('path/to/build'));
});
```

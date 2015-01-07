var gulp = require('gulp'),
    del = require('del'),
    jshint = require('gulp-jshint'),
    runsync = require('run-sequence'),
    mocha = require('gulp-mocha');

var builder = require('./');

gulp.task('clean', function(cb) {
    return del(['./test/build'], cb);
});

gulp.task('lint', function() {
    return gulp.src(['./gulpfile.js', './index.js', './test/test.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('test', function() {
    return gulp.src('./test/test.js')
                .pipe(mocha());
});

gulp.task('testbuild:simple-modules.json', function() {
    return gulp.src('./test/manifesto/simple-modules.json')
                .pipe(builder())
                .pipe(gulp.dest('./test/build'));
});

gulp.task('testbuild:multiple-modules.json', function() {
    return gulp.src('./test/manifesto/multiple-modules.json')
                .pipe(builder({
                    cwd: './test/fixtures/',
                    prefix: 'test-',
                    suffix: '.latest'
                }))
                .pipe(gulp.dest('./test/build'));
});

gulp.task('testbuild:another-modules.json', function() {
    return gulp.src('./test/manifesto/another-modules.json')
                .pipe(builder({
                    cwd: './test/fixtures/'
                }))
                .pipe(gulp.dest('./test/build'));
});

gulp.task('testbuild:globable-modules.json', function() {
    var EOL = require('os').EOL;

    return gulp.src('./test/manifesto/globable-modules.json')
                .pipe(builder({
                    cwd: './test/fixtures/',
                    ext: 'md',
                    separator: EOL +'----'+ EOL
                }))
                .pipe(gulp.dest('./test/build'));
});

gulp.task('testbuild', function(done) {
    runsync('clean', [
        'testbuild:simple-modules.json',
        'testbuild:multiple-modules.json',
        'testbuild:another-modules.json',
        'testbuild:globable-modules.json'], done);
});

gulp.task('default', function(done) {
    runsync('lint', 'test', 'testbuild', done);
});

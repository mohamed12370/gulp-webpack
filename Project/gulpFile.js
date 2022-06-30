const gulp = require('gulp');
const { src, dest, watch, parallel, series } = require('gulp');

const imagemin = require('gulp-imagemin');

function imgMinify() {
    return gulp.src('image/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
}

//exports.default = imgMinify;

const concat = require('gulp-concat');
const terser = require('gulp-terser');

function jsMinify() {
    return src('filejs/*.js', { sourcemaps: true })
        .pipe(concat('all.min.js'))
        .pipe(terser())
        .pipe(dest('dist/assets/js', { sourcemaps: '.' }));
}
//exports.default  = jsMinify;

const cleanCss = require('gulp-clean-css');

function cssMin() {
    return src('style/*.css')
        .pipe(concat('style.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'));
}
//exports.default = cssMin;

const htmlmin = require('gulp-htmlmin');

function minifyHTML() {
    return src('./*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'));
}

var browserSync = require('browser-sync');

function serve(cb) {
    browserSync({
        server: {
            baseDir: 'dist/',
        },
    });
    cb();
}

function reloadTask(cb) {
    browserSync.reload();

    cb();
}

function watchTask() {
    watch('/*.html', series(minifyHTML, reloadTask));
    watch('filejs/**/*.js', series(jsMinify, reloadTask));
    watch(['style/**/*.css'], series(cssMin, reloadTask));
}
exports.default = series(
    parallel(imgMinify, jsMinify, minifyHTML),
    serve,
    watchTask
);
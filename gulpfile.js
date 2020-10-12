'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var cssnano = require('gulp-cssnano')
var htmlmin = require('gulp-htmlmin')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')

var htmlDir = './src/*.html'
var scssDir = './src/scss/**/*.scss'
var jsDir = './src/js/**/*.js'

function minifyHtml(cb) {
  gulp
    .src(htmlDir)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./build'))

  cb()
}

function minifyCss(cb) {
  gulp
    .src(scssDir)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'))

  cb()
}

function minifyJs(cb) {
  gulp
    .src(jsDir)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/js'))

  cb()
}

function start(cb) {
  gulp.watch(
    [htmlDir, scssDir, jsDir],
    gulp.parallel(minifyHtml, minifyCss, minifyJs),
  )

  cb()
}

exports.build = gulp.parallel(minifyHtml, minifyCss, minifyJs)
exports.start = start

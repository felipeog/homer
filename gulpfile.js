'use strict'

var autoprefixer = require('gulp-autoprefixer')
var babel = require('gulp-babel')
var browserSync = require('browser-sync')
var cssnano = require('gulp-cssnano')
var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')

// consts
var htmlDir = './src/*.html'
var jsDir = './src/js/**/*.js'
var scssDir = './src/scss/**/*.scss'

// minifiers
function minifyHtml(cb) {
  gulp
    .src(htmlDir)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream())

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
    .pipe(browserSync.stream())

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
    .pipe(browserSync.stream())

  cb()
}

// exports
function build(cb) {
  gulp.parallel(minifyHtml, minifyCss, minifyJs)

  cb()
}

function start(cb) {
  browserSync.init({
    server: './build',
  })

  gulp.watch(htmlDir, minifyHtml)
  gulp.watch(scssDir, minifyCss)
  gulp.watch(jsDir, minifyJs)
  gulp.watch([htmlDir, scssDir, jsDir]).on('change', browserSync.reload)

  cb()
}

exports.build = build
exports.start = start

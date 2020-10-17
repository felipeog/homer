'use strict'

var autoprefixer = require('autoprefixer')
var babel = require('gulp-babel')
var browserSync = require('browser-sync')
var cssnano = require('cssnano')
var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')
var postcss = require('gulp-postcss')
var pug = require('gulp-pug')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')

// consts
var htmlDir = './src/pug/**/*.pug'
var jsDir = './src/js/**/*.js'
var scssDir = './src/scss/**/*.scss'

// build
function buildHTML(cb) {
  var htmlminOptions = { collapseWhitespace: true, removeComments: true }

  gulp
    .src(htmlDir)
    .pipe(pug())
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream())

  cb()
}

function buildJS(cb) {
  var babelOptions = {
    presets: ['@babel/env'],
  }

  gulp
    .src(jsDir)
    .pipe(sourcemaps.init())
    .pipe(babel(babelOptions))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())

  cb()
}

function buildCSS(cb) {
  var postcssPlugins = [autoprefixer(), cssnano()]

  gulp
    .src(scssDir)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())

  cb()
}

// functions
function start(cb) {
  var browserSyncOptions = {
    server: './build',
  }

  browserSync.init(browserSyncOptions)

  gulp.watch(htmlDir, buildHTML)
  gulp.watch(scssDir, buildCSS)
  gulp.watch(jsDir, buildJS)
  gulp.watch([htmlDir, scssDir, jsDir]).on('change', browserSync.reload)

  cb()
}

// exports
exports.build = gulp.parallel(buildHTML, buildCSS, buildJS)
exports.start = start

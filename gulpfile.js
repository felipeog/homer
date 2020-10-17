'use strict'

var autoprefixer = require('autoprefixer')
var babel = require('gulp-babel')
var browserSync = require('browser-sync')
var cssnano = require('cssnano')
var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')
var postcss = require('gulp-postcss')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var uglify = require('gulp-uglify')

// consts
var htmlDir = './src/*.html'
var jsDir = './src/js/**/*.js'
var scssDir = './src/scss/**/*.scss'

// minifiers
function minifyHtml(cb) {
  var htmlminOptions = { collapseWhitespace: true, removeComments: true }

  gulp
    .src(htmlDir)
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream())

  cb()
}

function minifyJs(cb) {
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

function minifyCss(cb) {
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

// exports
function start(cb) {
  var browserSyncOptions = {
    server: './build',
  }

  browserSync.init(browserSyncOptions)

  gulp.watch(htmlDir, minifyHtml)
  gulp.watch(scssDir, minifyCss)
  gulp.watch(jsDir, minifyJs)
  gulp.watch([htmlDir, scssDir, jsDir]).on('change', browserSync.reload)

  cb()
}

exports.build = gulp.parallel(minifyHtml, minifyCss, minifyJs)
exports.start = start

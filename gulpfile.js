const {src, dest, watch, series, parallel} = require('gulp');

const HTMLMin           = require('gulp-htmlmin');
const concat            = require('gulp-concat');
const autoprefixer      = require('gulp-autoprefixer');
const cleanCSS          = require('gulp-clean-css');
const sourcemaps        = require('gulp-sourcemaps');
const browserSync       = require('browser-sync').create();
const del               = require('del');
const gulpIf            = require('gulp-if');
const sprite            = require('gulp-svg-sprite');
const image             = require('gulp-image');
const babel             = require('gulp-babel');
const notify            = require('gulp-notify');
const uglify            = require('gulp-uglify-es').default;
const sass              = require('gulp-sass')(require('sass'));
const groupMediaQueries = require('gulp-group-css-media-queries');
const pug               = require('gulp-pug');
const pugbem            = require('gulp-pugbem');

const isProd = process.argv.includes('prod');
const isDev  = !isProd;

const html = () => {
  return src('./dev/index.html')
    .pipe(HTMLMin({ collapseWhitespace: true }))
    .pipe(gulpIf(isProd, dest('./build')))
    .pipe(browserSync.stream())
}
const getpug = () => {
  return src('./src/pug/index.pug')
    .pipe(pug({
      pretty: true,
      plugins: [pugbem]
    }))
    .pipe(dest('./dev'))
}

const styles = () => {
  return src('./src/scss/main.scss')
  .pipe(gulpIf(isDev, sourcemaps.init(undefined)))
  .pipe(sass())
  .pipe(concat('style.css'))
  .pipe(autoprefixer({overrideBrowserslist: ['last 5 versions']}))
  .pipe(groupMediaQueries())
  .pipe(gulpIf(isProd, cleanCSS({ level: 1 } ))).on('error', notify.onError({
      title: 'Minification error',
      message: 'Error: <%= error.message %>',
    }))
  .pipe(gulpIf(isDev, sourcemaps.write(undefined, undefined)))
  .pipe(gulpIf(isDev, dest('./dev/css')))
  .pipe(gulpIf(isProd, dest('./build/css')))
  .pipe(browserSync.stream())
}

const svgSprites = () => {
  return src('src/img/svg/**/*.svg')
  .pipe(sprite({
    mode: {
      stack: {
        sprite: '../sprite.svg'
      }
    }
  }))
  .pipe(gulpIf(isDev, dest('./dev/img')))
  .pipe(gulpIf(isProd, dest('./build/img')))
}

const images = () => {
  return src([
    './src/img/**/*.jpg',
    './src/img/**/*.jpeg',
    './src/img/**/*.png',
    './src/img/**/*.svg',
  ])
  .pipe(gulpIf(isDev, dest('./dev/img')))
  .pipe(gulpIf(isProd, image()))
  .pipe(gulpIf(isProd, dest('./build/img')))
}

const scripts = () => {
  return src([
    'src/js/modules/**/*.js',
    'src/js/main.js'
  ])
  .pipe(gulpIf(isDev, sourcemaps.init(undefined)))
  .pipe(concat('main.js'))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(gulpIf(isDev, sourcemaps.write(undefined, undefined)))
  .pipe(dest('./dev/js'))
  .pipe(gulpIf(isProd, uglify().on('error', notify.onError())))
  .pipe(gulpIf(isProd, dest('./build/js')))
  .pipe(browserSync.stream())
}

const resources = () => {
  return src('./src/assets/**/*')
  .pipe(gulpIf(isDev, dest('./dev/assets')))
  .pipe(gulpIf(isProd, dest('./build/assets')))
}

const favicon = () => {
  return src('./src/favicon.ico')
    .pipe(gulpIf(isDev, dest('./dev')))
    .pipe(gulpIf(isProd, dest('./build')))
}

const watchFiles = () => {
  browserSync.init({
      server: {
        baseDir: './dev'
      }
    });
  watch('./dev/index.html', html);
  watch('./src/scss/**/*.scss', styles);
  watch('./src/img/svg/**/*.svg', svgSprites);
  watch('./src/js/**/*.js', scripts);
  watch('./src/lib/**', resources);
  watch('./src/pug/**/*.pug', getpug);
}

const clean = () => del('./build')

exports.clean        = clean;
exports.html         = html;
exports.styles       = styles;
exports.svgSprites   = svgSprites;
exports.images       = images;
exports.scripts      = scripts;
exports.resources    = resources;
exports.favicon      = favicon;
exports.getpug       = getpug;

exports.dev  = parallel(getpug, styles, images, scripts, svgSprites, resources, favicon, watchFiles);
exports.prod = series(clean, html, styles, images, scripts, resources, svgSprites, favicon);

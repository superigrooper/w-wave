const { src, dest, series, watch, parallel } = require('gulp')
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const image = require('gulp-image');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const gulpif = require('gulp-if');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const pugbem = require('gulp-pugbem');

const isProd = process.argv.includes('--prod');
const isDev = !isProd;
console.log(isProd);

// clean
const clean = () => {
  return del(['./dist'])
}

const getpug = () => {
  return src('./src/pug/index.pug')
    .pipe(pug({
      pretty: true,
      plugins: [pugbem]
    }))
    .pipe(dest('./src'))
}

// styles
const styles = () => {
  return src('./src/scss/main.sass')
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(autoprefixer({ 
        overrideBrowserslist: ['last 10 versions'],
        grid: true 
      }
    ))
    .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulpif(isDev, dest('./src/css')))
    .pipe(gulpif(isProd, dest('./dist/css')))
    .pipe(browserSync.stream())
}

// htmlmin
const html = () => {
  return src('./src/index.html')
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulpif(isProd, dest('./dist')))
    .pipe(browserSync.stream())
}

// images
const images = () => {
  return src([
    './src/img/**/*.jpg',
    './src/img/**/*.jpeg',
    './src/img/**/*.png',
    './src/img/**/*.svg',
  ])
  .pipe(image())
  .pipe(dest('./dist/img'))
}

// scriprs
const scripts = () => {
  return src('./src/js/modules/**/*.js')
  .pipe(gulpif(isDev, sourcemaps.init()))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('main.min.js'))
  .pipe(uglify().on('error', notify.onError()))
  .pipe(gulpif(isDev, sourcemaps.write()))
  .pipe(gulpif(isDev, dest('./src/js')))
  .pipe(gulpif(isProd, dest('./dist/js')))
  .pipe(browserSync.stream())
}

// resources
const libs = () => {
  return src('./src/libs/**/*')
    .pipe(dest('./dist/libs'))
}

const fonts = () => {
  return src('./src/fonts/**/*')
    .pipe(dest('./dist/fonts'))
}

// icons
const icons = () => {
  return src('./src/img/icons/**/*')
    .pipe(dest('./dist/img/icons'))
}

// favicon
const favicon = () => {
  return src('./src/favicon.ico')
    .pipe(dest('./dist'))
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './src'
    }
  });
  watch('./src/**/*.html', html);
  watch('./src/scss/**/*.sass', styles)
  watch(['./src/js/**/*.js', '!./src/js/*.min.js'], scripts);
  // gulpif(prod, watch('./src/img/**/*', images));
  watch('./src/pug/**/*.pug', getpug);
}

exports.styles = styles;
exports.html = html;
exports.scripts = scripts;
exports.images = images;
exports.clean = clean;
exports.getpug = getpug;

// run gulp --prod
exports.default = series(clean, styles, html, scripts, libs, icons, fonts, favicon, images);

// run gulp dev
exports.dev = parallel(getpug, html, styles, scripts, watchFiles);

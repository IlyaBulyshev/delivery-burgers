const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-csso');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const runSequence = require('run-sequence');

//configuration
const isDevelopment = false;

const moduleJS  = [
  'app/js/main.js'
];

const vendorJS = [
  'app/js/jquery.fancybox.min.js',
  'jquery.inputmask.bundle.js'
];


//start server
gulp.task('browser-sync', ['html', 'fonts', 'images', 'style', 'build:js', 'vendor:js'], function() {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});
// watch and reload
	browserSync.watch(['./dist/**/*.*', '!**/*.css',],  browserSync.reload);
});

// pipe html
gulp.task('html', function () {
	return gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
});

//pipe fonts
gulp.task('fonts', function () {
	return gulp.src('app/fonts/**/*.*')
	.pipe(gulp.dest('dist/fonts'));
});

//pipe and optimization images
gulp.task('images', function () {
	return gulp.src('app/img/**/*.{png,svg,jpg}')
	.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
	.pipe(gulp.dest('dist/img'));
});


//pipe styles
gulp.task('style', function () {
	return gulp.src(['app/css/main.scss'])
	.pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {title: 'Style', message: err.message}
      })
    }))
	.pipe(gulpIf(isDevelopment, sourcemaps.init()))
	.pipe(sass())
	.pipe(autoprefixer('last 2 versions'))
	.pipe(minifycss())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulpIf(isDevelopment, sourcemaps.write('maps')))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.stream())
});

// Scripts JS
gulp.task('build:js', function() {
  return gulp.src(moduleJS)
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {title: 'javaScript', message: err.message}
      })
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  	.pipe(concat('main.min.js'))
	  .pipe(uglify())
    .pipe(gulpIf(isDevelopment, sourcemaps.write('maps')))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('vendor:js', function () {
  return gulp
    .src(vendorJS)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/js'));
});

//watch
gulp.task('watch', function(){
	gulp.watch('app/*.html', ['html']);
	gulp.watch('app/css/**/*.scss', ['style']);
	gulp.watch('app/img/**/*.*', ['imges']);
	gulp.watch('app/js/*.js', ['build:js']);
});

gulp.task('default', ['browser-sync', 'watch']);


// clean dist
gulp.task('clean', function () {
  return del(['dist'], {force: true}).then(paths => {
    console.log('Deleted files and folders: in dist');
  });
});

//perform build project
gulp.task('build', function (callback) {
  runSequence(['clean'], [
    'html',
    'styles',
    'images',
    'build:js',
    'vendor:js',
    'vendor:css',
    'fonts'
  ], callback);
});
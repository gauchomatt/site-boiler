var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var fileinclude = require('gulp-file-include');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');


// Compiles HTML with its partials in build/index.html.
gulp.task('html', function() {
  return gulp.src('index.html')
    .pipe(fileinclude({
      prefix: '@',
      basepath: 'partials'
    }))
    .pipe(gulp.dest('./build/'))
    .pipe(notify('HTML updated'));
});

// Compiles SASS and saves the CSS in build/assets/css.
gulp.task('sass', function() {
  return gulp.src('assets/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/assets/css'))
    .pipe(browserSync.stream())
    .pipe(notify('CSS updated'));
});

// Minifies the images in build/assets/images
gulp.task('images', function() {
  return gulp.src('assets/images/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
    }))
    .pipe(gulp.dest('./build/assets/images'))
    .pipe(notify('Images updated'));
});

gulp.task('watch', ['html', 'images', 'sass'], function() {
  // Start browser-sync serving our root directory.
  // This will make index.html be the root of the site.
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });

  // Reload the browser whenever a HTML file changes.
  gulp.watch('build/index.html').on('change', browserSync.reload);
  gulp.watch('partials/*.html', ['html']);
  gulp.watch('index.html', ['html']);

  // Reload the browser whenever a SCSS file changes.
  gulp.watch('assets/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);
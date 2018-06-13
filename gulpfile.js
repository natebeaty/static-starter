// ‘cosm gulpin’
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cssnano      = require('gulp-cssnano');
var include      = require('gulp-include');
var rev          = require('gulp-rev');
var sourcemaps   = require('gulp-sourcemaps');
var runSequence  = require('run-sequence');
var argv         = require('minimist')(process.argv.slice(2));
var notify       = require('gulp-notify');
var svgstore     = require('gulp-svgstore');
var svgmin       = require('gulp-svgmin');
var rename       = require('gulp-rename');
var browserSync  = require('browser-sync').create();
var isProduction = argv.production;

// SVGs to defs
gulp.task('svgs', function() {
  return gulp.src('assets/svgs/*.svg')
    .pipe(svgmin({
        plugins: [
        { removeViewBox: false },
        { removeEmptyAttrs: false },
        { mergePaths: false },
        { removeAttrs: {
            attrs: ['stroke', 'fill-rule']
          }
        },
        { cleanupIDs: false }]
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename({suffix: '-defs'}))
    .pipe(gulp.dest('assets/dist/'));
});

// smash CSS!
gulp.task('styles', function() {
  return gulp.src([
      'assets/sass/main.scss'
    ])
    .pipe(sass())
    .on('error', notify.onError(function (error) {
       return 'Style smash error!' + error;
    }))
    .pipe(autoprefixer())
    .pipe(gulpif(isProduction, cssnano()))
    .pipe(gulp.dest('assets/dist/css'))
    .pipe(browserSync.stream());
    // .pipe(notify({message: 'Styles smashed.', onLast: true}));
});

// smash javascript!
gulp.task('scripts', function() {
  return gulp.src([
      'assets/js/main.js'
    ])
    .pipe(include())
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(uglify())
    .on('error', notify.onError(function (error) {
       return 'Script smash error!' + error;
    }))
    .pipe(gulp.dest('assets/dist/js'))
    .pipe(gulpif(!isProduction, sourcemaps.write('maps')))
    .pipe(gulpif(!isProduction, gulp.dest('assets/dist/js')))
    .pipe(notify({message: 'Scripts smashed.', onLast: true}));
});

// revision files for production assets
gulp.task('rev', function() {
  return gulp.src(['assets/css/**/*.css', 'assets/js/**/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('assets/dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist'));
});

// folders to watch for changes
gulp.task('watch', ['styles', 'scripts', 'svgs'], function() {
  browserSync.init({
    files: ['*.html'],
    notify: false
  });

  gulp.watch('assets/sass/*.scss', ['styles']);
  gulp.watch('assets/sass/**/*.scss', ['styles']);
  gulp.watch('assets/js/*.js', ['scripts']);
  gulp.watch('assets/js/**/*.js', ['scripts']);
  gulp.watch('assets/svgs/*.svg', ['svgs']);
});

// `gulp clean` - Deletes the build folder entirely.
gulp.task('clean', require('del').bind(null, ['assets/dist']));

// `gulp build` - Run all the build tasks but don't clean up beforehand.
gulp.task('build', function(callback) {
  if (isProduction) {
    // production gulpin' (with revisions)
    runSequence(
      'clean',
      ['styles', 'scripts', 'svgs'],
      'rev',
      callback
    );
  } else {
    // dev gulpin'
    runSequence(
      'clean',
      ['styles', 'scripts', 'svgs'],
      callback
    );
  }
});

// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task('default', function() {
  gulp.start('build');
});

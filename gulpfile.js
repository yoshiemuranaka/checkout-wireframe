var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var panini = require('panini');
var del = require('del');
var newer = require('gulp-newer');
var svgmin = require('gulp-svgmin');
var browserSync = require('browser-sync').create();

var paths = {
  images: 'src/resources/images/**/*',
  scss: 'src/resources/scss/*',
  html: 'src/{layouts,partials,pages,helpers,data}/**/*'
};

/*
Tasks for cleaning dist folder
*/
gulp.task('clean:all', function () {
  return del([
    'dist/**/*',
  ]);
});
gulp.task('clean:images', function () {
  return del([
    'dist/images/**/*',
  ]);
});

/*
Task for compiling Sass files
*/
gulp.task('build:css', function () {
  return sass(paths.scss, {
  	sourcemap: false, 
  	noCache: true,
  	style: 'compressed'
  })
  .on('error', sass.logError)
  .pipe(gulp.dest('dist/stylesheets'))
  .pipe(browserSync.stream());
});

/*
Task to compile HTML
*/
gulp.task('build:html', function() {
  gulp.src('src/pages/**/*.html')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      helpers: 'src/helpers/',
      data: 'src/data/'
    }))
    .pipe(gulp.dest('dist'))
    .on('finish', browserSync.reload);
});

/*
Task to optimize svgs and copy images
*/
gulp.task('build:svg', function(){
  gulp.src('src/resources/images/*.svg')
  .pipe(newer('dist/images'))
  .pipe(svgmin())
  .pipe(gulp.dest('dist/images'));
})
gulp.task('move:img', ['build:svg'], function() {
   gulp.src('src/resources/images/**/*.{jpg,png}')
   .pipe(newer('dist/images'))
   .pipe(gulp.dest('dist/images'));
});

gulp.task('serve', function() {
    browserSync.init({
        proxy: "localhost:8888/checkout/dist"
    });
});

gulp.task('watch', function() {
  gulp.watch(paths.scss, ['build:css']);
  gulp.watch(paths.html, ['build:html']);
  gulp.watch(paths.images, ['move:img']);
});

gulp.task('default', ['build:css', 'build:html', 'move:img', 'serve', 'watch']);


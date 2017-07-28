// Create Variables
var gulp            = require('gulp')
var $               = require('gulp-load-plugins')();
var mainBowerFiles  = require('main-bower-files');
var browserSync     = require('browser-sync').create();
var runSequence     = require('run-sequence');
var del             = require('del');

// Task for SASS files. In this task the files are minimized and saved in build/css folder with .css extension
gulp.task('scss', ['pug'], function () {
	return gulp.src('app/assets/scss/**/*.scss')
	.pipe($.sass().on('error', $.sass.logError))
	.pipe($.autoprefixer({
		browsers: ['last 5 versions'],
		cascade: true
	}))
	.pipe($.cleanCss({compatibility: 'ie8'}))
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream());
});

// Task for JS files. In this task the files are minimized and saved in build/js folder
gulp.task('js', ['pug'], function() {
	return gulp.src('app/assets/js/*.js')
    .pipe($.uglify())
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.stream());
});

// Task for PUG files. In this task the files are saved with .html extension
gulp.task('pug', () =>
	gulp.src(['app/assets/pug/**/*.pug','!app/assets/pug/partials/*'])
	.pipe($.changed('build', {extension: '.html', hasChanged: $.changed.compareContents}))
	.pipe($.plumber())
	.pipe($.pug({
		pretty: true
	}))
	.pipe(gulp.dest('build'))
	.pipe(browserSync.stream())
	);

// Task for IMAGE files. In this task the files are reduced and saved in build/img folder
gulp.task('image', () =>
	gulp.src('build/images/**/*')
	.pipe($.imagemin({
		progressive: true,
		optimizationLevel: 5,
	}))
	.pipe(gulp.dest('build/images'))
	);

// Task SERVE. Init Browser Sync
gulp.task('serve', () => {
    browserSync.init({
        server: "build"
    });

    gulp.watch('app/assets/pug/**/*.pug', ['pug']);
    gulp.watch('app/assets/js/*.js', ['js']);  
    gulp.watch('app/assets/scss/**/*.scss', ['scss']);
});

// Task for BOWER files. In this task the files are saved in app/assets/vendor
gulp.task('bower', () => {
    return gulp.src(mainBowerFiles(), { base: 'bower_components' })
      .pipe(gulp.dest('app/assets/vendor'))
});

// Task for VENDOR JS files. In this task the files are minimized and saved in build/js folder
gulp.task('vendor-js', () => {
  return gulp.src(['app/assets/vendor/jquery/**/*.js', 'app/assets/vendor/**/*.js'])
      .pipe($.concat('vendor.js'))
      .pipe($.uglify())
      .pipe(gulp.dest('build/js'))
});

// Task for VENDOR CSS files. In this task the files are minimized and saved in build/css folder
gulp.task('vendor-css', () => {
  return gulp.src('app/assets/vendor/**/*.css')
      .pipe($.concat('vendor.css'))
      .pipe($.cleanCss({compatibility: 'ie8'}))
      .pipe(gulp.dest('build/css'))
});

// Task INJECT
gulp.task('inject', () => {
     runSequence('bower', ['vendor-js', 'vendor-css']);
});

// Task for FONT files. In this task the files in bower_components are saved in build/fonts folder
gulp.task('font', function() {
	return gulp.src(['bower_components/**/fonts/*.eot', 'bower_components/**/fonts/*.woff', 'bower_components/**/fonts/*.svg', 'bower_components/**/fonts/*.ttf'])
	.pipe($.flatten())
	.pipe(gulp.dest('build/fonts'))
});

// Task for EXTRAS files. In this task the files are saved in build folder
gulp.task('extras' , () => {
  return gulp.src(['app/*.*', 'app/.htaccess'])
      .pipe(gulp.dest('build'))
});

// Task for REV and CLEAN files.
gulp.task('rev', ['clean'], () => {
    gulp.src(['build/**/*', 'build/*.html'])
    .pipe($.revAll.revision({
        dontRenameFile:['.html'], debug:true,
        hashLength: 4,
        dontGlobal: ['css/vendor.css','js/vendor.js', '.json', '.txt'],
    }))
    .pipe(gulp.dest('build'))
    .pipe($.revAll.manifestFile())
    .pipe(gulp.dest('build'));

});

gulp.task('clean', ['pug'], () => {
  return del('build/**/*.*.*')
})

// Task DEFAULT. This task creates build folder
gulp.task('default', ['scss', 'js', 'pug', 'font', 'serve', 'inject']);

// Task BUILD. This task insert image folder and extras files in build folder
gulp.task('build', ['image', 'extras', 'rev']);
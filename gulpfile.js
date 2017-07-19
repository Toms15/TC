var gulp 			= require('gulp');
var $ 				= require('gulp-load-plugins')();
var bs 				= require("browser-sync").create();

gulp.task('sass', function () {
	return gulp.src('app/assets/scss/**/*.scss')
	.pipe($.sass().on('error', $.sass.logError))
	.pipe($.autoprefixer({
		browsers: ['last 2 versions'],
		cascade: true
	}))
	.pipe($.cleanCss({compatibility: 'ie8'}))
	.pipe(gulp.dest('build/css'))
	.pipe(bs.stream());
});

gulp.task('js', function() {
	return gulp.src('app/assets/js/*.js')
    .pipe($.uglify())
	.pipe(gulp.dest('build/js'))
	.pipe(bs.stream());
});

gulp.task('pug', () =>
	gulp.src(['app/assets/pug/**/*.pug','!app/assets/pug/partials/*'])
	.pipe($.changed('build', {extension: '.html'}))
	.pipe($.plumber())
	.pipe($.pug({
		pretty: true
	}))
	.pipe(gulp.dest('build'))
	.pipe(bs.stream())
	);

gulp.task('image', () =>
	gulp.src('build/images/**/*')
	.pipe($.imagemin({
		progressive: true,
		optimizationLevel: 5,
	}))
	.pipe(gulp.dest('build/images'))
	);

gulp.task('serve', function() {
	bs.init({
		server: "build"
	})
	gulp.watch("app/assets/scss/**/*.scss", ['sass'])
	gulp.watch("app/assets/js/**/*.js", ['js'])
	gulp.watch("app/assets/pug/**/*.pug", ['pug'])
});

gulp.task('bower', function(cb) {
    return gulp.src('./bower.json')
        .pipe($.mainBowerFiles())
        .pipe(gulp.dest('app/assets/vendor'));
});

gulp.task('vendor-js', (cb) => {
  return gulp.src(['app/assets/vendor/jquery/**/*.js', 'app/assets/vendor/**/*.js'])
      .pipe($.concat('vendor.js'))
      .pipe($.uglify())
      .pipe(gulp.dest('build/js'))
});

gulp.task('vendor-css', (cb) => {
  return gulp.src('app/assets/vendor/**/*.css')
      .pipe($.concat('vendor.css'))
      .pipe($.cleanCss({compatibility: 'ie8'}))
      .pipe(gulp.dest('build/css'))
});

gulp.task('inject', (cb) => {
     $.sequence(['bower'], 'vendor-css', 'vendor-js')(cb);
});

gulp.task('font', function() {
	return gulp.src(['bower_components/**/fonts/*.eot', 'bower_components/**/fonts/*.woff', 'bower_components/**/fonts/*.svg', 'bower_components/**/fonts/*.ttf'])
	.pipe($.flatten())
	.pipe(gulp.dest('build/fonts'))
});

gulp.task('extras' , () => {
  return gulp.src(['app/*.*', 'app/.htaccess'])
      .pipe(gulp.dest('build'))
});

// Default task
gulp.task('default', ['sass', 'js', 'pug', 'font', 'serve', 'inject']);

gulp.task('build', ['image', 'extras']);
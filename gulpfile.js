var gulp         = require('gulp'),
		plumber      = require('gulp-plumber'),
		rename       = require('gulp-rename');


var pug          = require('gulp-pug'),
		prettify     = require('gulp-html-prettify'),
		beautify     = require('gulp-html-beautify');


var browserSync  = require('browser-sync').create(),
    devip        = require('dev-ip'),
    host         = devip();


var uglify       = require('gulp-uglify'),
		concat       = require('gulp-concat');


var stylus       = require('gulp-stylus'),
		sourcemaps   = require('gulp-sourcemaps'),
		postcss      = require('gulp-postcss'),
		lost         = require('lost'),
		autoprefixer = require('autoprefixer'),
		cssnano      = require('cssnano');


//- PUG
gulp.task('pug', function() {
	var options = {
		// "indent_size": 2,
		// "indent_char": " ",
		"eol": "\n",
		// "indent_level": 0,
		"indent_with_tabs": true,
		// "preserve_newlines": false,
		// "max_preserve_newlines": 10,
		// "jslint_happy": false,
		// "space_after_anon_function": false,
		// "brace_style": "collapse",
		// "keep_array_indentation": false,
		// "keep_function_indentation": false,
		// "space_before_conditional": true,
		// "break_chained_methods": false,
		// "eval_code": false,
		// "unescape_strings": false,
		// "wrap_line_length": 0,
		// "wrap_attributes": "auto",
		// "wrap_attributes_indent_size": 4,
		// "end_with_newline": false
	};

	gulp.src('.pug/5-page/*.pug')
		.pipe(plumber())
		// .pipe(pug({ pretty: true }))
		.pipe(pug())
		.pipe(beautify(options))
		.pipe(gulp.dest('./'));
});


//- STYLUS
gulp.task('stylus', function() {
	var processors = [
		lost,
		autoprefixer({ browsers: ['last 2 versions'] }),
		cssnano
	];

	gulp.src('.stylus/master.styl')
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(stylus())
		.pipe(postcss(processors))
		.pipe(rename('style.min.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/css'));
});

//- JS
gulp.task('js', function() {
	gulp.src('.js/*.js')
		.pipe(plumber())
		.pipe(concat('app.js'))
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});


//- BROWSER SYNC
gulp.task('browser-sync', function() {
	browserSync.init({
		server: { baseDir: './' },
		port: 80,
		ui: false,
		host: host.slice(-1).pop(),
		files: '*.html, dist/css/*.css, dist/js/*.js, dist/img/*'
	});
});


//- WATCH
gulp.task('watch', function () {
	gulp.watch('.pug/**/*.pug', ['pug']);
	// gulp.watch('dist/img/*', ['pug']);
	gulp.watch('.stylus/**/*.styl', ['stylus']);
	gulp.watch('.js/*.js', ['js']);
});


//- DEFAULT
gulp.task('default', ['pug', 'stylus', 'js', 'browser-sync', 'watch']);
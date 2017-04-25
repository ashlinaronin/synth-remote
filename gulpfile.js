var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var del = require('del');

var paths = {
    mainScripts: 'src/js/**/*.js',
    sass: [
        'lib/noUiSlider.9.2.0/nouislider.css',
        'src/sass/*.scss',
    ],
    html: 'src/*.html',
    images: 'src/img/*.*',
    libScripts: [
        'node_modules/osc/dist/osc-browser.js',
        'node_modules/socket.io-client/socket.io.js',
        'lib/noUiSlider.9.2.0/nouislider.js'
    ]
};

var reload = browserSync.reload;

gulp.task('dev:styles', function() {
    return gulp.src(paths.sass)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.cssimport({}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({stream: true}));
});

gulp.task('dev:images', function() {
    return gulp.src(paths.images)
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: false}]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('dev:main-scripts', function() {
    return gulp.src(paths.mainScripts)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.rollup({
            'format': 'iife',
            'plugins': [
                require('rollup-plugin-babel')({
                    'presets': [['es2015', { 'modules': false }]],
                    'plugins': ['external-helpers']
                })
            ],
            entry: 'src/js/app.js'
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream: true}));
});


gulp.task('dev:lib-scripts', function(){
    return gulp.src(paths.libScripts)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.concat('lib.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream: true}));
});

gulp.task('prod:lib-scripts', function(){
    return gulp.src(paths.libScripts)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.concat('lib.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream: true}));
});

gulp.task('prod:main-scripts', function() {
    return gulp.src(paths.mainScripts)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.rollup({
            'format': 'iife',
            'plugins': [
                require('rollup-plugin-babel')({
                    'presets': [['es2015', { 'modules': false }]],
                    'plugins': ['external-helpers']
                })
            ],
            entry: 'src/js/app.js'
        }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream: true}));
});

gulp.task('dev:html', function(){
    return gulp.src(paths.html)
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream: true}));
});


function lint(files, options) {
    return function(){
        return gulp.src(files)
            .pipe(reload({stream: true, once: true}))
            .pipe($.eslint(options))
            .pipe($.eslint.format())
            .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
    };
}
var testLintOptions = {
    env: {
        mocha: true
    }
};

gulp.task('lint', lint('app/**/*.js'));

gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('serve', [
        'dev:lib-scripts', 'dev:styles', 'dev:images',
        'dev:main-scripts', 'dev:html'],
        function() {
            browserSync({
                notify: false,
                port: 4005,
                server: {
                    baseDir: ['dist']
                }
            }
        );

        gulp.watch(paths.sass, ['dev:styles']);
        gulp.watch(paths.mainScripts, ['dev:main-scripts']);
        gulp.watch(paths.images, ['dev:images']);
        gulp.watch(paths.html, ['dev:html']);
    });


gulp.task('build', [], function(){
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function(){
    gulp.start('serve');
});

gulp.task('prod', ['prod:lib-scripts', 'dev:styles', 'dev:images', 'prod:main-scripts', 'dev:html']);

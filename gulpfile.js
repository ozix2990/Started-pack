//===================================== Plugins =====================================//
const gulp = require('gulp');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sourcemap = require('gulp-sourcemaps');
const del = require('del');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');


//===================================== Variables =====================================//
const source_dir = 'src';
const dist_dir   = 'dist';

const source_pathes = {
    main_pug: `${source_dir}/*.pug`,
    all_pug: `${source_dir}/**/*.pug`,
    main_sass: `${source_dir}/*.sass`,
    all_sass: `${source_dir}/**/*.sass`,
    main_js: `${source_dir}/*.js`,
    all_js: `${source_dir}/**/*.js`,
}
const dist_pathes = {
    css: `${dist_dir}/css`,
    js: `${dist_dir}/js`,
}

//============ Translate pug to html ============//
function pugToHtml() {
    return (
        gulp.src(source_pathes.main_pug)
        .pipe(pug())
        .pipe(gulp.dest(`${dist_dir}/`))
        .pipe(browserSync.stream())
    )
    
}
//============ Transtale sass to css ============//
function sassToCss () {
    return (
        gulp.src(source_pathes.main_sass)
        .pipe(sourcemap.init())
        .pipe(sass(
            {
                outputStyle: 'compressed'
            }
        ).on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemap.write(`./`))
        .pipe(gulp.dest(dist_pathes.css))
        .pipe(browserSync.stream())
    )
}
function js () {
    return (
        gulp.src(source_pathes.main_js)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(dist_pathes.js))
    )
}
//============ Browser Sync ============//
function sync () {
    browserSync.init({
        server: {
            baseDir: `./${dist_dir}`
        },
        port: 3000,
        notify: false
    })
}
//============ Wathcer Functions ============//
function watchFiles () {
    gulp.watch(source_pathes.all_pug, pugToHtml)
    gulp.watch(source_pathes.all_sass, sassToCss)
    gulp.watch(source_pathes.all_js, js)
}
//============ Clean directory path function ============//
function clean () {
    return del (dist_dir)
}

let build = gulp.series(clean, pugToHtml, sassToCss, js);
let wathers = gulp.parallel(build, watchFiles, sync);

gulp.task('default', wathers);

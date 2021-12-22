//===================================== Plugins =====================================//
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sourcemap = require('gulp-sourcemaps');
const del = require('del');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const fileinclude = require('gulp-file-include');
const groupMedia = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webpHtml = require('gulp-webp-html');
const webpCss = require('gulp-webpcss');


//===================================== Variables =====================================//
const source_dir = 'src';
const dist_dir = 'dist';

const source_pathes = {
    main_html: `${source_dir}/*.html`,
    all_html: `${source_dir}/**/*.html`,
    main_sass: `${source_dir}/*.scss`,
    all_sass: `${source_dir}/**/*.scss`,
    main_js: `${source_dir}/*.js`,
    all_js: `${source_dir}/**/*.js`,
    img: `${source_dir}/images/**/*.{jpg,png,svg,gif,ico,webp}`,

}
const dist_pathes = {
    css: `${dist_dir}/css`,
    js: `${dist_dir}/js`,
    img: `${dist_dir}/images`,
}

//============ build HTML ============//
function toHTML() {
    return (
        gulp.src(source_pathes.main_html)
            .pipe(fileinclude())
            .pipe(webpHtml())
            .pipe(gulp.dest(`${dist_dir}/`))
            .pipe(browserSync.stream())
    )

}

//============ build CSS ============//
function toCSS() {
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
            .pipe(webpCss())
            .pipe(groupMedia())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(sourcemap.write(`./`))
            .pipe(gulp.dest(dist_pathes.css))
            .pipe(browserSync.stream())
    )
}

//============ build JS ============//

function toJS() {
    return (
        gulp.src(source_pathes.main_js)
            .pipe(webpack(webpackConfig))
            .pipe(gulp.dest(dist_pathes.js))
    )
}

//============ build images ============//

function images() {
    return (
        gulp.src(source_pathes.img)
            .pipe(webp({
                quality: 70
            }))
            .pipe(gulp.dest(dist_pathes.img))
            .pipe(gulp.src(source_pathes.img))
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3
            }))
            .pipe(gulp.dest(dist_pathes.img))
    )

}

//============ Browser Sync ============//
function sync() {
    browserSync.init({
        server: {
            baseDir: `./${dist_dir}`
        },
        port: 3000,
        notify: false
    })
}

//============ Watcher Functions ============//
function watchFiles() {
    gulp.watch(source_pathes.all_html, toHTML)
    gulp.watch(source_pathes.all_sass, toCSS)
    gulp.watch(source_pathes.all_js, toJS)
    gulp.watch(source_pathes.img, images)
}

//============ Clean directory path function ============//
function clean() {
    return del(dist_dir)
}

let build = gulp.series(clean, toHTML, toCSS, toJS, images);
let watchers = gulp.parallel(build, watchFiles, sync);

gulp.task('default', watchers);

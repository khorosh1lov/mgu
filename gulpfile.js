var gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), // Подключаем Sass пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    postcss = require('gulp-postcss'), // Подключаем библиотеку для преобразования стилей
    plumber = require('gulp-plumber') // Подключаем обработчик ошибок при пересборке проекта

var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now() / 1000);

var postcssPlugins = [
    require('autoprefixer')(["defaults", "ie >9", , "android >4.2"], {
        cascade: true
    })
]

gulp.task('sass', function () { // Создаем таск Sass
    return gulp.src('scss/*.+(scss)') // Берем источник
        .pipe(plumber()) // Подключаем обработчик ошибок
        .pipe(sass({
            errLogToConsole: true,
            includePaths: ['node_modules/bourbon/core']
        }).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(postcss(postcssPlugins)) // Создаем префиксы
        .pipe(gulp.dest('css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({
            stream: true
        })) // Обновляем CSS на странице при изменении
})

gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync 
        open: "external",
        server: { // Определяем параметры сервера
            baseDir: './' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    })
})


gulp.task('watch', ['clean', 'sass', 'browser-sync'], function () {
    gulp.watch('scss/**/*.+(scss|sass|less)', ['sass']) // Наблюдение за sass|scss|less файлами в папке sass
})

gulp.task('clean', function () {
    return del.sync('dist') // Удаляем папку dist перед сборкой
})

gulp.task('build', ['sass'])

gulp.task('default', ['watch'])

gulp.task('iconfont', function () {
    return gulp.src(['svg/*.svg'])
        .pipe(iconfont({
            normalize: true,
            fontName: 'icons', // required
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp, // recommended to get consistent builds when watching files
        }))
        .on('glyphs', function (glyphs, options) {
            // CSS templating, e.g.
            console.log(glyphs, options);
        })
        .pipe(gulp.dest("fonts/"));
});
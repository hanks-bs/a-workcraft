const gulp = require("gulp");
const gulpLoadPlugins = require("gulp-load-plugins");
const lazyplugins = gulpLoadPlugins();
watch = require("gulp-watch");
const browserSync = require("browser-sync").create();
lazyplugins.sass = require("gulp-dart-sass");
lazyplugins.autoprefixer = require("gulp-autoprefixer");
lazyplugins.cleanCss = require("gulp-clean-css");
lazyplugins.uglify = require("gulp-uglify-es").default;
lazyplugins.typescriptcompiler = require("gulp-typescript");
lazyplugins.sourcemaps = require("gulp-sourcemaps");
lazyplugins.imagemin = require("gulp-imagemin");
lazyplugins.cache = require("gulp-cache");
lazyplugins.notify = require("gulp-notify");
lazyplugins.clean = require("gulp-clean");
lazyplugins.concat = require("gulp-concat");
lazyplugins.webp = require("gulp-webp");
gulp.task("styles", () => {
	return gulp
		.src("./src/assets/scss/*.scss")
		.pipe(lazyplugins.sass().on("error", lazyplugins.sass.logError))
		.pipe(
			lazyplugins.autoprefixer(
				"last 2 version",
				"safari 5",
				"ie 8",
				"ie 9",
				"opera 12.1",
				"ios 6",
				"android 4"
			)
		)
		.pipe(lazyplugins.concat("bundle.min.css"))
		.pipe(lazyplugins.cleanCss())
		.pipe(gulp.dest("./dist/assets/style"))
		.pipe(browserSync.reload({ stream: true }));
});
gulp.task("vendorScripts", () => {
	return gulp
		.src([
			"./src/assets/js/*.js",
			"./src/assets/js/*.min.js",
			"./src/assets/ui-kit/js/*.min.js",
		])
		.pipe(lazyplugins.uglify())
		.pipe(gulp.dest("./dist/assets/scripts"));
});

gulp.task("tscompile", () => {
	return gulp
		.src([
			"./src/assets/scripts/*.ts",
			"./src/assets/scripts/*.js",
			"!./src/assets/scripts/emailSend.js",
		])

		.pipe(
			lazyplugins.typescriptcompiler({
				allowJs: true,
				target: "es2018",
			})
		)
		.pipe(lazyplugins.uglify())
		.pipe(lazyplugins.concat("bundle.min.js"))
		.pipe(
			lazyplugins.uglify({
				mangle: {
					toplevel: true,
				},
			})
		)

		.pipe(gulp.dest("./dist/assets/scripts"));
});

gulp.task("vendorCss", () => {
	return gulp
		.src(["./src/assets/ui-kit/css/*.min.css", "./src/assets/css/*.css"])

		.pipe(lazyplugins.cleanCss())
		.pipe(gulp.dest("./dist/assets/style"));
});
// Images
gulp.task("images", () => {
	return gulp
		.src([
			"./src/assets/img/**/*",
			"!./src/assets/img/**/*.png",
			"!./src/assets/img/**/*.ico",
		])
		.pipe(
			lazyplugins
				.cache(
					lazyplugins.imagemin({
						optimizationLevel: 3,
						progressive: true,
						interlaced: true,
						quality: 75,
					})
				)
				.pipe(lazyplugins.webp())
		)
		.pipe(gulp.dest("./dist/assets/images"))
		.pipe(lazyplugins.notify({ message: "Images task complete" }));
});

gulp.task("imagesPNG", () => {
	return gulp
		.src(["./src/assets/img/**/*.png"])
		.pipe(
			lazyplugins.cache(
				lazyplugins.imagemin({
					optimizationLevel: 3,
					progressive: true,
					interlaced: true,
					quality: 75,
				})
			)
		)
		.pipe(gulp.dest("./dist/assets/images"))
		.pipe(lazyplugins.notify({ message: "Images task complete" }));
});

gulp.task("imagesICO", () => {
	return gulp
		.src(["./src/assets/img/**/*.ico"])
		.pipe(
			lazyplugins.cache(
				lazyplugins.imagemin({
					optimizationLevel: 3,
					progressive: true,
					interlaced: true,
					quality: 75,
				})
			)
		)
		.pipe(gulp.dest("./dist/assets/images"))
		.pipe(lazyplugins.notify({ message: "Images task complete" }));
});

gulp.task("contactFormCompile", () => {
	return gulp
		.src("./src/assets/scripts/emailSend.js")
		.pipe(lazyplugins.concat("issue-form.min.js"))
		.pipe(
			lazyplugins.uglify({
				mangle: {
					toplevel: true,
				},
			})
		)

		.pipe(gulp.dest("./dist/assets/scripts"));
});

gulp.task("html", () => {
	return gulp
		.src(["./src/**/*.html", "./src/**/*.php"])
		.pipe(gulp.dest("./dist"));
});
gulp.task("browser-sync", () => {
	browserSync.init({
		server: {
			baseDir: "./dist",
		},
	});
	gulp.watch("./src/assets/scss/*.scss", gulp.series("styles"));
	gulp.watch("./src/assets/php/*.php", gulp.series("vendorPhp"));
	gulp.watch(
		["./src/assets/scripts/*.ts", "./src/assets/scripts/*.js"],
		gulp.series("tscompile")
	);
	gulp.watch("./src/assets/img/*", gulp.series("images"));
	gulp.watch("./src/**/*.html", gulp.series("html"));
	gulp.watch("./src/**/*.html").on("change", browserSync.reload);
});
gulp.task("vendorPhp", () => {
	return gulp
		.src("./src/assets/php/**/*.php")
		.pipe(gulp.dest("./dist/assets/php"));
});
gulp.task("Vendorhtaccess", () => {
	return gulp.src("./src/.htaccess").pipe(gulp.dest("./dist"));
});
// Clean
gulp.task("clean", function () {
	return gulp.src("./dist", { read: false }).pipe(lazyplugins.clean());
});
// Static Server + watching scss/html files
gulp.task(
	"serve",
	gulp.series(
		"html",
		"styles",
		"images",
		"imagesPNG",
		"tscompile",
		"contactFormCompile",
		"vendorCss",
		"vendorScripts",
		"Vendorhtaccess",
		"vendorPhp",
		"browser-sync"
	)
);

gulp.task("default", gulp.parallel("serve"));

# Usage:

```javascript
gulp.src(["modernizr-config.json", ...])
	.pipe(require("gulp-modernizr-combine")())
	.pipe(gulp.dest("dist"));
```

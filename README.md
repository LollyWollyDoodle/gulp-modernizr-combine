# Usage:

```javascript
var modernizrCombine = require("gulp-modernizr-combine");
gulp.src(["modernizr-config.json", ...])
	.pipe(modernizrCombine.combine())
	.pipe(modernizrCombine.stream())
	.pipe(gulp.dest("dist"));
```

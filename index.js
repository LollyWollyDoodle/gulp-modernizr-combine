var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var Vinyl = require("vinyl");
var through2 = require("through2");
var modernizr = require("modernizr");

const PLUGIN_NAME = "gulp-modernizr-combine";

var modernizrStream = function () {
	return through2.obj(function (file, encoding, cb) {
		if (file.isStream()) {
			cb(new PluginError(PLUGIN_NAME, "Streams aren't supported"));
		}
		else if (file.isBuffer()) {
			modernizr.build(JSON.parse(file.contents.toString(encoding)), function (result) {
				cb(null, new Vinyl({
					path: "modernizr.js",
					contents: new Buffer(result)
				}));
			});
		}
	});
};

var modernizrCombine = function () {
	var c = {
		"minify": false,
		"options": [],
		"feature-detects": [],
		
		merge: function (f, encoding, isMain, cb) {
			if (f.isStream()) {
				cb(new PluginError(PLUGIN_NAME, "Streams aren't supported"));
			}
			else if (f.isBuffer()) {
				this.mergeObject(JSON.parse(f.contents.toString(encoding)), isMain);
				cb();
			}
		},
		
		mergeObject: function (m, isMain) {
			if (isMain) {
				this["minify"] = m["minify"];
			}
			for (var i = 0; i < m["options"].length; i++) {
				if (this["options"].indexOf(m["options"][i]) === -1) {
					this["options"].push(m["options"][i]);
				}
			}
			
			for (i = 0; i < m["feature-detects"].length; i++) {
				if (this["feature-detects"].indexOf(m["feature-detects"][i]) === -1) {
					this["feature-detects"].push(m["feature-detects"][i]);
				}
			}
		}
	};
	
	var fileNum = 0;
	return through2.obj(function (file, encoding, cb) {
		c.merge(file, encoding, fileNum === 0, cb);
		fileNum++;
	}, function (cb) {
		delete c.merge, c.mergeObject;
		if (c["feature-detects"].length > 0) {
			this.push(new Vinyl({
				path: "modernizr-config.json",
				contents: new Buffer(JSON.stringify(c), "utf8")
			}));
		}
		cb();
	});
};

module.exports = {
	combine: modernizrCombine,
	stream: modernizrStream
};

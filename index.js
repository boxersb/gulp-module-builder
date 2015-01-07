const PLUGIN_NAME = 'gulp-module-builder';

// native
var fs = require('fs'),
    path = require('path'),
    Buffer = require('buffer').Buffer,
    EOL = require('os').EOL;

// npm
var gutil = require('gulp-util'),
    through = require('through'),
    json5 = require('json5'),
    globArray = require('glob-array');

// gulp-util
var PluginError = gutil.PluginError,
    File = gutil.File;

module.exports = function(options) {
    var opts = {
        separator: EOL,
        cwd: '',
        prefix: '',
        suffix: '',
        ext: 'js',
        encoding: 'utf8',
        matches: ['*'],
        unique: true
    };

    for (var key in options) {
        opts[key] = options[key];
    }

    if (!Array.isArray(opts.matches)) {
        opts.matches = [opts.matches];
    }

    var manifesto = {};

    function bufferContents(file) {
        if (file.isNull()) return;
        if (file.isStream()) return this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));

        var contents = file.contents.toString(),
            json = json5.parse(contents),
            availables = Object.keys(json);

        if (opts.matches.indexOf('*') === -1) {
            availables = availables.filter(function(modName) {
                return opts.matches.indexOf(modName) !== -1;
            });
        }

        availables.forEach(function(key) {
            manifesto[key] = globArray.sync(json[key], {
                cwd: opts.cwd,
                root: opts.cwd
            }).map(function(gpath) {
                return path.resolve(opts.cwd, gpath);
            });

            if (opts.unique) {
                if (opts.unique !== 'R') {
                    manifesto[key] = manifesto[key].reduce(function(p, c) {
                        if (p.indexOf(c) < 0) p.push(c);
                        return p;
                    }, []);
                } else {
                    manifesto[key].reverse();
                    manifesto[key] = manifesto[key].reduce(function(p, c) {
                        if (p.indexOf(c) < 0) p.push(c);
                        return p;
                    }, []);
                    manifesto[key].reverse();
                }
            }

            manifesto[key].__concat = [];
            manifesto[key].forEach(function(fpath) {
                var contents = fs.readFileSync(fpath, { encoding: opts.encoding });

                manifesto[key].__concat.push(contents);
            });
        });
    }

    function endStream() {
        var _this = this;

        Object.keys(manifesto).forEach(function(modName) {
            if (manifesto[modName].__concat) {
                var joinedFile = new File({
                    path: opts.prefix + modName + opts.suffix +"."+ opts.ext,
                    contents: new Buffer(manifesto[modName].__concat.join(opts.separator))
                });

                _this.emit('data', joinedFile);
            }
        });

        this.emit('end');
    }

    return through(bufferContents, endStream);
};

var es = require('event-stream');
var should = require('should');
var gutil = require('gulp-util');
var File = gutil.File;
var vinylFile = require('vinyl-file');
var EOL = require('os').EOL;
var builder = require('../');

function getFile(filepath) {
    return vinylFile.readSync(filepath);
}

function getContent(filepath) {
    return getFile(filepath).contents +'';
}

function doBuild(manifestos, opts, listeners) {
    if (!Array.isArray(manifestos)) manifestos = [manifestos];

    var myBuilder = builder(opts);

    listeners = listeners || {};
    myBuilder.on('data', function(file) {
        listeners.data && listeners.data(file);
    });

    myBuilder.on('end', function() {
        listeners.end && listeners.end();
        listeners.done && listeners.done();
    });

    myBuilder.on('error', function(err) {
        listeners.error && listeners.error(err);
    });

    manifestos.forEach(function(man) {
        myBuilder.write(man);
    });

    myBuilder.end();
}

var fp = {
    manifesto: './test/manifesto',
    fixtures: './test/fixtures'
};

describe('gulp-module-builder', function() {
    it('should ignore null files', function(done) {
        doBuild(new File(), {}, {
                data: function() { should(0).be.exactly(1); },
                end: function() { should(1).be.exactly(1); },
                done: done
            });
    });

    it('should emit error stream', function(done) {
        var manifesto = new File({
            contents: es.readArray([
                    '{',
                    '   "simple-module": [',
                    '       "./test/fixtures/js1.js",',
                    '       "./test/fixtures/js2.js"',
                    '   ]',
                    '}'])
        });

        doBuild(manifesto, {}, {
                data: function(file) { should(file.isStream).be.exactly(false); },
                error: function(err) { err.message.should.equal('Streaming not supported'); },
                done: done
            });
    });

    describe('simple concat files', function() {
        var manifesto = getFile(fp.manifesto +'/simple-modules.json');

        var js1 = getContent(fp.fixtures +'/js1.js'),
            js2 = getContent(fp.fixtures +'/js2.js');

        it('pass no options', function(done) {
            doBuild(manifesto, {}, {
                    data: function(file) {
                        var filename = file.path,
                            contents = file.contents +'';

                        filename.should.equal('simple-module.js');
                        contents.should.equal(js1 + EOL + js2);
                    },
                    done: done
                });
        });

        it('pass prefix, suffix, ext and separator options', function(done) {
            doBuild(manifesto, {
                    prefix: 'prefix-',
                    suffix: '-suffix',
                    ext: 'markdown',
                    separator: '----'
                }, {
                    data: function(file) {
                        var filename = file.path,
                            contents = file.contents +'';

                        filename.should.equal('prefix-simple-module-suffix.markdown');
                        contents.should.equal(js1 +'----'+ js2);
                    },
                    done: done
                });
        });
    });

    describe('multiple modules in single manifesto', function() {
        var manifesto = getFile(fp.manifesto +'/multiple-modules.json');

        var lib1 = getContent(fp.fixtures +'/lib1.js'),
            lib2 = getContent(fp.fixtures +'/lib2.js'),
            lib3 = getContent(fp.fixtures +'/lib3.js');

        var service1 = getContent(fp.fixtures +'/service1.js'),
            service2 = getContent(fp.fixtures +'/service2.js');


        it('consider path relative cwd options', function(done) {
            var files = [];

            doBuild(manifesto, {
                    cwd: './test/fixtures/',
                    suffix: '.latest'
                }, {
                    data: function(file) { files.push(file); },
                    end: function() {
                        var baselib = files[0],
                            service = files[1];

                        files.length.should.equal(2);

                        baselib.path.should.equal('baselib.latest.js');
                        baselib.contents.toString()
                            .should.equal([lib1, lib2, lib3].join(EOL));
                        
                        service.path.should.equal('service.latest.js');
                        service.contents.toString()
                            .should.equal([service1, service2].join(EOL));
                    },
                    done: done
                });
        });

        it('should build matched module only in "matches" option', function(done) {
            var files = [];

            doBuild(manifesto, {
                    cwd: './test/fixtures/',
                    separator: EOL + EOL,
                    matches: ["baselib"]
                }, {
                    data: function(file) { files.push(file); },
                    end: function() {
                        var baselib = files[0];

                        files.length.should.equal(1);

                        baselib.path.should.equal('baselib.js');
                        baselib.contents.toString()
                            .should.equal([lib1, lib2, lib3].join(EOL + EOL));
                    },
                    done: done
                });
        });
    });

    describe('build modules from multiple manifestos', function() {
        var manifestos = [
            getFile(fp.manifesto +'/multiple-modules.json'),
            getFile(fp.manifesto +'/another-modules.json')
        ];

        var js1 = getContent(fp.fixtures +'/js1.js'),
            js2 = getContent(fp.fixtures +'/js2.js');

        var lib1 = getContent(fp.fixtures +'/lib1.js'),
            lib2 = getContent(fp.fixtures +'/lib2.js'),
            lib3 = getContent(fp.fixtures +'/lib3.js');

        var service1 = getContent(fp.fixtures +'/service1.js'),
            service2 = getContent(fp.fixtures +'/service2.js');

        it('build all modules from multiple manifestos', function(done) {
            var files = [];

            doBuild(manifestos, {
                    cwd: './test/fixtures/',
                    ext: 'ts'
                }, {
                    data: function(file) { files.push(file); },
                    end: function() {
                        var baselib = files[0],
                            service = files[1],
                            common = files[2];

                        files.length.should.equal(3);

                        baselib.path.should.equal('baselib.ts');
                        baselib.contents.toString()
                            .should.equal([lib1, lib2, lib3].join(EOL));

                        service.path.should.equal('service.ts');
                        service.contents.toString()
                            .should.equal([service1, service2].join(EOL));

                        common.path.should.equal('common.ts');
                        common.contents.toString()
                            .should.equal([js1, js2].join(EOL));

                    },
                    done: done                    
                });
        });

        it('should build matched module only in "matches" option', function(done) {
            var files = [];

            doBuild(manifestos, {
                    cwd: './test/fixtures',
                    matches: 'service'
                }, {
                    data: function(file) { files.push(file); },
                    end: function() {
                        var service = files[0];

                        files.length.should.equal(1);

                        service.path.should.equal('service.js');
                        service.contents.toString()
                            .should.equal([service1, service2].join(EOL));
                    },
                    done: done
                });
        });
    });

    describe('builder glob only exist files in manifesto', function() {
        var manifesto = getFile(fp.manifesto +'/globable-modules.json');
        var opts = {
                    cwd: './test/fixtures',
                    ext: 'md',
                    separator: EOL +'----'+ EOL
                };

        var readme = getContent(fp.fixtures +'/markdown/README.md'),
            gettingStarted = getContent(fp.fixtures +'/markdown/Getting-Started.md'),
            todoList = getContent(fp.fixtures +'/markdown/ToDoList.md');

        it('glob files by pattern', function(done) {
            doBuild(manifesto, opts, {
                    data: function(file) {
                        var filename = file.path,
                            contents = file.contents +'';

                        filename.should.equal('digest.md');
                        contents.should.equal([readme, gettingStarted, todoList].join(opts.separator));
                    },
                    done: done
                });
        });

        it('allows duplicate concatenates', function(done) {
            var opts2 = {};
            for (var key in opts) {
                opts2[key] = opts[key];
            }
            opts2.unique = false;

            doBuild(manifesto, opts2, {
                    data: function(file) {
                        var filename = file.path,
                            contents = file.contents +'';

                        filename.should.equal('digest.md');
                        contents.should.equal([readme, gettingStarted, readme, todoList].join(opts.separator));  
                    },
                    done: done
                });
        });

        it('can remove duplicate files from "Rear" position by unique:"R" option', function(done) {
            var opts2 = {};
            for (var key in opts) {
                opts2[key] = opts[key];
            }
            opts2.unique = 'R';

            doBuild(manifesto, opts2, {
                    data: function(file) {
                        var filename = file.path,
                            contents = file.contents +'';

                        filename.should.equal('digest.md');
                        contents.should.equal([gettingStarted, readme, todoList].join(opts.separator));  
                    },
                    done: done
                });
        });
    });
});
module.exports = function(grunt) {
    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        cacheBust: (new Date()).getTime(),

        dirs: {
            base      : "./",

            css       : {
                src   : "./public/css/less",
                dest  : "./public/css/"                
                },
            js        : {
                src   : "./public/js/src",
                dest  : "./public/js",
                temp  : "./public/js/src/_temp"

            },
            img       : "./public/img",
            raiz_static  : "/public"
        },

        jshint: {
            options: {
                jshintrc: "<%= dirs.js.src %>/.jshintrc"
            },
            all: [
                "<%= dirs.js.src %>/*.js",
                "!<%= dirs.js.src %>/script.js"
            ]
        },

        concat: {

            options       : {

                    separator : "\n\n"
                },
            frameworks: { 
                src       : [
                    "<%= dirs.js.src %>/plugins/zepto.min.js",
                    "<%= dirs.js.src %>/plugins/zepto-fx_methods.js"
                ],
                dest      : "<%= dirs.js.src %>/frameworks.js"  
            },
            netshoes: {
                src       : [
                    "<%= dirs.js.src %>/plugins/swiper/3.3.1/swiper.min.js",
                    "<%= dirs.js.src %>/app*.js"
                ],
                dest      : "<%= dirs.js.src %>/netshoes.js"
            }
        },

        //Minificar JS
        uglify: {

            options                 : {

                mangle              : {
                    except          : ["Swiper", "Zepto"] //no Array abaixo, podemos ignorar algumas variaveis.
                }
            },
            prod                    : {
                options             : {
                    banner          : "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> */",
                    properties      : true,
                    preserveComments: false,
                    compress        : {
                        global_defs : {
                            "DEBUG" : false
                        },
                        dead_code   : true
                    }
                },
                files               : {
                    "<%= dirs.js.dest %>/netshoes.min.js": ["<%= dirs.js.temp %>/netshoes.log.js"],
                    "<%= dirs.js.dest %>/frameworks.min.js": ["<%= dirs.js.src %>/frameworks.js"]
                }
            },
        },

        removelogging: {

            dist: {

                files: {
                    "<%= dirs.js.temp %>/netshoes.log.js": ["<%= dirs.js.src %>/netshoes.js"]
                }
            },
        },

        less: {

            dev              : {
                options      : {
                    compress : false,
                    dumpLineNumbers: 'all'
                },
                files        : {
                    "<%= dirs.css.src %>/netshoes.css": "<%= dirs.css.src %>/netshoes.less"
                }
            },
            prod             : {
                options      : {
                    compress : true
                },
                files        : {
                    "<%= dirs.css.dest %>/netshoes.min.css": "<%= dirs.css.src %>/netshoes.less"
                }
            },
        },

        csslint: {
            strict: {
                options: {
                    "important": false,
                    "adjoining-classes": false,
                    "known-properties": false,
                    "box-sizing": false,
                    "box-model": false,
                    "overqualified-elements": false,
                    "display-property-grouping": false,
                    "bulletproof-font-face": false,
                    "compatible-vendor-prefixes": false,
                    "regex-selectors": false,
                    "errors": true,
                    "duplicate-background-images": false,
                    "duplicate-properties": false,
                    "empty-rules": false,
                    "selector-max-approaching": false,
                    "gradients": false,
                    "fallback-colors": false,
                    "font-sizes": false,
                    "font-faces": false,
                    "floats": false,
                    "star-property-hack": false,
                    "outline-none": false,
                    "import": false,
                    "ids": false,
                    "underscore-property-hack": false,
                    "rules-count": false,
                    "qualified-headings": false,
                    "selector-max": false,
                    "shorthand": false,
                    "text-indent": false,
                    "unique-headings": false,
                    "universal-selector": false,
                    "unqualified-attributes": false,
                    "vendor-prefix": false,
                    "zero-units": false
                },
                src: ["<%= dirs.css.src %>/style.css"]
            }
        },

        //Sprite Generator
        sprite:{

            options : {

                cssFormat : ".less"
            },
            netshoes:{                
                src             : "<%= dirs.img %>/sprites/*.png",
                retinaSrcFilter : "<%= dirs.img %>/sprites/*-2x.png",
                dest            : "<%= dirs.img %>/netshoes-sprite.png",
                retinaDest      : "<%= dirs.img %>/netshoes-sprite@2x.png",
                destCss         : "<%= dirs.css.src %>/sprites.less",
                imgPath         : "<%= dirs.raiz_static %>/img/netshoes-sprite.png",
                retinaImgPath   : "<%= dirs.raiz_static %>/img/netshoes-sprite@2x.png",
                padding         : 5
            }
        },

        // Watch

        watch: {
            options: {
                livereload: true

            },
            less: {
                files: "<%= dirs.css.src %>/**/*.less",
                tasks: ["less:dev","less:prod"],
                options: {
                    livereload: false
                }
            },
            css: {
                files: ["<%= dirs.css.dest %>/*.css"]
            },
            js: {
                files: [
                    "Gruntfile.js",
                    "<%= dirs.js.src %>/**/*.js",
                    "!<%= dirs.js.src %>/script.js",
                    "!<%= dirs.js.temp %>/*.js"
                ],
                tasks: ["concat","removelogging","uglify"]
            },
            sprite: {
                files: ["<%= dirs.img %>/sprites/*.png"],
                tasks: ["sprite"],
                options: {
                    livereload: false
                }
            },
        },

        //browserSync - Sincroniza desktop e mobile
        browserSync: {

            netshoes: {

                options: {
                    watchTask: true,
                    proxy: "www.netshoes.com.br"
                },
                bsFiles: {
                    injectChanges: false,
                    src : [
                        "<%= dirs.base %>/css/*.css",
                        "<%= dirs.base %>/js/script.js",
                        "<%= dirs.base %>/*.{html,txt,php}"
                    ]
                }
            },
        }
    });

    // Agora que temos carregado a package.json e os node_modules vamos definir o caminho de base
    // Para a execução efectiva das tarefas
    grunt.registerTask("build", ["sprite","less:dev","less:prod","js"]);
    grunt.registerTask("w", ["build","watch"]);
    grunt.registerTask("css", ["less"]);
    grunt.registerTask("js", ["removelogging","uglify"]);
    grunt.registerTask("default", ["build"]);
}

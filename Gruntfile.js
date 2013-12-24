module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: './public/lib',
                    cleanTargetDir: true
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'Handlebars.templates',
                    processName: function(path) {
                        return path.replace(/^\.\/public\/views\/(.*)\.handlebars/, '$1');
                    }
                },
                files: {
                    './public/scripts/gen-templates.js': './public/views/*/*.handlebars'
                }
            }
        },
        watch: {
            scripts: {
                files: ['./public/views/*/*.handlebars'],
                tasks: ['handlebars'],
                options: {
                    spawn: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('dev', ['bower', 'handlebars', 'watch']);
};
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
        compass: {
            options: {
                sassDir: 'public/',
                cssDir: 'public/.gen/'
            },
            dev: {
                options: {
                    debugInfo: true
                }
            }
        },
        copy: {
            sockets: {
                files: [
                    {
                        src: ['./node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js'],
                        dest: './public/.gen/scripts/',
                        flatten: true,
                        expand: true
                    }
                ]
            },
            cookbooks: {
                files: [
                    {
                        src: ['**'],
                        dest: './cookbooks/nodejs',
                        cwd: './bower_components/nodejs-cookbook',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/apt',
                        cwd: './bower_components/apt',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/build-essential',
                        cwd: './bower_components/build-essential',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/yum',
                        cwd: './bower_components/yum',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/openssl',
                        cwd: './bower_components/openssl',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/mysql',
                        cwd: './bower_components/mysql',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/database',
                        cwd: './bower_components/database',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/redisio',
                        cwd: './bower_components/redisio',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/homebrew',
                        cwd: './bower_components/homebrew',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/chef_handler',
                        cwd: './bower_components/chef_handler',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/ulimit',
                        cwd: './bower_components/chef-ulimit',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/aws',
                        cwd: './bower_components/aws',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/postgresql',
                        cwd: './bower_components/postgresql',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/xfs',
                        cwd: './bower_components/xfs',
                        expand: true
                    },
                    {
                        src: ['**'],
                        dest: './cookbooks/windows',
                        cwd: './bower_components/windows',
                        expand: true
                    }
                ] 
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
                    './public/.gen/scripts/templates.js': './public/views/*/*.handlebars'
                }
            }
        },
        watch: {
            handlebars: {
                files: ['./public/views/**/*.handlebars'],
                tasks: ['handlebars'],
                options: {
                    spawn: true
                }
            },
            css: {
                files: ['./public/**/*.scss'],
                tasks: ['compass'],
                options: {
                    spawn: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('dev', ['bower', 'handlebars', 'compass', 'copy:sockets', 'copy:cookbooks', 'watch']);
};

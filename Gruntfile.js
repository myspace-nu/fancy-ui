module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*!\n'+
                ' * Fancy UI v<%= pkg.version %>\n'+
                ' * https://github.com/myspace-nu\n'+
                ' *\n'+
                ' * Copyright 2024 Johan Johansson\n'+
                ' * Released under the MIT license\n'+
                ' */\n'
            },
            build: {
                src: 'js/*.js',
                dest: 'dist/fancy-ui.min.js'
            }
        },
        cssmin: {
            target: {
              files: {
                'dist/fancy-ui.min.css': ['css/*.css']
              }
            }
          }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['uglify','cssmin']);
};
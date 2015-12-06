/// <vs AfterBuild='copy' />
module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: [
                    "./**/*.ts",
                    "./**/*.tsx",
                    "!./node_modules/**/*"
                ],
                dest: 'js',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    declaration: true
                }
            }
        },
        copy : {
            editorViews : {
                expand: true,
                src: ["editor/views/**"],
                dest: "js/"
            }
        }
    });

    grunt.registerTask('default', ['typescript', 'copy']);

}
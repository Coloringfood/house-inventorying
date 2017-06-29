/**
 * this file could really use a good clean up
 */
module.exports = function (grunt) {
	'use strict';

	var files;

	// path for files used in grunt configuration
	files = {
		js: {
			not: {
				autogen: [
					'!public/common/constants.js',
					'!public/house-inventorying.min.js'
				],
				external: [
					'!public/assets/ext/**/*.js',
					'!Gruntfile.js',
				]
			},
			all: [
				'public/**/*.js'
			],
			deps: [
				// Dependencies for Unit Test
				'assets/ext/vendor/jquery/dist/jquery.js',
				'assets/ext/vendor/bootstrap/dist/js/bootstrap.js',
				'assets/ext/vendor/angular/angular.js',
				'assets/ext/vendor/angular-route/angular-route.js',
				'assets/ext/vendor/angular-mocks/angular-mocks.js',
				'assets/ext/vendor/angular-touch/angular-touch.js'
			]
		},
		sass: {
			all: ['assets/sass/**']
		},
		css: {
			all: [
				'assets/css/**/*.css'
			]
		},
		tests: {
			all: [
				'tests/**/*_test.js'
			]
		},
		html: {
			all: [
				'public/**/*.html'
			]
		}
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: grunt.file.readJSON('config/ui-config.json'),

		ngconstant: {
			options: {
				name: 'constants',
				dest: 'public/common/constants.js',
				wrap: '"use strict";\n\n {%= __ngModule %}',
				constants: {
					ENV: '<%= config %>'
				}
			},
			build: {}
		},

		mkdir: {
			build: {
				options: {
					create: [
						'build/code/complexity',
						'build/tests/features/junit'
					]
				}
			}
		},

		clean: {
			build: [
				"build",
				"assets/ext/vendor"
			],

			// auto generate files (from gen task)
			gen: [
				'public/common/constants.js',
				'public/house-inventorying.min.js'
			]
		},

		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'public/assets/css/base.css': 'public/assets/sass/main.scss'
				}
			}
		},

		nggettext_compile: {
			all: {
				options: {
					format: 'json'
				},
				files: [
					{
						expand: true,
						cwd: 'assets/translations/po/',
						src: '*.po',
						dest: 'assets/translations/json/',
						ext: '.json'
					}
				]
			}
		},

		postcss: {
			options: {
				map: true,
				processors: [
					require('autoprefixer')({browsers: 'last 2 version'}),
					require('csswring')
				]
			},
			dist: {
				src: 'assets/css/base.css'
			}
		}
	});

	grunt.registerTask('build', [
		'clean',
		'prepare',
		'compile'
	]);
	grunt.registerTask('build:dev', ['build', 'ngconstant']);
	grunt.registerTask('clean', ['clean:build', 'clean:gen']);
	grunt.registerTask('compile', ['sass:dist', 'postcss:dist', 'nggettext_compile']);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('prepare', ['mkdir:build']);

	require('load-grunt-tasks')(grunt, {
		pattern: ['grunt-*']
	});
};
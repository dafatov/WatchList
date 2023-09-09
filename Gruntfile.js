module.exports = grunt => {
  grunt.initConfig({
    bump: {
      options: {
        files: ['package.json', 'electron/package.json', 'frontend/package.json'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', []);
};

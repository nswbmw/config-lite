const neostandard = require('neostandard')

module.exports = [
  ...neostandard({
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  }),
  {
    files: ['__test__/**/*.js'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        test: 'readonly',
        expect: 'readonly'
      }
    }
  }
]

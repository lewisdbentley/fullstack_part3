module.exports = {
    'env': {
        'node': true,
        'browser': true,
        'commonjs': true,
        'es2020': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 11
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'no-console': 0,
        'object-curly-spacing': [
            'error',
            'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
    }
}

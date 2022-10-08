// if and only if NODE_ENV variable is set to development do we allow it
let IS_PROD = false;
try {
    IS_PROD = process.env.NODE_ENV !== 'development';
} catch (e) {
    //
}
const semver = require('semver');
const Vue = require('vue/package.json');

let vueVersion = 2;
try {
    const Vue = require('vue/package.json');
    vueVersion = semver.major(Vue.version);
} catch (e) {
    //
}

module.exports = {
    env: {
        browser: true, // browser variables like window etc.
        commonjs: true, // webpack build codes
        es6: true, // for new types like Set
        node: true, // we also have node variables like process
        jquery: true, // most of our projects still have jquery
    },
    plugins: [
        'eslint-plugin-import', // for import resolving
        'eslint-plugin-vue', // for vue template block linting
    ],
    extends: [
        'eslint:recommended', // preset with eslint recommendations
       // `plugin:vue${ vueVersion === 3 ? '3' : '' }/strongly-recommended`, // preset with vue related recommendations
    ],
    // example resolver
    // settings: {
    //     'import/resolver': {
    //         webpack: {
    //             config: 'webpack.config.resolve.js', // this is the default path for resolve config
    //         },
    //     },
    // },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@babel/eslint-parser', // for es6 features
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        'vue/name-property-casing': ['error', 'PascalCase' | 'kebab-case'],
        indent: ['error', 4, { SwitchCase: 1, ignoredNodes: ['TemplateLiteral *'] }],
        semi: 'error',
        'semi-spacing': 'error',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        curly: 'error',
        'brace-style': ['error'],
        'keyword-spacing': 'error',
        'key-spacing': 'error',
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': 'error',
        'no-trailing-spaces': 'error',
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'never',
            },
        ],
        'eol-last': 'error',
        'prefer-destructuring': ['warn', { object: true, array: false }],
        'no-debugger': IS_PROD ? 'error' : 'warn',
        'no-param-reassign': ['warn', { props: false }],
        'no-prototype-builtins': 'warn',
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        'quote-props': ['error', 'as-needed'],
        'vue/attribute-hyphenation': ['error', 'always'],
        'vue/attributes-order': ['error', {
            order: [
                'DEFINITION',
                'LIST_RENDERING',
                'CONDITIONALS',
                'RENDER_MODIFIERS',
                'GLOBAL',
                'UNIQUE',
                'TWO_WAY_BINDING',
                'OTHER_DIRECTIVES',
                'OTHER_ATTR',
                'EVENTS',
                'CONTENT',
            ],
        }],
        'vue/html-closing-bracket-newline': ['error', { singleline: 'never', multiline: 'always' }],
        'vue/html-closing-bracket-spacing': ['error', { startTag: 'never', endTag: 'never', selfClosingTag: 'never' }],
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': ['error', {
            singleline: 3,
            multiline: 2,
        }],
        'vue/component-definition-name-casing': ['error', 'kebab-case'],
        'vue/order-in-components': ['error', {
            order: [
                'name',
                'el',
                'parent',
                'functional',
                'extends',
                ['template', 'render'],
                ['delimiters', 'comments'],
                ['components', 'directives', 'filters'],
                'mixins',
                'inheritAttrs',
                'model',
                ['props', 'propsData'],
                'data',
                'computed',
                'methods',
                'LIFECYCLE_HOOKS',
                'watch',
                'beforeDestroy',
                'destroyed',
                'renderError',
            ],
        }],
        'vue/script-indent': ['error', 4, {
            baseIndent: 1,
            switchCase: 1,
        }],
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
        'import/extensions': [
            'error',
            'always',
        ],
    },
    overrides: [ // we are using both indent and vue/script-indent because of base indent issue on script tags
        {
            files: ['*.vue'],
            rules: {
                indent: 'off',
            },
        },
    ],
};

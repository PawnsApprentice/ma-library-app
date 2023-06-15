const path = require('path');
const GoogleFontsPlugin = require('google-fonts-webpack-plugin');
function resolve(p = '.') {
    return path.resolve(__dirname, p);
}
function resolveSrc() {
    return resolve('src');
}
module.exports = {
    resolve: {
        extensions: ['.mjs', '.js', '.vue', '.json'],
        alias: {
            vue: 'vue/dist/vue.runtime.esm.js',
            '@': resolveSrc(),
        },
        modules: [resolveSrc(), resolve('node_modules'), resolve()],
    },
    plugins: [
        new GoogleFontsPlugin({
            fonts: [
                { family: 'Hind Vadodara', variants: ['400'] },
            ],
        }),
    ],
};
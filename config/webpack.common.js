const path = require('path');

module.exports = {
    entry: './src/js/map.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: [
                            ["transform-runtime", {
                                "polyfill": false
                            }]
                        ]
                    }
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.js'
    }
};
const path = require('path');

const isProd = process.env.mode === "production";

module.exports = {
    target: "node",
    mode: isProd ? "production" : "development",
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist', isProd ? 'prod' : 'dev'),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    node: {
        __dirname: false,
        __filename: false,
    },

};
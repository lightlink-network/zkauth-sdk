const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'zkauth.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'ZKAuth',
            type: 'umd',
            export: 'default'
        },
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
        },
        compress: true,
        port: 8000
    }
};
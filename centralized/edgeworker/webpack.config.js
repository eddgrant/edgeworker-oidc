import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './src/main.js',
    target: 'webworker',
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    // Babel options should be in babel.config.js (as you have)
                }
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        // Akamai EdgeWorker modules
        'create-response': 'commonjs create-response',
        'http-request': 'commonjs http-request',
        'cookies': 'commonjs cookies',
        'url-search-params': 'commonjs url-search-params',
    },
    mode: 'development',
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, 'dist/webpack'),
        libraryTarget: 'commonjs2',
    },
};
    
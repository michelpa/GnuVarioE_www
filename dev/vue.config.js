const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {

    // configureWebpack: (config) => {
    //     config.output.filename = '[name][hash:2].js';
    //     config.output.chunkFilename = 'js/chk[hash:5].js';
    // },
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/',
    pages: {
        index: {
            // entry for the page
            entry: 'src/main.js',
            // the source template
            template: 'public/index.html',
            // output as dist/index.html
            filename: 'index.htm',
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            // chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
        // translation: {
        //     // entry for the page
        //     entry: 'src/translation/index.js',
        //     // the source template
        //     template: 'public/index.html',
        //     // output as dist/index.html
        //     filename: 'index.htm',
        //     // chunks to include on this page, by default includes
        //     // extracted common chunks and vendor chunks.
        //    // chunks: ['chunk-vendors', 'chunk-common', 'index']
        // }
    },
    // css: {
    //     extract: {
    //         filename: 'css/[name][hash:2].css',
    //         chunkFilename: 'css/chk[hash:5].css',
    //     },
    // },
    // chainWebpack: config => {

    // },
    chainWebpack: config => {
        // config.externals([
        //     /@namespace/,
        //     {
        //         'vue': 'vue',
        //     },
        // ])


        // config.output.filename('[name][hash:3].js')
        // config.output.chunkFilename(`js/[id][chunkhash:2].js`)

        // config.module.rule('images').use('url-loader').options({
        //     limit: 4096,
        //     fallback: {
        //         loader: 'file-loader',
        //         options: {
        //             name: 'img/[name][hash:2].[ext]'
        //         }
        //     }
        // })
        // config.module.rule('svg').use('file-loader').options({
        //     name: 'img/[name][hash:2].[ext]'
        // })

        // config.plugins.delete('prefetch-index')
        // config.plugins.delete('preload-index')

        config.plugin('CompressionPlugin').use(CompressionPlugin).tap(args => {
            return [{
                include: /\.(js|map|css|htm|html)$/
            }]
        });
        //config.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin);

    },

    configureWebpack: {
        optimization: {
            splitChunks: false

            //  splitChunks: {
            //     chunks: 'all',
            //     minSize: 20000,
            //     maxSize: 100000,
            //     // name: false,
            //  }
            //  splitChunks: {
            //     chunks: 'all',
            //     // name: false,
            //  }
        },
        // optimization: {
        //     runtimeChunk: 'single',
        //     splitChunks: {
        //         chunks: 'all',
        //         maxInitialRequests: Infinity,
        //         minSize: 10000,
        //         cacheGroups: {
        //             vendor: {
        //                 test: /[\\/]node_modules[\\/]/,
        //                 name(module) {
        //                     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
        //                     return `npm.${packageName.replace('@', '')}`;
        //                 },
        //             },
        //         },
        //     },
        // },
        externals: {
            'vue': 'Vue',
            'vuerouter': 'VueRouter',
            'vuex': 'Vuex',
            'boostrapVue': 'BootstrapVue',
            'vuei18n': 'VueI18n',
            'clickconfirm': 'clickConfirm',
            'apex': 'Apex',
            'apexchart': 'VueApexCharts',
            'vuecolor': "VueColor",
            'vueMoment': "vueMoment"
        }
    },
    css: {
        extract: true,
    },
}
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
            //chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
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


        config.output.filename('[name][hash:3].js')
        config.output.chunkFilename(`js/[id][chunkhash:2].js`)

        config.module.rule('images').use('url-loader').options({
            limit: 4096,
            fallback: {
                loader: 'file-loader',
                options: {
                    name: 'img/[name][hash:2].[ext]'
                }
            }
        })
        config.module.rule('svg').use('file-loader').options({
            name: 'img/[name][hash:2].[ext]'
        })
        // console.log(config.plugins)
        // config.plugins.delete('prefetch')
        // config.plugins.delete('preload')
        config.plugins.delete('prefetch-index')
        config.plugins.delete('preload-index')



    },

    configureWebpack: {
        optimization: {
            splitChunks: false
        },
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
            'vueMoment': "vueMoment",
        }
    },
    css: {
        extract: false,
    },
}
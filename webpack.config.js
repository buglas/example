const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs=require('fs');
const file="./pages.json";
const result=JSON.parse(fs.readFileSync( file));
const entry={index:`./src/index.js`};
const crtPlugin=(key)=>{
    return new HtmlWebpackPlugin({
        filename: `${key}.html`,
        template: `./page/${key}.html`,
        chunks:[key],
        //hash:true
    })
}
const htmlWebpackPlugins=[crtPlugin('index')];
const  ignorePages=['starvein','warehouse'];
for(let key in result){
    result[key].forEach((ele)=>{
        //if(ignorePages.includes(ele)){return};
        let key=ele.split('_')[0];
        entry[key]=`./src/${key}.js`;
        htmlWebpackPlugins.push(crtPlugin(key));
    })
}

module.exports = {
    //入口文件
    entry: entry,
    //出口
    output: {
        filename:'./js/[name].js',
        //路径
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    //测试时，查找源代码
    devtool:'eval-source-map',
    module: {
        rules: [
            //暴露$和jQuery到全局
            /*{
                test: require.resolve('jquery'), //require.resolve 用来获取模块的绝对路径
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            },*/
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {loader: 'css-loader', options: { importLoaders: 1 } },
                    'less-loader',
                    'postcss-loader'
                ],
            },
            {
                test:/\.js$/,
                use: {
                    loader: 'babel-loader',
                },
                exclude: [
                    path.resolve(__dirname,'src/starvein.js'),
                    path.resolve(__dirname,'src/warehouse.js')
                ],
                include: path.resolve(__dirname,'src')
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name:'images/[name].[ext]',
                        limit:2048
                    }
                },
            },
        ]
    },
    plugins: htmlWebpackPlugins,
    devServer: {
        contentBase: './page/',
        host: 'localhost',
        port: 8002,
        inline: true,
        hot: true,
        open:true
    }
};


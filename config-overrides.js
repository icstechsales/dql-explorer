const webpack = require('webpack');
const version = require("./package.json").version;
const author = require("./package.json").author;
const contributors = require("./package.json").contributors;
const license = require("./package.json").license;
const description = require("./package.json").description;

const banner = [
    "/*!",
    ` ${description}`,
    ` Build ${new Date()} - ${version}`,
    "",
    ` Licensed under the ${license} License`,
    "",
    ` Author: ${author}`,
    ` Author: ${contributors[0].name} <${contributors[0].email}>`,
    "*/"
  ].join("\n");

module.exports = function override(config, env) {

    let plugins= config.plugins;

    plugins.splice(1, 0, 
        new webpack.BannerPlugin({
            banner: banner,
            raw: true,
            entryOnly: true
        })
    )
 
    return config;
}
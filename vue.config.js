const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "/webshop/",
  transpileDependencies: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(glb|gltf)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "assets/models/",
              },
            },
          ],
        },
      ],
    },
  },
});

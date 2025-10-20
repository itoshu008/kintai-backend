module.exports = {
  apps: [{
    name: "kintai-green",
    cwd: "/home/itoshu/apps/kintai-backend",
    script: "dist/server.js",
    interpreter: "/home/itoshu/.nvm/versions/node/v20.19.5/bin/node",
    node_args: "--experimental-specifier-resolution=node",
    env: { NODE_ENV: "production", PORT: "4001" },
    autorestart: true
  }]
}

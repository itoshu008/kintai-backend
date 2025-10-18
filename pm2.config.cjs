module.exports = {
  apps: [
    {
      name: 'kintai-backend',
      cwd: '/home/itoshu/projects/kintai-backend',
      script: 'dist/server.js',
      node_args: ['--enable-source-maps'],
      args: ['--port', '4001'],
      env: { NODE_ENV: 'production' }
    }
  ]
}
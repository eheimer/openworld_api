module.exports = {
  apps: [
    {
      name: 'openworld-api',
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'prod',
        PORT: 3000
      },
      error_file: '/var/log/openworld-api/error.log',
      out_file: '/var/log/openworld-api/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
}

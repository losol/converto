module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: env('DATABASE_CLIENT', 'sqlite'),
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env('DATABASE_PORT', '5432'),
        database: env('DATABASE_NAME', 'converto'),
        password: env('DATABASE_PASSWORD', 'Str0ngPa##word'),
      },
      options: {
        useNullAsDefault: env('OPTION_NULL_AS_DEFAULT', true),
      },
    },
  },
});
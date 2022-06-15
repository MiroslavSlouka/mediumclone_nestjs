import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  host: 'localhost',
  type: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;

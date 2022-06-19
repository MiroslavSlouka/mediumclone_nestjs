import config from '@app/ormconfig';

const seedconfig = {
  ...config,
  migrations: ['src/seeds/*.ts'],
  cli: {
    migrationsDir: 'src/seeds',
  },
};

export default seedconfig;

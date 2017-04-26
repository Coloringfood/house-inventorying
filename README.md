# house-inventorying

### setup
Have NPM installed with at least Node version 6.6.0 (http://node.green/ supporting EC6 features)
```
npm install
```
compile configs
```
cp config/config.sample.json config/config.json
cp config/ui-config.sample.json config/ui-config.json
npm run compile
```

Install sequelize
```
npm install -g sequelize sequelize-cli
```
Run Migrations
```
sequelize db:migrate
```


House-Inventorying
==

# Setup
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

#Pages

- View Homes
- Edit Homes
- Add Items
- View/search Items

# Endpoints

##Houses
<dl>
  <dt>/v1/houses</dt>
  <dd>
    <li>Get</li>
    <li>Post</li>
  </dd>
  <dt>/v1/houses/:house_id</dt>
  <dd>
    <li>Get</li>
    <li>Patch</li>
    <li>Delete</li>
  </dd>
</dl>


##Rooms
<dl>
  <dt>/v1/houses/:house_id/room</dt>
  <dd>
    <li>Get</li>
    <li>Post</li>
  </dd>
  <dt>/v1/houses/:house_id/room/:room_id</dt>
  <dd>
    <li>Get</li>
    <li>Patch</li>
    <li>Delete</li>
  </dd>
</dl>

##Locations
<dl>
  <dt>/v1/houses/:house_id/room/:room_id/location</dt>
  <dd>
    <li>Get</li>
    <li>Post</li>
  </dd>
  <dt>/v1/houses/:house_id/room/:room_id/location/:location_id</dt>
  <dd>
    <li>Get</li>
    <li>Patch</li>
    <li>Delete</li>
  </dd>
</dl>

##Items
<dl>
  <dt>/v1/items</dt>
  <dd>
    <li>Get</li>
    <li>Post</li>
  </dd>
  <dt>/v1/items/:house_id</dt>
  <dd>
    <li>Get</li>
    <li>Patch</li>
    <li>Delete</li>
  </dd>
</dl>

##Pictures

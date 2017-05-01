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
    <li>Get: Get all houses user has access to</li>
    <li>Post: Create a new house</li>
  </dd>
  <dt>/v1/houses/:house_id</dt>
  <dd>
    <li>Get: Get basic house data</li>
    <li>Patch: Update basic house data</li>
    <li>Delete: Soft delete the house</li>
  </dd>
  <dt>/v1/houses/:house_id/users</dt>
  <dd>
    <li>Post: Add User to access ho use</li>
    <li>Delete: Remove User's access to ho use</li>
  </dd>
</dl>


##Rooms
<dl>
  <dt>/v1/houses/:house_id/room</dt>
  <dd>
    <li>Get: Get all rooms attached to the house</li>
    <li>Post: Create a new room in the house</li>
  </dd>
  <dt>/v1/houses/:house_id/room/:room_id</dt>
  <dd>
    <li>Get: Get basic room data</li>
    <li>Patch: Update basic room data</li>
    <li>Delete: Soft delete the room</li>
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

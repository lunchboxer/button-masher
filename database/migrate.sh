#!/bin/bash

echo "node env is $NODE_ENV"
if [ -z "$NODE_ENV" ]; then
  echo "NODE_ENV is not set. Defaulting to 'development'."
  NODE_ENV="development"
fi

# Set the database file based on the environment
case $NODE_ENV in
production)
  localdb="database/production.db"
  ;;
test)
  localdb="database/test.db"
  ;;
*)
  localdb="database/development.db"
  ;;
esac

# Create the database file if it doesn't exist
if [ ! -f $localdb ]; then
  echo "Creating $NODE_ENV database at $localdb"
  touch $localdb
fi

# Apply the schema to the appropriate database
atlas schema apply --to file://database/schema.sql -u sqlite://$localdb --dev-url "sqlite://dev?mode=memory"

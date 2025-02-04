#!/bin/bash
set -e

sleep 10

mongosh --host localhost:27017 -u root -p root --authenticationDatabase admin --eval "rs.initiate({_id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }]});"

watchr
======

Create a Vagrant box if one doesnt already exist in /aws/box (view readme in /box on how to do that).
We are currently using the free tier aws box.

1. vagrant up --provider=aws
2. vagrant provision (resync folders and provision)
3. update database with latest .sql file in ./db/backups. mysql watchr < [name].sql

cd /vagrant
npm start

-------

Start node:

* npm start
* npm run-script debug

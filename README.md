watchr
======

Create a Vagrant box if one doesnt already exist in /aws/box (view readme in /box on how to do that).
We are currently using the free tier aws box.

1. vagrant up --provider=aws
2. Make sure aws security group ssh ip is correct
3. vagrant provision (resync folders and provision)
4. vagrant ssh
5. cd /vagrant
6. update database with latest .sql file in ./db/backups. mysql -u -p watchr < [name].sql

node start

-------

Start node:

* npm start
* npm run-script debug

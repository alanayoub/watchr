watchr
======

Create a Vagrant box if one doesnt already exist in /aws/box (view readme in /box on how to do that).
We are currently using the free tier aws box.

in vagrant up --provider=aws
vagrant provision (resync folders and provision)

update database with latest .sql file in ./db/backups. mysql watchr < [name].sql

cd /vagrant
npm start

#watchr

Create a Vagrant box if one doesnt already exist in /aws/box (view readme in /box on how to do that).
We are currently using the free tier aws box.

1. vagrant up --provider=aws
2. Make sure aws security group ssh ip is correct
3. vagrant provision
4. vagrant ssh
5. cd /vagrant
6. update database with latest .sql file in ./db/backups. mysql -u -p watchr < [name].sql
7. sudo npm install forever -g
8. forever start index.js

### Start normaly
node .
 
### Node Inspector
npm run-script debug (then go to 127.0.0.1:8080/debug?port=5858)

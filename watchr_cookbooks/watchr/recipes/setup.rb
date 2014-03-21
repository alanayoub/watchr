execute "mysql-install-database" do
    command "sudo mysql -u root -p#{node['mysql']['server_root_password']} < /vagrant/db/watchr.sql"      
end

execute "start-server" do
    command "cd /vagrant && npm start"      
end

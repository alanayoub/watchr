execute "mysql-install-privileges" do
    command "sudo mysql -u root -p#{node['mysql']['server_root_password']} < /vagrant/db/watchr.sql"      
end

#mysql_database node['wp-dev']['database'] do
#    connection ({:host => "localhost", :username => 'root', 
#                 :password => node['mysql']['server_root_password']})
#    #NOW THE SQL SCRIPT importing the dump - WORKING
#    sql { ::File.open("/tmp/database.sql").read }
#    #NOW THE 2 QUERIES - Not working at first Run
#    sql "UPDATE WORKING QUERY WHEN COPIED IN MYSQL 1"
#    sql "UPDATE WORKING QUERY WHEN COPIED IN MYSQL 2"
#    action :query
#end

#mysql_database 'run script' do
#  notifies :run, 'execute[apt-get update]', :immediately
#  include_recipe "apt::default"
#  include_recipe "nodejs"
#  include_recipe "mysql::server"
#  include_recipe "database::mysql"
#  connection(
#    :host     => 'localhost',
#    :username => 'root',
#    :password => 'sdfaslkjsdlkjklsdfjkljskldTfjsdklaf' #node['mysql']['server_root_password']
#  )
#  sql { ::File.open('/vagrant/db/watchr.sql').read }
#  action :query
#end

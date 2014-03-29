# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "aws"

  # The url from where the 'config.vm.box' box will be fetched if it
  # doesn't already exist on the user's system.
  # config.vm.box_url = "http://files.vagrantup.com/precise32.box"

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network :forwarded_port, guest: 3000, host: 3000

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network :private_network, ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network :public_network

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  # config.ssh.forward_agent = true

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider :aws do |aws,  override|
     # Use VBoxManage to customize the VM. For example to change memory:
     aws.access_key_id = "AKIAJO4OIM4HROKDHIEQ"
     aws.secret_access_key = "OELcmE60Vbg7EBqJCbhOL+KLKkiQKRRSwsBtRurv"
     aws.keypair_name = "alanayoub-key-pair-virginia"

     aws.instance_type = "t1.micro"
     aws.ami = "ami-35dbde5c"

     override.ssh.username ="ubuntu"
     override.ssh.private_key_path = "./aws/alanayoub-key-pair-virginia.pem"
  end
  
  # Watchr
  config.omnibus.chef_version = :latest
  config.vbguest.auto_update = true
  config.vm.provision :chef_solo do |chef|
      chef.log_level = :debug 
      chef.add_recipe "apt"
      chef.add_recipe "build-essential"
      chef.add_recipe "watchr::apt"
      chef.add_recipe "mysql::server"
      chef.add_recipe "git"
      chef.add_recipe "nodejs"
      chef.add_recipe "npm"
      chef.add_recipe "phantomjs"
      chef.add_recipe "watchr::npmrebuild"
      chef.add_recipe "watchr::setup"
      chef.add_recipe "redisio"
      chef.json = {
          "apt" => {"compiletime" => true},
          "nodejs" => {
              "version" => "0.10.26"
          },
          "mysql" => {
              "server_root_password" => "sdfaslkjsdlkjklsdfjkljskldTfjsdklafuser",
              "server_repl_password" => "sdfaslkjsdlkjklsdfjkljskldTfjsdklafuser",
              "server_debian_password" => "sdfaslkjsdlkjklsdfjkljskldTfjsdklafuser"
          },
          "redisio" => {
              "servers" => [{
                    'name' => 'master', 
                    'port' => '6379'
              }]
          }
      }
      chef.run_list = [
          "recipe[apt]", 
          "recipe[build-essential]", 
          "recipe[watchr::apt]",
          "recipe[mysql::server]",
          "recipe[redisio::install]",
          "recipe[redisio::enable]",
          "recipe[git]",
          "recipe[nodejs]", 
          "recipe[npm]", 
          "recipe[phantomjs::default]", 
          "recipe[watchr::npmrebuild]",
          "recipe[watchr::setup]"
      ]
  end

end

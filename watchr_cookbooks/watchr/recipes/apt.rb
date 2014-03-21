execute "sudo apt-get-update" do
  command "sudo apt-get update -y"
  ignore_failure true
  action :nothing
end

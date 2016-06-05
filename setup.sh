# PYTHON
sudo add-apt-repository -y ppa:fkrull/deadsnakes
sudo apt-get -y update
sudo apt-get -y install python3.5 python3.5-dev
sudo apt-get -y install python-virtualenv
sudo apt-get -y install python-psycopg2

# POSTGRES
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
sudo apt-get -y update
sudo apt-get -y install postgresql-9.5 postgresql-client-9.5 postgresql-contrib-9.5 postgresql-server-dev-9.5

# Then also need to set up postgres database (MANUAL)
# sudo -u postgres psql postgres
# \password postgres (set to "alpha")
# sudo -u postgres createdb anylog

# NVM
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash

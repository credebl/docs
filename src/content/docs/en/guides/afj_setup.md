---
title: AFJ local setup
description: Describe the CREDEBL Platform Architecture
---

 Once you have npm installed you can run the following both to install and upgrade Yarn:

```bash
 npm install --global yarn
```
To install the dependancy packages using yarn:
```bash
 yarn
```
Build Agent controller using the following command: 

```bash 
yarn build
```
Create Docker Image using following command :

```bash 
docker build . -t afj-0.4.2:latest // Base on the afj version
```
**If you want to directly spinup the agent, you can use the follwing command:**

It is recommended to install the SDK packages with APT:
- {library} must be replaced with libindy.
- (xenial|bionic) xenial for 16.04 Ubuntu and bionic for 18.04 Ubuntu.
- {release channel} must be replaced with stable to define corresponded release channel.      Please See the section "Release channels" above for more details.
```bash
sudo apt-get install ca-certificates -y
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys CE7709D068DB5E88
sudo add-apt-repository "deb https://repo.sovrin.org/sdk/deb (xenial|bionic) {release channel}"
sudo apt-get update
sudo apt-get install -y {library}
```
```bash
sudo cp libindy_vdr.so /usr/lib/
sudo cp libindy_vdr.so /usr/local/lib/

```



```bash
./bin/afj-rest.js --config ./samples/cliConfig.json
```

FROM ubuntu:14.04
ENV DEBIAN_FRONTEND noninteractive
RUN rm /etc/apt/sources.list
COPY sources.list /etc/apt/
RUN apt-get update
# 安装必要的软件
RUN apt-get -y install software-properties-common python-software-properties python python-dev  gcc g++  git libtool  libseccomp-dev cmake
RUN cd /tmp && git clone https://github.com/QingdaoU/Judger && cd Judger && git checkout newnew && mkdir build && cd build && cmake .. && make && make install 
RUN apt-get -y install curl
# 安装node 6.9.1
RUN cd /tmp && curl -o node691.tar.xz https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.xz && tar -xf node691.tar.xz && cp -r ./node-v6.9.1-linux-x64/* /usr/ && rm -rf ./node-v6.9.1-linux-x64 node691.tar.xz
# 安装fpc
RUN cd /tmp && curl -o fpc.tar http://nchc.dl.sourceforge.net/project/freepascal/Linux/2.6.4/fpc-2.6.4.x86_64-linux.tar && tar -xf fpc.tar && cd fpc-2.6.4.x86_64-linux && rm install.sh && curl -o install.sh https://raw.githubusercontent.com/RainboyOnlineJudge/judge_server_node/master/build/install.sh && sudo chmod +x ./install.sh && sudo ./install.sh && cd .. && sudo rm -rf fpc.tar fpc-2.6.4.x86_64-linux/
# 安装 node 包
RUN npm i judge_node pm2 mocha should -g
RUN echo 'export NODE_PATH=/usr/lib/node_modules' >> /etc/profile
# 建立 文件夹
RUN mkdir -p /repo /test  /log /code
RUN useradd -r compiler
RUN chown compiler:compiler /test
WORKDIR /code
EXPOSE 8080

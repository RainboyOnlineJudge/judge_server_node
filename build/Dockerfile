FROM ubuntu:14.04
ENV DEBIAN_FRONTEND noninteractive
RUN rm /etc/apt/sources.list
COPY sources.list /etc/apt/
RUN apt-get update
RUN apt-get -y install software-properties-common python-software-properties python python-dev  gcc g++ git libtool  libseccomp-dev cmake
RUN cd /tmp && git clone https://github.com/QingdaoU/Judger && cd Judger && git checkout newnew && mkdir build && cd build && cmake .. && make && make install 
RUN apt-get -y install curl
# 安装node 6.9.1
RUN cd /tmp && curl -o node691.tar.xz https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.xz && tar -xf node691.tar.xz && cp -r ./node-v6.9.1-linux-x64/* /usr/ && rm -rf ./node-v6.9.1-linux-x64 node691.tar.xz
RUN npm i judge_node -g
# 建立 文件夹
RUN mkdir -p /judger_run /test_case /log /code
RUN useradd -r compiler
WORKDIR /code
EXPOSE 8080

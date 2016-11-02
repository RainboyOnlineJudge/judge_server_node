

##  安装nodejs

从官网下载ndoejs

```
tar -xvf node-XXX.gz
```


```
export NODE_HOME=/home/noip/node
export PATH=$PATH:$NODE_HOME/bin
export NODE_PATH=$NODE_HOME/lib/node_modules
```

## 使用tmpfs


https://my.oschina.net/noahxiao/blog/96949

方式很简单，编辑/etc/fstab加入一行，然后重启。 

```
tmpfs /tmp tmpfs defaults,noatime,mode=1777,nosuid,size=2048M 0 0
```

执行df -h就可以看到实际的挂载与使用情况 


## 运行过程

 - config.js 配置文件
 - db.js    数据库操作
 - spwan.js  spwan的文件
 - 只保一个人关于提交的最后一次正确的代码

使用http进行通信

## api 接口设计

``
http协议`
1.上传数据  一个uid 采用流的方式上传
2.请求测试  一个uid 返回json结果
```

## 有关api具体信息看docs

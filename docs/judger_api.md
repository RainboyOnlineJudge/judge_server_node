

`````
    - /ping         judger_server 的信息
    - /data_list(get)     得到测数据信息,基于query
    - /data_list(post)    上传一条的评测数据信息,基于lowDB
    - /file         上传data.zip 数据压缩包和一些data的数据
    - /tmpfile      上传data.zip 数据,测试一次后会被删除
    - /judge        请求评测,不同的参数有不同执行
```



### Get SystemInfo

---------------

 - URL `/ping`

####　Args

 - do not need args


####　Response


```
{
    judger_version:'x.x.x',
}
```


### 文件传输

 - URL `/file`
 - URL `/tmpfile`

#### args

tmpfile /file 都会上传文件,如果选择上传tmpfile ,那judger的数据里的uid 和tmp__uid 就要和tmpfile时候的一样,这样最后会删除文件

 - `uid` 
 - `type` 文件后缀名`.zip`

### Judge

 - URL `/judge`

####　Args

 - `src` 源代码
 - `language` 语言  `cpp pas c`
 - `uid` 评测的数据ID                         requered
 - `tmp_uid` `输出的代码,out,compile的文件`id,requered
 - `max_cpu_time` 最大cpu时间,ms
 - `max_memroy` 最大内存,byte
 - `output` true,返回用户的输出

当tmpuid == uid 的时候 最后会把这个文件夹删掉,tmpuid,就是你上传到的tmpfile 的uid,同时也是代码的保存的地方

不然只会删除tmpuid下的文件

#### Response


```
[
    {
        "cpu_time":1,
        "result":0,
        "memory":12345678,
        "signal":0,
        "error":0,
    },
    {
        "cpu_time":1,
        "result":0,
        "memory":12345678,
        "signal":0,
    }
    {
        "cpu_time":1,
        "result":-1,
        "memory":12345678,
        "signal":0,
        "error":0,
        "detail":'out diff'
    }

]
```

When compilation is failed, following data will be returned

```
{
    "err": "CompileError", 
    "data": "error reason"
}
```
### result field return value

 - WRONG_ANSWER = -1 (this means the process exited normally, but the answer is wrong)
 - SUCCESS = 0 (this means the answer is accepted)
 - CPU_TIME_LIMIT_EXCEEDED = 1
 - REAL_TIME_LIMIT_EXCEEDED = 2
 - MEMORY_LIMIT_EXCEEDED = 3
 - RUNTIME_ERROR = 4
 - SYSTEM_ERROR = 5

### error field return value

 - SUCCESS = 0
 - INVALID_CONFIG = -1
 - CLONE_FAILED = -2
 - PTHREAD_FAILED = -3
 - WAIT_FAILED = -4
 - ROOT_REQUIRED = -5
 - LOAD_SECCOMP_FAILED = -6
 - SETRLIMIT_FAILED = -7
 - DUP2_FAILED = -8
 - SETUID_FAILED = -9
 - EXECVE_FAILED = -10
 - SPJ_ERROR = -11

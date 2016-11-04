/* judger的入口 */
var config  = require('./config.js')
var app  = require('./app.js')

app.listen(config['port'],function(){
    console.log('Judger Server is listening at port: '+ config['port']);
})




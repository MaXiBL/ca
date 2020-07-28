/*
 * @author: dingfangjun@thorough.ai
 * @Date: 2019-02-19 15:15:33
 */
// 开启一个静态服务器
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
let serverUrl = require('./package.json').serverUrl

fs.stat('/opt/build/config/ip.txt', (err) => {
  if (!err) {
    const address = fs.readFileSync('/opt/build/config/ip.txt', 'utf8')
    console.log(address)
    if (address) {
      serverUrl = `http://${address.trim()}`
    }
  }
  Process()
})

function Process () {
  // 读取文件夹,找到app.**.js 文件,并修改url
  fs.readdir('../static/js', (err, files) => {
    if (err) throw err
    files.forEach(file => {
      if (/^app.*\.js$/.test(file)) {
        ChangeServerUrl(file)
      }
    })
  })
}

// 修改服务器地址(前端网页请求地址)
function ChangeServerUrl (fileName) {
  fs.readFile(`../static/js/${fileName}`, 'utf8', (err, data) => {
    if (err) throw err
    const newFileString = data.replace(/prototype.host=".+?"/, `prototype.host="${serverUrl}"`)
    fs.writeFile(`../static/js/${fileName}`, newFileString, (err) => {
      if (err) throw err
      StartServer()
    })
  })
}

// 启动服务
function StartServer () {
  app.use('/static', express.static(path.join(__dirname, '../static')))
  app.use('/plugins', express.static(path.join(__dirname, '../plugins')))
  app.use('/favicon.ico', express.static(path.join(__dirname, '../favicon.ico')))
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
  })
  app.get('/**/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
  })
  app.listen(9090, () => {
    console.log(`App listening at port 9090`)
  })
}

console.log("running....")

const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require("path")
const url = require("url")

let initialWindow
let initialWindowparams = {
    frame: false,
    titleBarStyle: 'hiddenInset',
    width: 539,
    height: 170,
    path: '../interface/initialWindow/initialWindow.html'
}

function createWindow(window,params) {
    window = new BrowserWindow(params)
    window.loadURL(url.format({
        pathname: path.join(__dirname,params.path),
        protocol: 'file',
        slashes: true,
    }))
    window.on('closed',()=>{
        window = null
    })
}

app.on('ready',()=>{createWindow(initialWindow,initialWindowparams)})

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate',()=>{
    if(window === null){
        createWindow()
    }
})
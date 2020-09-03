console.log("running....");

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const ipc = electron.ipcMain;

const debugMode = true;
let initialWindow;
let mainWindow;

//parametros iniciais da janela inicial
let initialWindowparams = {
    frame: false,
    titleBarStyle: "hidden",
    width: 539,
    height: 170,
    resizable: false,
    show: false,
    path: "../interface/initialWindow/initialWindow.html",
    openDevTools: false
};
//parametros inicias da janela principal
let mainWindowparams = {
    title: "ZenView",
    path: "../interface/mainWindow/mainWindow.html",
    show: debugMode,
    webPreferences: {
        nodeIntegration: true,
        webviewTag: true
    },
    openDevTools: debugMode
};
/**
 * cria uma nova janela a partir dos parametros dados
 * @param {object} params objeto que descreve a nova janela
 */
function createWindow(params) {
    let window = new BrowserWindow(params);
    window.loadURL(url.format({
        pathname: path.join(__dirname, params.path),
        protocol: "file",
        slashes: true,
    }));
    if (params.openDevTools) {
        window.openDevTools();
    }
    window.on("closed", () => {
        window = null;
    });
    return window;
}
//event listener que espera o app ser criado para criar as janelas
app.on("ready", () => {
    initialWindow = createWindow(initialWindowparams);
    mainWindow = createWindow(mainWindowparams);
    //apenas mostrara a janela quando estiver pronta
    initialWindow.once("ready-to-show", () => {
        initialWindow.show();
    });
});

//encerra o programa se todas as janelas forem fechadas
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

//caso a janela nao tenha sido criada força sua criação
app.on("activate", () => {
    if (initialWindow === null) {
        createWindow(initialWindow);
        createWindow(mainWindow);
    }
});

//listerner que avisa que o load da janela principal terminou
ipc.on("mainLoadCompleto", () => {
    initialWindow.close();
    setTimeout(() => {
        mainWindow.show();
    }, 250);
});
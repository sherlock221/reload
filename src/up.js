/* 升级逻辑

 1. 检查升级

 2. 下载到临时目录.

 3. 解压到临时文件夹.

 4. 运行临时文件夹的程序，关掉主文件夹的程序.

 5. 临时文件夹的程序考备自己到主文件夹.

 6. 临时文件夹的程序退出，运行考完后的主文件夹的程序.

 */

var gui = require('nw.gui');
var pkg = require('./package.json'); // Insert your app's manifest here
var updater = require('node-webkit-updater');
var upd = new updater(pkg);
var copyPath, execPath;


//如何在临时文件夹中运行区别与主文件运行可以通过传入的参数来判断：
// Args passed when new app is launched from temp dir during update
if(gui.App.argv.length) {
    // ------------- Step 5 -------------
    copyPath = gui.App.argv[0];
    execPath = gui.App.argv[1];

    // Replace old app, Run updated app from original location and close temp instance
    upd.install(copyPath, function(err) {
        if(!err) {

            // ------------- Step 6 -------------
            upd.run(execPath, null);
            gui.App.quit();
        }
    });
}


else { // if no arguments were passed to the app

    // ------------- Step 1 -------------
    upd.checkNewVersion(function(error, newVersionExists, manifest) {
        if (!error && newVersionExists) {
            console.log("有更新下载开始。。。");

            // ------------- Step 2 -------------
            upd.download(function(error, filename) {
                if (!error) {
                    console.log("下载完成。。。");

                    // ------------- Step 3 -------------
                    upd.unpack(filename, function(error, newAppPath) {
                        if (!error) {
                            console.log("解压完成。。。");

                            // ------------- Step 4 -------------
                            upd.runInstaller(newAppPath, [upd.getAppPath(), upd.getAppExec()],{});
                            gui.App.quit();
                        }
                        else{
                            console.error("解压出错..",error.message);
                        }
                    }, manifest);
                }
                else{
                    console.error("下载出错..",error.message);
                }
            }, manifest);
        }
        else{
            console.error("检查版本出错..",error.message);
        }
    });
}
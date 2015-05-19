var Updater = require('node-webkit-mac-updater');

var updater = new Updater({
    source: {
        mac: "http://192.168.1.106:7000/firstReact/reload.zip",
        win: "http://192.168.1.106:7000/firstReact/reload.zip",
        linux: "http://localhost:3000/releases/updapp/linux32/reload.zip"
    }
});

updater.update(function(err){
    if (!err) console.log('App has been updated!');
});
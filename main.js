const { app, BrowserWindow, ipcMain } = require('electron');
const process = require('child_process');
const io = require('socket.io')(8181);
const ipc = ipcMain;
const fs = require('fs');

// Prepare window of Scribble Builder
function createWindow () {
	let win = new BrowserWindow({
    	width: 600,
		height: 800,
		minWidth: 600,
		minHeight: 800,
    	webPreferences: {
      		nodeIntegration: true
    	}
  	});
	win.setMenuBarVisibility(false);
	win.loadFile('public/index.html');
	
	win.webContents.openDevTools();
}

// Open window
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
	  	app.quit();
	}
});
  
app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
	  	createWindow();
	}
});


// COMMUNICATION WITH SCRIBBLE EDITOR
var IsEditorConnected = false;
var IsCurrentlyBuilding = false;

io.on('connection', (socket) => {
	console.log("Scribble Editor Connected!");
	IsEditorConnected = true;

  	socket.on('build_android', (build_config) => {
		console.log(build_config);
		IsCurrentlyBuilding = true;

		// Let the magic begin!
		try {
			//, [build_config.GameName]
			var process_prepareProject = process.spawn(app.getAppPath() + '\\scripts\\setup_project.bat', [build_config.GameName, 'com.test.test', app.getAppPath()]);
			
			process_prepareProject.stdout.on('data', function (data) {
			  console.log(data.toString());
			});
			process_prepareProject.stderr.on('data', function (data) {
			  console.log(data.toString());
			});
			process_prepareProject.on('close', function (code) {
			   	fs.writeFile('build_dir/' + build_config.GameName + '/www/data.js', 'var data = `' + JSON.stringify(build_config) + '`', 'utf-8', function() {
					try {
						//var ls = process.spawn(app.getAppPath() + '\\scripts\\run_cordova_dev.bat', [build_config.GameName, app.getAppPath()]);
						var process_buildAndroid = process.spawn(app.getAppPath() + '\\scripts\\build_android.bat', [build_config.GameName, app.getAppPath()]);
						
						process_buildAndroid.stdout.on('data', function (data) {
							console.log(data.toString());
						});
						process_buildAndroid.stderr.on('data', function (data) {
							console.log(data.toString());
						});
					} catch(e) {
						console.log(e);
					}
				});
			});
		} catch(e) {
			console.log(e);
		}
  	});

  	socket.on('disconnect', () => {
    	io.emit('user disconnected');
  	});
});

ipc.on('syncRequest', function(event, args) {
	event.returnValue = JSON.stringify({
		IsEditorConnected: IsEditorConnected,
		IsCurrentlyBuilding: IsCurrentlyBuilding,
	});
});

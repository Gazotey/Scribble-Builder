const { getIsEditorConnected, getIsCurrentlyBuilding } = require('electron').remote.require('./main.js');
const ipc = require('electron').ipcRenderer;

window.setInterval(function() {
    vars = JSON.parse(ipc.sendSync('syncRequest'));
    console.log(vars);
    app.isEditorConnected = vars.IsEditorConnected;
    app.isCurrentlyBuilding = vars.IsCurrentlyBuilding;
}, 1000);

var app = new Vue({
    el: '#app',
    data() {
        return {
            isEditorConnected: false,
            isCurrentlyBuilding: false,
        };
    },
    created() {
        ipc.on('IsEditorConnected', function(event, data) {
            console.log(data);
        });


        ipc.on('IsCurrentlyBuilding', function(event, data) {
            console.log(data);
        });
    },
    methods: {
        
    }
});
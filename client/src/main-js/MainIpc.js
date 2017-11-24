class MainRemote {
	constructor(channel){
		this.data = {}
		var electron = require("electron")

		if (MainRemote.instance){
			throw new Error("monoinstance")
		} else {
			MainRemote.instance = this
		}

		electron.ipcMain.on('ipc_proxy',this.handler.bind(this))
	}

	register(name,data){
		this.data[name]=data
		return this
	}

	handler(event,msg){
		console.log("NEW STORAGE")
		var reply     =(data)=> {event.sender.send("ipc_proxy_reply ("+msg.replyChannel+")",{status:"ok",  data:data})}
		var replyFail =(data)=> {event.sender.send("ipc_proxy_reply ("+msg.replyChannel+")",{status:"fail",data:data})}
		try {
			console.log("MSG",msg)
			switch (msg.action) {
				case "setValue":
					this.getValue(msg.path)[msg.prop]=msg.value
					reply();
					break;
				case "getValue":
					reply(this.getValue(msg.path))
					break;
				case "callSync":
					reply(this.getValue(msg.path)(...msg.arguments))
					break;
				case "callAsync":
					this.getValue(msg.path)(...msg.arguments).then(reply)
					break;
			}
		} catch (e) {
			console.log("FAIL")
			console.error(e)
			replyFail(e.toString());
		}
	}

	getValue(sentPath) {
		var value = this.data
		for (var key of sentPath) {
			value = value[key]
		}
		console.log('keys:',sentPath,'value:',value)
		return value
	}
}

module.exports.default = MainRemote

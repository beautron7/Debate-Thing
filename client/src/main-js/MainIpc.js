class MainRemote {
	constructor(channel){
		this.handler = this.handler.bind(this)
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
		var reply     =(data)=> {event.sender.send("ipc_proxy_reply ("+msg.replyChannel+")",{status:"ok",  data:data})}
		var replyFail =(data)=> {event.sender.send("ipc_proxy_reply ("+msg.replyChannel+")",{status:"fail",data:data})}
		try {
			var value = this.getValue(msg.path)
			switch (msg.action) {
				case "setValue":
					value[msg.prop]=msg.value
					reply();
					break;
				case "getValue":
					reply(value)
					break;
				case "callSync":
					reply(value(...msg.arguments))
					break;
				case "callAsync":
					value(...msg.arguments).then(reply)
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
		return value
	}
}

module.exports.default = MainRemote

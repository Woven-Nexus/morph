const url = 'ws://' + location.host;

const setupConnection = () => {
	try {
		let socket = new WebSocket(url);
		socket.addEventListener('close', async () => {
			socket = new WebSocket(url);
			socket.addEventListener('open', () => location.reload());
		});
	}
	catch (err) {
		setupConnection();
	}
};

setupConnection();

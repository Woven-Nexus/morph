const url = 'ws://' + location.host;
let socket = new WebSocket(url);

socket.addEventListener('close', async () => {
	socket = new WebSocket(url);
	socket.addEventListener('open', () => location.reload());
});

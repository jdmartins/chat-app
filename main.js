import WebSocket from 'ws';
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import bodyParser from 'body-parser';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/enter', (req, res) => {
	console.log(req.body.username);
	res.json({ userList: ['maica', 'mitrica'] });
});

const server = app.listen(1111);
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
	const id = crypto.randomBytes(20).toString('hex');
	// add to the connected users map
	// connectedUsers.set(id, ws);

	console.log('conntected: %s', ws);

	ws.onmessage = (ev) => {
		const msg = JSON.parse(ev.data.toString()).msg;
		// ws.send(msg);

		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(msg);
			}
		});
	};

	ws.onclose = (w) => {
		console.log('closed: %s', w);
	};
});

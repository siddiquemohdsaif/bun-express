import BunExpress from './lib/bun-express.js';

const app = BunExpress.createApp();

// Sample middleware
app.use((req) => {
    req.timestamp = Date.now();
});
app.use(BunExpress.json());

// Routes
app.get('/', async (req, res) => {
    // Simulate some asynchronous operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send("Hello from the home page!");
});

app.get('/ddd', (req, res) => {
    res.send("Hello from /ddd!" + req.timestamp);
});

app.post('/jsonBody/:ssss', async (req, res) => {
    res.send("body.data :" + req.BODY.data + " param:" +req.params.sss);
});

app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    res.send(`User ID: ${userId}`);
});

app.get('/path/*', async (req, res) => {
    res.send( " path:"+req.url);
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}. Timestamp: ${Date.now()}`));

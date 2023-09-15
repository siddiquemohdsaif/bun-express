const { createApp } = require('./lib/bun-express');

const app = createApp();

// Sample middleware
app.use((req) => {
    req.timestamp = Date.now();
});

// Routes
app.get('/', async (req, res) => {
    // Simulate some asynchronous operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.send("Hello from the home page!");
});

app.get('/ddd', (req, res) => {
    res.send("Hello from /ddd!" + req.timestamp);
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}. Timestamp: ${Date.now()}`));

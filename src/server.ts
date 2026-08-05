import app from './app.js';
import config from './config/config.js';

app.listen(config.port, () => {
    console.log(`server running on http://localhost${config.port}`);
});

const next = require('next');
const app = next({ dev: false });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  require('http')
    .createServer((req, res) => handle(req, res))
    .listen(port, () => {
      console.log('🚀 Frontend running on port ' + port);
    });
});

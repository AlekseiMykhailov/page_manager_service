const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3005;

module.exports = {
  name: 'web',

  async created() {
    this.app = express();

    this.app.use('/assets', express.static('dist'));
    this.app.engine('.hbs', exphbs({
      extname: '.hbs',
    }));
    this.app.set('view engine', '.hbs');

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // let fileExtension;
    // let contentType = 'text/html';
    // const actions = {
    //   css: () => { contentType = 'text/css'; },
    //   js: () => { contentType = 'text/javascript'; },
    // };

    // (actions[fileExtension])();


    this.app.get('/', async (req, res) => {
      return res.render('index');
    });

    this.app.get('/public/*', async (req, res) => {

      const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.js' : req.url);
      const ext = path.extname(filePath);

      this.logger.info('#################', filePath, ext);

      return res.render('index', {
        options: JSON.stringify('my option'),
      });
    });
  },

  started() {
    this.server = this.app.listen(
      PORT,
      () => console.log(`App listening on port http://localhost:${PORT}`),
    );
  },

  stopped() {
    this.server.close();
  },
};


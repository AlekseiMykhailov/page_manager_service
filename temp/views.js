const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const PORT = process.env.PORT || 3005;

const app = express();

app.use('/assets', express.static('dist'));
app.set('views', path.resolve(__dirname, 'views'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: null,
}));

app.set('view engine', '.hbs');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));

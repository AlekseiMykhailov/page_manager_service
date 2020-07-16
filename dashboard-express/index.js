const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const routes = require('./routes');
const PORT = process.env.PORT || 3005;

const app = express();

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'layout' }));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use('/', routes);

app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));

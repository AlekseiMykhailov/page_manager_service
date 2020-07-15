const Handlebars = require('handlebars');
const rowWithImage = Handlebars.compile(`
  <section class="with-image">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <div>
      <img src="{{ image }}" alt="{{ title }}"
    </div>
  </section>
`);

module.exports = rowWithImage;

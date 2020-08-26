const Handlebars = require('handlebars');

const header = Handlebars.compile(`
  <section class="with-image container" style="background-image: url({{ backgroundImageURL }});">
    <div class="with-image__wrapper">
      <div class="with-image__content-block">
        <h2 class="with-image__title">{{ title }}</h2>
        <p class="with-image__description">{{ description }}</p>
      </div>
    </div>
  </section>
`);

module.exports = { header };

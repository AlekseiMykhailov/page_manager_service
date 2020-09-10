const Handlebars = require('handlebars');

const header = Handlebars.compile(`
  <section class="header container" style="background-image: url({{ backgroundImage }});">
    <div class="header__wrapper">
      <div class="header__content-block">
        <h2 class="header__title">{{ title }}</h2>
        <p class="header__description">{{ description }}</p>
      </div>
      <div class="buttons">
        {{#each buttons}}
          <a href="{{ this.url }}" class="button">
            {{ this.text}}
          </a>
        {{/each}}
      </div>
    </div>
  </section>
`);

module.exports = { header };

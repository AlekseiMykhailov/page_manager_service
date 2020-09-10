const Handlebars = require('handlebars');

const reviews = Handlebars.compile(`
  <section class="reviews container">
    <ul class="reviews__list">
      {{#each reviews}}
        <li class="reviews__item">
          {{ this.reviewer }}
          {{ this.authorPhoto }}
          {{ this.companyName }}
          {{ this.companyLogo }}
          {{ this.text }}
        </li>
      {{/each}}
    </ul>
  </section>
`);

module.exports = { reviews };

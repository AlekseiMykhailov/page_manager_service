const Handlebars = require('handlebars');

const benefits = Handlebars.compile(`
<section class="benefits container">
  <div class="benefits__wrapper">
    <h2 class="benefits__title">{{ title }}</h2>
    <ul class="benefits__list">
      {{#each benefits}}
        <li class="benefits__item benefit">
          <h4 class="benefit__header">{{this.title}}</h4>
          <p class="benefit__content">{{this.description}}</p>
        </li>
      {{/each}}
    </ul>
  </div>
</section>
`);

module.exports = { benefits };

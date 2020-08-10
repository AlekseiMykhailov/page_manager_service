const Handlebars = require('handlebars');

const rowBricks = Handlebars.compile(`
<section class="bricks container">
  <div class="bricks__wrapper">
    <h2 class="bricks__title">{{ title }}</h2>
    <ul class="bricks__list">
      {{#each bricks}}
        <li class="bricks__item brick-simple">
          <p class="brick-simple__content">{{this.value}}
        </li>
      {{/each}}
    </ul>
  </div>
</section>
`);

module.exports = { rowBricks };

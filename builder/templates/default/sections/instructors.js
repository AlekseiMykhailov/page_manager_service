const Handlebars = require('handlebars');

const instructors = Handlebars.compile(`
  <section class="instructors container">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <ul class="reviews__list">
      {{#each fieldsets.instructors.fields}}
        <li class="instructors__item">
          {{ this.name }}
          {{ this.photo }}
          {{ this.about }}
          {{ this.email }}
          {{ this.linkedIn }}
          {{ this.facebook }}
        </li>
      {{/each}}
    </ul>
  </section>
`);

module.exports = { instructors };

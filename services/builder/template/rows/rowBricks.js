const Handlebars = require('handlebars');
const rowBricks = Handlebars.compile(`
  <section class="bricks">
    <h2>{{title}}</h2>
    {{#if content}}
      <p>{{ content }}</p>
    {{/if}}
    <ul class="people_list">
      {{#each blocks}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
  </section>
`);

module.exports = rowBricks;

const Handlebars = require('handlebars');
const list = Handlebars.compile(`
  <section class="list">
    {{#if h1}}
      <h1>{{ h1 }}</h1>
    {{/if}}
    {{#if content}}
      <p>{{ content }}</p>
    {{/if}}
    <ul class="list">
      {{#each items}}
        <li>
          <a href="./{{#if this.domain}}preview/{{ this.domain }}/{{/if}}{{ this.slug }}">
            {{ this.title }}
          </a>
        </li>
      {{/each}}
    </ul>
  </section>
`);

module.exports = list;

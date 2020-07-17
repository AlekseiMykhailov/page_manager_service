const Handlebars = require('handlebars');
const list = Handlebars.compile(`
<style>
  .list-section__wrapper {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .list {
    margin: 0;
    padding: 0;
    box-shadow: 0 8px 20px 0 rgba(63,67,191,.12);
  }
  .list__item {
    list-style: none;
    padding: 0;
    border-bottom: 1px solid #eaebf8;
  }
  .list__link {
    display: block;
    padding: 1rem 2rem;
    text-decoration: none;
    background-color: transparent;
    transition: background-color .3s;
  }
  .list__link:hover,
  .list__link:focus {
    background-color: #fff;
  }
</style>
<section class="list-section container">
  <div class="list-section__wrapper">
    {{#if h1}}
      <h1>{{ h1 }}</h1>
    {{/if}}
    {{#if content}}
      <p>{{ content }}</p>
    {{/if}}

    <ul class="list">
      {{#each items}}
        <li class="list__item">
          <a
            class="list__link"
            href="./{{#if this.section}}{{ this.section }}/{{/if}}{{#if this.domain}}{{ this.domain }}/{{/if}}{{ this.slug }}"
          >
            {{ this.title }}
          </a>
        </li>
      {{/each}}
    </ul>
  </div>
</section>
`);

module.exports = list;

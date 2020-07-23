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
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    padding: 0;
    border-bottom: 1px solid #eaebf8;
  }
  .list__item:hover,
  .list__item:focus {
    background-color: #fff;
  }
  .list__link {
    display: block;
    padding: 1rem 2rem;
    text-decoration: none;
    background-color: transparent;
    transition: background-color .3s;
  }
  .list__buttons {
    display: flex;
    padding: 1rem 2rem;
  }

  .list__button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 2rem;
    margin-left: 1rem;
    padding: 0 1.5rem;
    text-decoration: none;
    color: #737ad8;
    border-radius: 1.5rem;
    border: 0;
    border: 1px solid #737ad8;
    transition: border-color .3s, background-color .3s, color .3s;
    outline: none;
  }
  .list__button:hover,
  .list__button:focus {
    color: #fff;
    border-color: #4049bc;
    background-color: #737ad8;
    cursor: pointer;
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

    {{editLinks}}, {{previewLinks}}

    <ul class="list">
      {{#each items}}
        <li class="list__item">
          <a
            class="list__link"
            href="./{{#if this.section}}{{ this.section }}/{{/if}}{{ this.slug }}"
          >
            {{ this.title }}
          </a>
          <div class="list__buttons">
            {{#if this.editLink}}
              <a href="/pages/{{ slug }}" class="list__button">Edit</a>
            {{/if}}
            {{#if this.previewLink}}
              <a href="/pages/preview/{{ slug }}" class="list__button">Preview</a>
            {{/if}}
          </div>
        </li>
      {{/each}}
    </ul>
  </div>
</section>
`);

module.exports = list;

const Handlebars = require('handlebars');
const rowBricks = Handlebars.compile(`
  <style>
    .bricks {}
    .bricks__wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    .bricks__title {
      font-size: 40px;
      line-height: 52px;
      text-align: center;
    }
    .bricks__list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin: 0;
      padding: 0;
    }
    .bricks__item {
      list-style: none;
      margin: 0;
      padding: 24px 40px;
      justify-content: center;
      border-radius: 12px;
      border: 1px solid #eaebf8;
      background-color: #fff;
      text-align: center;
      box-shadow: 0 8px 20px 0 rgba(63,67,191,.12);
      color: #333;
      font-size: 18px;
      line-height: 32px;
      font-weight: 400;
    }

    @media screen and (max-width: 1024px) {
      .bricks__list {
        grid-template-columns: 1fr;
        max-width: 400px;
        margin: 0 auto;
      }
    }
  </style>
  <section class="bricks container">
    <div class="bricks__wrapper">
      <h2 class="bricks__title">{{title}}</h2>
      {{#if content}}
        <p class="bricks__content">{{ content }}</p>
      {{/if}}
      <ul class="bricks__list">
        {{#each bricks}}
          <li class="bricks__item">{{this}}</li>
        {{/each}}
      </ul>
    </div>
  </section>
`);

module.exports = rowBricks;

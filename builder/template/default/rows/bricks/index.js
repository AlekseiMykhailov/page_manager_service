const Handlebars = require('handlebars');
const { BRICKS_TYPE } = require('./config');

Handlebars.registerHelper('isSimple', function (bricks) {
  return bricks.type === BRICKS_TYPE.simple;
});

Handlebars.registerHelper('isPerson', function (bricks) {
  return bricks.type === BRICKS_TYPE.person;
});

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

  .brick-simple {}
  .brick-simple__title {}
  .brick-simple__content {}

  .brick-person {}
  .brick-person__photo {}
  .brick-person__content {}
  .brick-person__linked-in {}

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
    <h2 class="bricks__title">{{ title }}</h2>
    {{#if subTitle}}
      <h2 class="bricks__sub-title">{{ subTitle }}</h2>
    {{/if}}

    <ul class="bricks__list">
      {{#each bricks}}

        {{#if (isSimple bricks)}}
          <li class="bricks__item brick-simple">
            {{#if this.title}}
              <h2 class="brick-simple__title">{{this.title}}</h2>
            {{/if}}
            <p class="brick-simple__content">{{this}}
          </li>
        {{/if}}

        {{#if (isPerson bricks)}}
          <li class="bricks__item brick-person">
            <img src="{{this.photo}}" alt="{{this.personName}}" class="brick-person__photo" />
            <p class="brick-person__content">{{this.content}}</p>
            <a class="brick-person__linked-in" href="{{this.linkedIn}}"></a>
          </li>
        {{/if}}

      {{/each}}
    </ul>

    {{#if subContent}}
      <p class="bricks__sub-content">{{ subContent }}</p>
    {{/if}}
  </div>
</section>
`);

module.exports = rowBricks;

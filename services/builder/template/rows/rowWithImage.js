const Handlebars = require('handlebars');
const rowWithImage = Handlebars.compile(`
  <style>
    .with-image {
      display: flex;
      align-items: center;
      min-height: 100vh;
      background-color: #fff;
      background-image: url({{ image }});
      background-size: contain;
      background-position: 130%;
      background-repeat: no-repeat;
    }
    .with-image__wrapper {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      flex-direction: column;
      justify-items: center;
    }
    .with-image__content {
      max-width: 400px;
    }
    .with-image__title {
      font-size: 40px;
      line-height: 52px;
      text-align: left;
    }

    @media screen and (max-width: 1024px) {
      .with-image {
        align-items: flex-start;
        background-position: right bottom;
      }
      .with-image__content {
        max-width: 100%;
        text-align: center;
      }
      .with-image__title {
        text-align: center;
      }
    }
  </style>
  <section class="with-image container">
    <div class="with-image__wrapper">
      <div class="with-image__content">
        <h2 class="with-image__title">{{ title }}</h2>
        <p class="with-image__content">{{ content }}</p>
      </div>
    </div>
  </section>
`);

module.exports = rowWithImage;

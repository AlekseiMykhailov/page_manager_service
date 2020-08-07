const Handlebars = require('handlebars');

Handlebars.registerHelper('noRows', (value) => !value);

const layout = Handlebars.compile(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="./images/favicon32.png" type="image/png">
    <meta name="description" content="{{ descr }}">
    <title>{{ title }}</title>
    <style>
      * {
        box-sizing: border-box;
      }
      html {
        font-size: 16px;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        font-size: 1rem;
        line-height: 2rem;
        color: #222;
        background-color: #f6f6fd;
      }
      .container {
        width: 100%;
        padding: 80px 0 120px;
      }

      .dashboard-nav {
        position: fixed;
        top: 1rem;
        right: 0;
        padding: 0 2rem;
        border-radius: 12px 0 0 12px;
        border: 1px solid #eaebf8;
        background-color: #fff;
        box-shadow: 0 8px 20px 0 rgba(63,67,191,.12);
        z-index: 2;
      }
      .dashboard-nav__list {
        display: grid;
        grid-auto-flow: column;
        gap: 1rem;
        padding: 0;
        margin: 0;
      }
      .dashboard-nav__item {
        list-style: none;
        padding: 0;
      }
      .dashboard-nav__link {
        display: block;
        padding: 1rem 0.5rem;
        color: #737ad8;
        text-decoration: none;
        transition: color .2s ease, background-color .2s ease;
      }
      .dashboard-nav__link:hover,
      .dashboard-nav__link:focus {
        color: #4049bc;
        background-color: #f6f6fd;
      }
      .dashboard-nav__link--caution {
        color: red;
      }
      .dashboard-nav__link--allow {
        color: green;
      }

      .temp {
        margin-top: 120px;
      }
      .temp h1,
      .temp h2 {
        text-align: center;
      }
    </style>
  </head>

  <body>


<img src="/images/photo-cover.png" />

    {{#if (noRows rows)}}
      <div class="temp">
        {{#if title}}<h1>{{ title }}</h1>{{/if}}
        {{#if descr}}<h2>{{ descr }}</h2>{{/if}}
      </temp>
    {{/if}}
    {{ rows }}
    {{ body }}
  </body>
</html>
`, {
  noEscape: true,
});

module.exports = layout;

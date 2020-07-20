const Handlebars = require('handlebars');
const buttonHtml = Handlebars.compile(`
<style>
  .button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 48px;
    padding: 0 22px;
    border-radius: 24px;
    border: 0;
    background-color: #737ad8;
    transition: background-color .2s ease;
    color: #fff;
    font-size: 20px;
    line-height: 48px;
    font-weight: 500;
    text-transform: none;
    outline: none;
  }
  .button:hover,
  .button:focus {
    background-color: #4049bc;
    cursor: pointer;
  }
  .button--round {
    border-radius: 50%;
    width: 48px;
    padding: 0;
  }
</style>
<button type="{{ type }}" class="button {{ className }}">
  {{ text }}
</button>
`);

module.exports = {
  buttonHtml,
};

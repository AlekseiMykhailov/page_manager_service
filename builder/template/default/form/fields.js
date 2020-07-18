const Handlebars = require('handlebars');
const inputText = Handlebars.compile(`
<style>
  .field {}
  .field__label {}
  .field__element {
    height: 48px;
    max-height: 120px;
    min-height: 0;
    margin-bottom: 12px;
    border: 1px solid #d0d2eb;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
    padding: 8px 12px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
  }
  .field__element:focus {
    border-color: #3898EC;
    outline: none;
  }
</style>
<div class="form__field field">
  <label for="{{ name }}" class="field__label">
    {{ label }}
    <input
      type="text"
      name="{{ name }}"
      id="{{ name }}"
      {{#if required}}required{{/if}}
      class="field__element"
      placeholder="{{ placeholder }}"
    />
  </label>
</div>
`);

const inputUrl = Handlebars.compile(`
<div class="form__field field">
  <label for="{{ name }}" class="field__label">
    <input
      type="url"
      name="{{ name }}"
      id="{{ name }}"
      {{#if required}}required{{/if}}
      class="field__element"
      placeholder="{{ placeholder }}"
    />
  </label>
</div>
`);

const inputFile = Handlebars.compile(`
<div class="form__field field">
  <label for="{{ name }}" class="field__label">
    <input
      type="file"
      name="{{ name }}"
      id="{{ name }}"
      {{#if required}}required{{/if}}
      class="field__element"
      placeholder="{{ placeholder }}"
    />
  </label>
</div>
`);

module.exports = {
  inputText,
  inputUrl,
  inputFile,
};

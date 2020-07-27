const Handlebars = require('handlebars');

const select = Handlebars.compile(`
<div class="form__field field">
  <label for="{{ name }}" class="field__label">
    {{ label }}
    <select
      name="{{ name }}"
      id="{{ name }}"
      class="field__element"
      {{#if required}}required{{/if}}
    >
      {{#each options}}
        <option value="{{this.value}}" selected="selected">
          {{ this.value }}
        </option>
      {{/each}}
      <option value="localhost:4000" selected="selected">localhost:4000</option>
      <option value="localhost:5000">localhost:5000</option>
    </select>
  </label>
</div>
`);

module.exports = { select };

const Handlebars = require('handlebars');
const fieldSet = Handlebars.compile(`
<style>
  .fieldset {
    margin-bottom: 10px;
  }
</style>
<fieldset class="fieldset">
  <legend>
    {{ title }}
  </legend>
  {{{ fields }}}
  {{{ blocks }}}
  {{{ button }}}
</fieldset>
`);

module.exports = {
  fieldSet,
};

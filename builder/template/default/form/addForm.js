const Handlebars = require('handlebars');
const layout = Handlebars.compile(`
<style>
  .form-section {}
  .form-section__wrapper {
    max-width: 60rem;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .form {
    width: 100%;
  }
  .form__field-wrapper {}
  .form__button {
    margin-top: 8px;
  }

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
<section class="form-section container">
  <div class="form-section__wrapper">
    <form action="http://localhost:3000/drafts" method="POST" id="add-draft" class="form">
      <div class="form__field field">
        <label for="domain" class="field__label">
          <select name="domain" id="domain" class="field__element">
            <option value="localhost:4000" selected="selected">localhost:4000</option>
            <option value="localhost:5000">localhost:5000</option>
          </select>
        </label>
      </div>

---------------------------------------------------------
      {{{ fields }}}
      {{{ fieldSet }}}
      {{{ button }}}
    </form>
  </div>
</section>
`);

module.exports = layout;

const Handlebars = require('handlebars');
const editRowForm = Handlebars.compile(`
<style>
  .form--bordered {
    margin-top: 4rem;
    padding: 2rem;
    box-shadow: 0 8px 20px 0 rgba(63,67,191,.12);
  }

  .button--danger {
    color: red;
    background-color: transparent;
    border-color: red;
  }
  .button--danger:hover,
  .button--danger:focus {
    background-color: red;
    border-color: white;
  }
</style>
<form action="/rows/{{ id }}" method="POST" class="form form--bordered">
  <input type="hidden" name="id" value="{{ id }}" />
  <h2>{{ rowTitle }}</h2>
  <div class="form__field field">
    <label for="order-row-{{ id }}" class="field__label">
      Order:
      <input
        type="number"
        name="order"
        id="order-row-{{ id }}"
        required
        class="field__element"
        value="{{ order }}"
      />
    </label>
  </div>
  {{{ fields }}}
  <div class="form__buttons">
    <a href="/rows/delete/{{ id }}" type="submit" class="form__button button button--danger">Delete Row</a>
    <button type="submit" class="form__button button">Save Row</button>
  </div>
</form>
`);

module.exports = { editRowForm };

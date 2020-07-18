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
  .form__buttons {
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
  }
  .form__button {}

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

  .button {
    display: inline-block;
    width: 100%;
    height: 48px;
    margin-top: 8px;
    padding: 0 22px;
    border-radius: 24px;
    border: 1px solid transparent;
    background-color: #737ad8;
    color: #fff;
    font-size: 20px;
    line-height: 48px;
    font-weight: 500;
    text-transform: none;
    transition: background-color 0.3s, color 0.3s, opacity 0.3s;
  }

  .button:hover,
  .button:focus {
    color: #fff;
    background-color: #4049bc;
    opacity: 1;
    cursor: pointer;
  }
  .button--success {
    background-color: green;
    opacity: 0.7;
  }
  .button--success:hover,
  .button--success:focus {
    background-color: green;
  }
  .button--empty {
    color: #737ad8;
    background-color: transparent;
    border: 1px solid #737ad8;
  }
</style>
<section class="form-section container">
  <div class="form-section__wrapper">
    <h1>{{ h1 }}</h1>
    <form action="http://localhost:3000/pages" method="POST" id="add-draft" class="form">
      <div class="form__field field">
        <label for="domain" class="field__label">
          <select name="domain" id="domain" class="field__element">
            <option value="localhost:4000">localhost:4000</option>
            <option value="localhost:5000">localhost:5000</option>
          </select>
        </label>
      </div>
      <div class="form__field field">
        <label for="title" class="field__label">
          <input type="text" name="title" id="title" required class="field__element" placeholder="Title" value="{{ title }}">
        </label>
      </div>
      <div class="form__field field">
        <label for="slug" class="field__label">
          <input type="text" name="slug" id="slug" required class="field__element" placeholder="Slug" value="{{ slug }}">
        </label>
      </div>
      <div class="form__field field">
        <label for="descr" class="field__label">
          <input type="text" name="descr" id="descr" class="field__element" placeholder="Description" value="{{ descr }}">
        </label>
      </div>
      <div class="form__buttons">
        <button type="submit" class="form__button button button--empty">Cancel</button>
        <button type="submit" class="form__button button">Save Draft</button>
        <button type="submit" class="form__button button button--success">Publish Page</button>
      </div>
    </form>
  </div>
<section>
`);

module.exports = layout;

const Handlebars = require('handlebars');
const editForm = Handlebars.compile(`
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
    <form action="/pages/" method="POST" id="edit-form" class="form">
      <div class="form__field field">
        <label for="title" class="field__label">
          <input type="text" name="title" id="title" required class="field__element" placeholder="Title" value="{{ title }}">
        </label>
      </div>
      <div class="form__field field">
        <label for="slug" class="field__label">
          <input type="text" name="slug" id="slug" required class="field__element" placeholder="Slug" value="{{ slug }}" disabled>
        </label>
      </div>
      <div class="form__field field">
        <label for="description" class="field__label">
          <input type="text" name="description" id="description" class="field__element" placeholder="Description" value="{{ description }}">
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
<script>
  const form = document.getElementById('edit-form');
  const slug = document.getElementById('slug');
  const defaultActionURL = form.action;
  form.action = defaultActionURL + slug.value;

  console.log(defaultActionURL, slug.value);

  slug.addEventListener('input', (e) => {
    const { value } = e.target;
    form.action = defaultActionURL.value + value;
  });
</script>
`);

module.exports = { editForm };

const Handlebars = require('handlebars');

const applyForm = Handlebars.compile(`
  <section class="form container">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <form action="{{ action }}">
      <label>
        <input type="text" name="name" placeholder="Your full name" required>
      </label>
      <label>
        <input type="tel" name="phone" placeholder="Phone (999 555-2222)" required>
      </label>
      <label>
        <input type="email" name="email" placeholder="Email" required>
      </label>
      {{#each fieldsets.additionalFields.fields}}
        <label>
          <input 
            type="{{ this.type }}" 
            name="{{ this.name }}" 
            placeholder="{{ this.description }}"
          >
        </label>
      {{/each}}
      <button type="submit">{{ buttonText }}</button>
    </form>
  </section>
`);

module.exports = { applyForm };

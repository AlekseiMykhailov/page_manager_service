const Handlebars = require('handlebars');
const layout = Handlebars.compile(`
<h1>Add Drat</h1>
<form action="http://localhost:3000/pages" method="POST" id="add-draft">
  <div>
    <label for="domain">
      Domain:
      <select name="domain" id="domain">
        <option value="localhost:4000">localhost:4000</option>
        <option value="localhost:5000">localhost:5000</option>
      </select>
    </label>
  </div>

  <div>
    <label for="title">
      Title:
      <input type="text" name="title" id="title" required>
    </label>
  </div>
  <div>
    <label for="slug">
      Slug:
      <input type="text" name="slug" id="slug" required>
    </label>
  </div>
  <div>
    <label for="descr">
      Description:
      <input type="text" name="descr" id="descr" required>
    </label>
  </div>
  <div>
    <button type="submit">Submit</button>
  </div>
</form>
`);

module.exports = layout;

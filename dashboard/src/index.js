'use strict';

class Root extends React.Component {
  render() {
    return (
      <h1>
        React App
      </h1>
    );
  }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<Root />, domContainer);

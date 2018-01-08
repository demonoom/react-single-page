import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';

import App from './components/App';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import Stage4 from './components/Stage4';
import Stage5 from './components/Stage5';
// import questionBank from './components/questionBank/questionBank';
import questionBank2 from './components/aaa/questionBank';
import Stage7 from './components/Stage7';
import Stage8 from './components/Stage8';

import './index.less';

class Index extends React.Component {
  render() {
    return (
      <div className="body">
        <h1>Stages list</h1>
        <ul role="nav">
          <li><Link to="/s1">ListView + Carousel</Link></li>
          <li><Link to="/s2">Tabs + ...</Link></li>
          <li><Link to="/s3">Form + ...</Link></li>
          <li><Link to="/s4" style={{fontSize:'24px'}}>蚁巢</Link></li>
          <li><Link to="/s5">例子</Link></li>
          {/*<li><Link to="/questionBank" style={{fontSize:'24px'}}>题库</Link></li>*/}
          <li><Link to="/s8" style={{fontSize:'24px'}}>抽屉</Link></li>
          <li><Link to="/questionBank2" style={{fontSize:'24px'}}>题库2</Link></li>
        </ul>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="s1" component={Stage1} />
      <Route path="s2" component={Stage2} />
      <Route path="s3" component={Stage3} />
      <Route path="s4" component={Stage4} />
      <Route path="s5" component={Stage5} />
      {/*<Route path="questionBank" component={questionBank} />*/}
      <Route path="s7" component={Stage7} />
      <Route path="s8" component={Stage8} />
      <Route path="questionBank2" component={questionBank2} />
    </Route>
  </Router>
, document.getElementById('example'));

// ReactDOM.render(
//   <div className="body">
//     <h1>Stages list</h1>
//     <ul role="nav">
//       <li><h3>ListView + Carousel</h3></li>
//       <li><h3>Tabs + ...</h3></li>
//       <li><h3>Form + ...</h3></li>
//     </ul>
//     <App><Stage3 /></App>
//   </div>
// , document.getElementById('example'));
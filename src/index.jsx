import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';

import App from './components/App';
import Stage1 from './components/Stage1';
import Stage2 from './components/Stage2';
import Stage3 from './components/Stage3';
import Stage4 from './components/Stage4';
import questionBank from './components/questionBank/questionBank';
import questionDetil from './components/questionBank/questionDetil';
import resultAnalysis from './components/resultAnalysis/resultAnalysis'
import Stage8 from './components/Stage8';
import Stage9 from './components/Stage9';

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
                    <li><Link to="/s4" style={{fontSize: '24px'}}>蚁巢</Link></li>
                    <li><Link to="/questionBank" style={{fontSize: '24px'}}>题库</Link></li>
                    <li><Link to="/resultAnalysis" style={{fontSize: '24px'}}>成绩分析</Link></li>
                    <li><Link to="/s8" style={{fontSize: '24px'}}>下拉刷新</Link></li>
                    <li><Link to="/s9" style={{fontSize: '24px'}}>List</Link></li>
                </ul>
            </div>
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Index}/>
            <Route path="s1" component={Stage1}/>
            <Route path="s2" component={Stage2}/>
            <Route path="s3" component={Stage3}/>
            <Route path="s4" component={Stage4}/>
            <Route path="questionBank" component={questionBank}/>
            <Route path="questionDetil" component={questionDetil}/>
            <Route path="resultAnalysis" component={resultAnalysis}/>
            <Route path="s8" component={Stage8}/>
            <Route path="s9" component={Stage9}/>
        </Route>
    </Router>
    , document.getElementById('example'));
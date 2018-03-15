import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';
import App from './components/App';
import Stage1 from './components/Stage1';
import Stage3 from './components/Stage3';
import Stage4 from './components/Stage4';
import Stage5 from './components/Stage5';
import questionBank from './components/questionBank/questionBank';
import questionDetil from './components/questionBank/questionDetil';
import analysisList from './components/resultAnalysis/analysisList';
import resultAnalysis from './components/resultAnalysis/resultAnalysis';
import classReaultAnalysis from './components/resultAnalysis/classResultAnalysis';
import searchUserLocationInfo from './components/userInfo/searchUserLocationInfo';
import studentFaceStatistics from './components/charts/studentFaceStatistics';
import termitePlateLibrary from './components/termitePlateLibrary/js/termitePlateLibrary';
import pushSubjectsFromTLibrary from './components/termitePlateLibrary/js/pushSubjectsFromTLibrary';
import arrangementWork from './components/termitePlateLibrary/js/arrangementWork';
import './index.less';

class Index extends React.Component {

    render() {
        return (
            <div className="body">
                <h1>Stages list</h1>
                <ul role="nav">
                    {/*<li><Link to="/s1">ListView + Carousel</Link></li>*/}
                    {/*<li><Link to="/s3">Form + ...</Link></li>*/}
                    {/*<li><Link to="/s4" style={{fontSize: '24px'}}>蚁巢</Link></li>*/}
                    {/*<li><Link to="/s5" style={{fontSize: '24px'}}>实验</Link></li>*/}
                    {/*<li><Link to="/questionBank?ident=54208&pointId=4339&title=nihao"
                              style={{fontSize: '24px'}}>题库</Link></li>*/}
                    {/*<li><Link to="/analysisList?access_user=23836" style={{fontSize: '24px'}}>成绩分析</Link></li>*/}
                    {/*<li><Link to="/searchUserLocationInfo" style={{fontSize: '24px'}}>搜索查看用户位置信息</Link></li>*/}
                    <li><Link to="/studentFaceStatistics" style={{fontSize: '24px'}}>学生脸部表情分析折线图</Link></li>
                    {/*<li><Link to="/termitePlateLibrary?ident=23836&fileId=-1&title=蚁盘题目&phoneType=0"*/}
                    {/*style={{fontSize: '24px'}}>蚁盘题库</Link>*/}
                    {/*</li>*/}
                    <li><Link to="/pushSubjectsFromTLibrary?ident=23836&fileId=-1"
                              style={{fontSize: '24px'}}>蚁盘推题</Link></li>
                    <li><Link to="/arrangementWork?ident=23836&fileId=-1"
                              style={{fontSize: '24px'}}>布置作业</Link></li>
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
            <Route path="s3" component={Stage3}/>
            <Route path="s4" component={Stage4}/>
            <Route path="s5" component={Stage5}/>
            <Route path="questionBank" component={questionBank}/>
            <Route path="questionDetil" component={questionDetil}/>
            <Route path="analysisList" component={analysisList}/>
            <Route path="resultAnalysis" component={resultAnalysis}/>
            <Route path="classReaultAnalysis" component={classReaultAnalysis}/>
            <Route path="searchUserLocationInfo" component={searchUserLocationInfo}/>
            <Route path="studentFaceStatistics" component={studentFaceStatistics}/>
            <Route path="termitePlateLibrary" component={termitePlateLibrary}/>
            <Route path="pushSubjectsFromTLibrary" component={pushSubjectsFromTLibrary}/>
            <Route path="arrangementWork" component={arrangementWork}/>
        </Route>
    </Router>
    , document.getElementById('example'));
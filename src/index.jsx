import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';
import App from './components/App';
// import Stage1 from './components/Stage1';
// import Stage3 from './components/Stage3';
// import Stage4 from './components/Stage4';
// import Stage5 from './components/Stage5';

const questionBank = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/questionBank/questionBank').default)
    }, 'questionBank')
};
const questionDetil = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/questionBank/questionDetil').default)
    }, 'questionDetil')
};
const analysisList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/resultAnalysis/analysisList').default)
    }, 'analysisList')
};
const resultAnalysis = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/resultAnalysis/resultAnalysis').default)
    }, 'resultAnalysis')
};
const classReaultAnalysis = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/resultAnalysis/classResultAnalysis').default)
    }, 'classReaultAnalysis')
};
const searchUserLocationInfo = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/userInfo/searchUserLocationInfo').default)
    }, 'searchUserLocationInfo')
};
const studentFaceStatistics = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/charts/studentFaceStatistics').default)
    }, 'studentFaceStatistics')
};
const termitePlateLibrary = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/termitePlateLibrary/js/termitePlateLibrary').default)
    }, 'termitePlateLibrary')
};
const pushSubjectsFromTLibrary = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/termitePlateLibrary/js/pushSubjectsFromTLibrary').default)
    }, 'pushSubjectsFromTLibrary')
};
const arrangementWork = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/termitePlateLibrary/js/arrangementWork').default)
    }, 'arrangementWork')
};
const fileShareLink = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/fileShareLink/js/fileShareLink').default)
    }, 'fileShareLink')
};
const webMiddlePage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/webMiddlePage/js/webMiddlePage').default)
    }, 'webMiddlePage')
};
const previewFile = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/webMiddlePage/js/previewFile').default)
    }, 'previewFile')
};
const ringBinding = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/ringBindInformation/js/ringBinding').default)
    }, 'ringBinding')
};
const bindingBracelet = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/ringBindInformation/js/bindingBracelet').default)
    }, 'bindingBracelet')
};
const boxBracelet = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/ringBindInformation/js/boxBracelet').default)
    }, 'boxBracelet')
};
const personalSettings = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/chatSettings/js/personalSettings').default)
    }, 'personalSettings')
};

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
                    {/*<li><Link to="/questionBank?ident=54208&pointId=4339&title=nihao"*/}
                              {/*style={{fontSize: '24px'}}>题库</Link></li>*/}
                    {/*<li><Link to="/analysisList?access_user=23836" style={{fontSize: '24px'}}>成绩分析</Link></li>*/}
                    {/* <li><Link to="/searchUserLocationInfo" style={{fontSize: '24px'}}>搜索查看用户位置信息</Link></li> */}
                    {/*<li><Link to="/studentFaceStatistics" style={{fontSize: '24px'}}>学生脸部表情分析折线图</Link></li>*/}
                    {/*<li><Link to="/termitePlateLibrary?ident=23836&fileId=-1&title=蚁盘题目&phoneType=0"*/}
                    {/*style={{fontSize: '24px'}}>蚁盘题库</Link>*/}
                    {/*</li>*/}
                    {/*<li><Link to="/pushSubjectsFromTLibrary?ident=23836&fileId=-1"*/}
                    {/*style={{fontSize: '24px'}}>蚁盘推题</Link></li>*/}
                    {/*<li><Link to="/arrangementWork?ident=23836&fileId=-1"*/}
                    {/*style={{fontSize: '24px'}}>布置作业</Link></li>*/}
                    {/*<li><Link to="/fileShareLink?shareId=1971&userId=23836&userType=st"*/}
                    {/*style={{fontSize: '24px'}}>文件分享</Link></li>*/}
                    <li><Link to="/ringBinding?ident=23836"
                              style={{fontSize: '24px'}}>手环绑定</Link></li>
                    <li><Link to="/personalSettings"
                              style={{fontSize: '24px'}}>个人设置</Link></li>
                </ul>
            </div>
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Index}/>
            {/*<Route path="s1" component={Stage1}/>*/}
            {/*<Route path="s3" component={Stage3}/>*/}
            {/*<Route path="s4" component={Stage4}/>*/}
            {/*<Route path="s5" component={Stage5}/>*/}
            <Route path="questionBank" getComponent={questionBank}/>
            <Route path="questionDetil" getComponent={questionDetil}/>
            <Route path="analysisList" getComponent={analysisList}/>
            <Route path="resultAnalysis" getComponent={resultAnalysis}/>
            <Route path="classReaultAnalysis" getComponent={classReaultAnalysis}/>
            <Route path="searchUserLocationInfo" getComponent={searchUserLocationInfo}/>
            <Route path="studentFaceStatistics" getComponent={studentFaceStatistics}/>
            <Route path="termitePlateLibrary" getComponent={termitePlateLibrary}/>
            <Route path="pushSubjectsFromTLibrary" getComponent={pushSubjectsFromTLibrary}/>
            <Route path="arrangementWork" getComponent={arrangementWork}/>
            <Route path="fileShareLink" getComponent={fileShareLink}/>
            <Route path="webMiddlePage" getComponent={webMiddlePage}/>
            <Route path="previewFile" getComponent={previewFile}/>
            <Route path="ringBinding" getComponent={ringBinding}/>
            <Route path="bindingBracelet" getComponent={bindingBracelet}/>
            <Route path="boxBracelet" getComponent={boxBracelet}/>
            <Route path="personalSettings" getComponent={personalSettings}/>
        </Route>
    </Router>
    , document.getElementById('example'));
import React from 'react';
import fetch from 'dva/fetch'

const mobileUrl = 'https://www.maaee.com/Excoord_For_Education/webservice';

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionDetil: {},
        };
    }

    componentDidMount() {
        document.title = '题目详情';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var id = searchArray[0].split('=')[1];
        this.getSubjectLineById(id);
    }

    parseJSON(response) {
        return response.json();
    }

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    getSubjectLineById(id) {
        var _this = this;
        var param = {
            "method": 'getSubjectLineById',
            "sid": id,
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));

        var obj = {
            method: 'post',
            body: requestParams,
        };

        fetch(mobileUrl, obj)
            .then(_this.checkStatus)
            .then(_this.parseJSON)
            .then(data => ({data}))
            .catch(err => ({err}))
            .then(function (result) {
                var ret = result.data;
                if (ret.msg == '调用成功' && ret.success == true) {
                    var data = ret.response;
                    // console.log(data);
                    _this.setState({questionDetil: data})
                }
            });
    }

    render() {
        return (
            <div className="question_detil_cont">
                <h3>【{this.state.questionDetil.typeName}】</h3>
                <div dangerouslySetInnerHTML={{__html: this.state.questionDetil.content}} className="question_detil"></div>
                <hr/>
                <h3>【正确答案】</h3>
                <div dangerouslySetInnerHTML={{__html: this.state.questionDetil.answer}}></div>
            </div>
        );
    }
}

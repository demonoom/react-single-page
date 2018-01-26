import React from 'react';
// import requestLittleAntApi from '../../helpers/WebServiceUtil';

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

    getSubjectLineById(id) {
        var _this = this;
        var param = {
            "method": 'getSubjectLineById',
            "sid": id,
        };

        var requestParams = encodeURI("params=" + JSON.stringify(param));
        WebServiceUtil.requestLittleAntApi({
            method: 'post',
            body: requestParams,
        }).then(function (result) {
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

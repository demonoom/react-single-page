import React from 'react';

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionDetil: {},
            knowledgeInfoArr: []
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
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
            console.log(result);
            var ret = result.data;
            if (ret.msg == '调用成功' && ret.success == true) {
                var data = ret.response;
                _this.setState({questionDetil: data});
                var knowledgeInfoList = data.knowledgeInfoList;
                if (WebServiceUtil.isEmpty(knowledgeInfoList) == false) {
                    var knowledgeInfoArr = [];
                    knowledgeInfoList.forEach(function (v, i) {
                        var knowledgeInfo = <div>{v.knowledgeName}</div>
                        knowledgeInfoArr.push(knowledgeInfo);
                    })
                    _this.setState({knowledgeInfoArr});
                }
            }
        });
    }

    render() {
        return (
            <div className="question_detil_cont">
                <div>
                    {this.state.knowledgeInfoArr}
                </div>
                <h3>【{this.state.questionDetil.typeName}】</h3>
                <div dangerouslySetInnerHTML={{__html: this.state.questionDetil.content}}
                     className="question_detil"></div>
                <hr/>
                <h3>【正确答案】</h3>
                <div dangerouslySetInnerHTML={{__html: this.state.questionDetil.answer}}></div>
                <h3>【解析】</h3>
                <div dangerouslySetInnerHTML={{__html: this.state.questionDetil.analysisContent}}></div>
            </div>
        );
    }
}

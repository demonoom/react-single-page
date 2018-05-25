import React from 'react';

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionDetil: {},
            knowledgeInfoArr: [],
            divShow: 'block'
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '题目详情';
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var id = searchArray[0].split('=')[1];
        this.getSubjectLineById(id);
    }

    componentDidUpdate() {
        var arr = document.getElementsByTagName('img');
        if (WebServiceUtil.isEmpty(arr) == false) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].addEventListener("click", function () {
                    var data = {
                        method: "showImage",
                        url: this.src,
                        currentUrl: this.src,
                    };
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                });
            }
        }
    }

    getSubjectLineById(id) {
        var _this = this;
        var param = {
            "method": 'getSubjectLineById',
            "sid": id,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var ret = result;
                if (ret.msg == '调用成功' && ret.success == true) {
                    var data = ret.response;
                    _this.setState({questionDetil: data});
                    var knowledgeInfoList = data.knowledgeInfoList;
                    if (WebServiceUtil.isEmpty(knowledgeInfoList) == false) {
                        var knowledgeInfoArr = [];
                        knowledgeInfoList.forEach(function (v, i) {
                            var knowledgeInfo = <span>{v.knowledgeName}</span>
                            knowledgeInfoArr.push(knowledgeInfo);
                        })
                        _this.setState({knowledgeInfoArr});
                    } else {
                        _this.setState({divShow: 'none'});
                    }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        return (
            <div className="question_detil_cont">
                <div className="list_padding" style={{display: this.state.divShow}}>
                    <div className="tags_blue my_flex my_flex_wrap">
                        {this.state.knowledgeInfoArr}
                    </div>
                </div>
                <div className="list_padding">
                    <h3><span className="b_c_1"></span>{this.state.questionDetil.typeName}</h3>
                    <div dangerouslySetInnerHTML={{__html: this.state.questionDetil.content}}
                         className="question_detil"></div>
                </div>
                <div className="list_padding">
                    <h3><span className="b_c_2"></span>正确答案</h3>
                    <div dangerouslySetInnerHTML={{__html: this.state.questionDetil.answer}}
                         className="question_detil"></div>
                </div>
                <div className="list_padding list_padding_no_b">
                    <h3><span className="b_c_3"></span>解析</h3>
                    <div dangerouslySetInnerHTML={{__html: this.state.questionDetil.analysisContent}}
                         className="question_detil"></div>
                </div>
            </div>
        );
    }
}

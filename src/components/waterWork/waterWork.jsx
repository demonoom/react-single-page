import React from 'react';
import "./waterWork.less";
import {Toast} from 'antd-mobile'

var water;
export default class waterWork extends React.Component {
    constructor(props) {
        super(props);
        water = this;
        this.state = {
            initData: [],
            htmlList: []
        }
    }

    componentDidMount() {
        var _this = this;
        document.title = '题目水滴页';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var tId = searchArray[0].split('=')[1];
        var stuId = searchArray[1].split('=')[1];
        this.setState({tId, stuId});
        this.getHomeworkData(tId,stuId);
    }
    /**
     * 获取数据
     */
    getHomeworkData(tId,stuId) {
        var _this = this;
        var param = {
            "method": 'viewFuzzyHomework',
            "tId":tId,
            "stuId":stuId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);

                if (result.msg == '调用成功' || result.success == true) {
                    var arr = [];
                    _this.state.initData = result.response;
                    _this.state.initData.forEach((v, i) => {
                        let html = <div>
                            {/* <div>作业内容:{v.homework.topic.content}</div> */}
                            {/* <div>老师：{v.homework.teacher.userName}</div> */}
                            <div className="water" onClick={_this.toWaterDetail.bind(this, v.index)} >
                                <div> {parseInt((v.answerCount / v.answerTotalCount)*100)+"%"}</div>
                                <span>第{v.index+1}题</span>
                            </div>
                        </div>
                        arr.push(html)
                    })
                    _this.setState({
                        htmlList: arr
                    })
            
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 跳转原生水滴页面
     * @param {*} id 
     */
    toWaterDetail(index) {
        var _this = this;
        var data = {
            method: 'waterDetailMethod',
            id: index+"",
            tId:water.state.tId+""
        };
        console.log(data);
        Bridge.callHandler(data, null, function (error) {
            // Toast.info(error,5)
        });

    }

    render() {
        var _this = this;
        return (
            <div id="waterWorkContent">
                {
                    _this.state.htmlList
                }
            </div>
        )
    }
}
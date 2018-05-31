import React from 'react';
import {} from 'antd-mobile';

var MEScore;

export default class moralEducationScore extends React.Component {

    constructor(props) {
        super(props);
        MEScore = this;
        this.state = {
            scoreData: {}
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getMEScore();
    }

    componentWillReceiveProps(nextProps) {
        // jsonObject.put("command", "moralEducation");
        // jsonObject.put("cid", cid);
        var clazzId = localStorage.getItem("clazzId");
        if (nextProps.classCommand.command == "moralEducation" && nextProps.classCommand.data.cid == clazzId) {
            this.getMEScore();
        }
    }

    getMEScore() {
        var _this = this;
        const param = {
            "method": "getMoralEducationInfo",
            "clazzId": localStorage.getItem("clazzId"),
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({
                        scoreData: result.response
                    })
                }
            },
            onError: function (error) {
                message.error(error);
            }
        });
    }

    render() {
        return (
            <div id="moralEducationScore" className="home_card moralEducationScore_height">
                <h3 className="home_title">班级德育评分</h3>
                {
                    MEScore.state.scoreData!=null ?
                        <div className="mEScoreInfo home_cardCont">
                            <div className="mEScoreInfoT">
                                <span className="font_title2">全校排名：<span
                                    className="blue_text">{MEScore.state.scoreData.schoolRank}</span></span>
                                <span className="font_title2 float_ri">年级排名：<span
                                    className="blue_text">{MEScore.state.scoreData.clazzRank}</span></span>
                            </div>
                            <div className="mEScoreInfoM font_title2 ">
                                总分<span className="blue_big">{MEScore.state.scoreData.totalScore}</span>
                            </div>
                            <div className="mEScoreInfoB">
                                <span className="font_title2">礼仪：<span
                                    className="blue_text">{MEScore.state.scoreData.politeness}</span></span>
                                <span className="font_title2 float_ri">健康：<span
                                    className="blue_text">{MEScore.state.scoreData.health}</span></span>
                            </div>
                        </div>
                        :
                        <div className="mEScoreInfo home_cardCont">
                            <div className="empty_center">
                                <div className="empty_icon empty_moralEducationScore"></div>
                                <div className="empty_text">暂无通知</div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

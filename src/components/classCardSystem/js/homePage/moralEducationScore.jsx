import React from 'react';
import {} from 'antd-mobile';

var MEScore;

export default class moralEducationScore extends React.Component {

    constructor(props) {
        super(props);
        MEScore = this;
        this.state = {
            scoreData:{}
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getMEScore();
    }
    getMEScore(){
        var _this = this;
        const param = {
            "method": "getMoralEducationInfo",
            "clazzId":14,
            "termId":1,
            "createTime":""
        }
        console.log(param);
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    console.log("result",result);
                    _this.setState({
                        scoreData:result.response
                    })
                }
            },
            onError: function (error) {
            }
        });
    }
    render() {
        return (
            <div id="moralEducationScore">
                <h1>班级德育评分</h1>
                <div className="mEScoreInfo">
                    <div className="mEScoreInfoT">
                        <div className="">全级排名<span>{MEScore.state.scoreData.schoolRank}</span></div>
                        <div className="">年级排名<span>{MEScore.state.scoreData.clazzRank}</span></div>
                    </div>
                    <div className="mEScoreInfoM">
                        总分<span>{MEScore.state.scoreData.totalScore}</span>
                    </div>
                    <div className="mEScoreInfoB">
                        <div className="">礼仪：<span>{MEScore.state.scoreData.politeness}</span></div>
                        <div className="">健康：<span>{MEScore.state.scoreData.health}</span></div>
                    </div>
                </div>
            </div>
        );
    }
}

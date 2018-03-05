import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './studentFaceStatistics.css'
import {
    Toast,List
} from 'antd-mobile';

export default class studentFaceStatistics extends React.Component {
    classOpenSend = 0;

    constructor(props) {
        super(props);
        this.state = {
            lineChartOption: this.initChartOption(),
            lastPoint: '0',
            currentFaceEmotion:{}
        };
    }

    componentDidMount() {
        document.title = '学生听课认真度分析';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        this.getVclassFaceEmotionsStatistics();

        // if (this.timeTicket) {
        //     clearInterval(this.timeTicket);
        // }
        setInterval(this.fetchNewDate, 10000);

    }

    fetchNewDate = () => {
        if (this.classOpenSend == 0) {
            return;
        }
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var vid = searchArray[0].split('=')[1];
        const dataBlob = {};
        var param = {
            "method": 'getVclassFaceEmotionsBySecondsPoint',
            "vid": vid,
            "count": '10',
            "lastPoint": this.classOpenSend,
        };
        var requestParams = encodeURI("params=" + JSON.stringify(param));

        WebServiceUtil.requestLittleAntApi({
            method: 'post',
            body: requestParams,
        }).then(function (result) {
            var data = result.data;
            if (!data.success) {
                Toast.fail(data.msg, 1);
                return;
            }
            _this.classOpenSend = data.class_opened_seconds + 5;
            var resourse = data.response;
            _this.handleResourse(resourse);
        });
    };

    formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
            }
        }
        var result = "" + parseInt(theTime) + "s";
        if (theTime1 > 0) {
            result = "" + parseInt(theTime1) + "m" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + "h" + result;
        }
        return result;
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

    getVclassFaceEmotionsStatistics = () => {
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var vid = searchArray[0].split('=')[1];
        const dataBlob = {};
        var param = {
            "method": 'getVclassFaceEmotionsStatistics',
            "vid": vid,
        };
        var requestParams = encodeURI("params=" + JSON.stringify(param));

        WebServiceUtil.requestLittleAntApi({
            method: 'post',
            body: requestParams,
        }).then(function (result) {
            var data = result.data;
            _this.classOpenSend = data.class_opened_seconds + 5;
            if (!data.success) {
                Toast.fail(data.msg, 1);
                return;
            }
            var resourse = data.response;
            _this.handleResourse(resourse);
        });
    }
    isEmptyObject = (obj) => {
        for (var n in obj) {
            return false
        }
        return true;
    }
    getLoadingOption = () => {
        return {
            text: '加载中...',
            color: '#4413c2',
            textColor: '#270240',
            maskColor: 'rgba(194, 88, 86, 0.3)',
            zlevel: 0
        };
    };
    openNewPage = () => {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var vid = searchArray[0].split('=')[1];
        var url = mobileServiceURL+"studentFaceStatistics?vid=" + vid;
        window.open(url);
        // var data = {};
        // data.method = 'openNewPage';
        // data.url = url;
        // Bridge.callHandler(data, null, function (error) {
        //     window.location.href = url;
        // });
    };
    onChartReady = (chart) => {
        this._t = setTimeout(function () {
            chart.hideLoading();
        }, 3000);
    };
    handleResourse = (resourse) => {
        if (!resourse) {
            Toast.fail(resourse, 1);
            return;
        }
        var faceEmotionDatas = resourse;
        console.log(faceEmotionDatas);
        var lineChartOption = this.state.lineChartOption;
        var i = 1;
        var lastPoint;
        var currentFaceEmotion;
        if (!this.isEmptyObject(faceEmotionDatas)) {
            for (var key in faceEmotionDatas) {
                i++;
                var faceEmotionData = faceEmotionDatas[key];
                currentFaceEmotion=faceEmotionData;
                var xMinuite = this.formatSeconds(key);
                if (xMinuite > 60) {
                    break;
                }
                (lineChartOption.xAxis)[0].data.push(xMinuite);
                (lineChartOption.series)[0].data.push(faceEmotionData.attention.toFixed(2));
                (lineChartOption.series)[1].data.push(faceEmotionData.confuse.toFixed(2));
                (lineChartOption.series)[2].data.push(faceEmotionData.thinking.toFixed(2));
                (lineChartOption.series)[3].data.push(faceEmotionData.joy.toFixed(2));
                (lineChartOption.series)[4].data.push(faceEmotionData.surprise.toFixed(2));
                (lineChartOption.series)[5].data.push(faceEmotionData.understand.toFixed(2));
                lastPoint = key;
            }

            var user={};
            user.userName='成旭';
            user.avatar='http://60.205.86.217/upload6/2018-02-01/0/5f8ff939-a387-47b4-a5b3-898776aded40.jpg?size=100x100';
            (currentFaceEmotion.understandUserList)[0]=user;
            (currentFaceEmotion.understandUserList)[1]=user;
            (currentFaceEmotion.understandUserList)[2]=user;
            (currentFaceEmotion.understandUserList)[3]=user;

            (currentFaceEmotion.attentionUserList)[0]=user;
            (currentFaceEmotion.attentionUserList)[1]=user;
            (currentFaceEmotion.attentionUserList)[2]=user;
            (currentFaceEmotion.attentionUserList)[3]=user;

            (currentFaceEmotion.noUnderstandUserList)[0]=user;
            (currentFaceEmotion.noUnderstandUserList)[1]=user;
            (currentFaceEmotion.noUnderstandUserList)[2]=user;
            (currentFaceEmotion.noUnderstandUserList)[3]=user;

            (currentFaceEmotion.confuseUserList)[0]=user;
            (currentFaceEmotion.confuseUserList)[1]=user;
            (currentFaceEmotion.confuseUserList)[2]=user;
            (currentFaceEmotion.confuseUserList)[3]=user;

            this.setState({currentFaceEmotion: currentFaceEmotion});
            this.setState({lineChartOption: lineChartOption});
            this.setState({lastPoint: lastPoint});
        } else {
            (lineChartOption.xAxis)[0].data.push(this.formatSeconds(this.classOpenSend));
            (lineChartOption.series)[0].data.push(0);
            (lineChartOption.series)[1].data.push(0);
            (lineChartOption.series)[2].data.push(0);
            (lineChartOption.series)[3].data.push(0);
            (lineChartOption.series)[4].data.push(0);
            (lineChartOption.series)[5].data.push(0);
            this.setState({lineChartOption: lineChartOption});
            this.setState({lastPoint: lastPoint});
        }

    }
    formateNumer=(number,i)=>{
        if(!number){
            return 0.00;
        }
        return number.toFixed(i);
    }
    initChartOption = () => {
        var _this=this;
        return {
            toolbox: {
                feature: {
                    saveAsImage:{},
                    myTool1: {
                        show: true,
                        title: '新页面打开',
                        icon: 'image://http://60.205.86.217/upload6/2018-01-30/12/871b0650-212d-43af-830e-7ab963d31de3.png?size=300x300',
                        onclick: function (){
                            _this.openNewPage();
                        }
                    }
                }
            }  ,
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [{name: '专注', icon: 'rect'},
                    {name: '疑惑', icon: 'rect'},
                    {name: '思考', icon: 'rect'},
                    {name: '喜悦', icon: 'rect'},
                    {name: '惊讶', icon: 'rect'},
                    {name: '理解', icon: 'rect'},
                ],
                textStyle: {
                    fontSize: 20,
                }
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {length: 2},
                    data: [],
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '专注',
                    type: 'line',
                    smooth: true,  //这句就是让曲线变平滑的
                    itemStyle: {
                        normal: {
                            color: 'green'
                        }
                    },
                    data: []
                },
                {
                    name: '疑惑',
                    type: 'line',
                    smooth: true,  //这句就是让曲线变平滑的
                    itemStyle: {
                        normal: {
                            color: 'black'
                        }
                    },
                    data: []
                },
                {
                    name: '思考',
                    type: 'line',
                    smooth: true,  //这句就是让曲线变平滑的
                    itemStyle: {
                        normal: {
                            color: '#DA22FF'
                        }
                    },
                    data: []
                },
                {
                    name: '喜悦',
                    type: 'line',
                    smooth: true,  //这句就是让曲线变平滑的
                    itemStyle: {
                        normal: {
                            color: 'blue'
                        }
                    },
                    data: []
                },
                {
                    name: '惊讶',
                    type: 'line',
                    smooth: true,  //这句就是让曲线变平滑的
                    itemStyle: {
                        normal: {
                            color: 'yellow'
                        }
                    },
                    data: []
                },
                {
                    name: '理解',
                    type: 'line',
                    smooth: true,  //这句就是让曲线变平滑的
                    itemStyle: {
                        normal: {
                            color: 'red'
                        }
                    },
                    data: []
                }
            ]
        };
    };


    render() {
        var _this = this;
        var lineChartOption=_this.state.lineChartOption;
        var aliveUserList=_this.state.currentFaceEmotion.aliveUserList;
        var attentionUserList=_this.state.currentFaceEmotion.attentionUserList;
        var confuseUserList=_this.state.currentFaceEmotion.confuseUserList;
        var noUnderstandUserList=_this.state.currentFaceEmotion.noUnderstandUserList;
        var understandUserList=_this.state.currentFaceEmotion.understandUserList;

        var attention=this.formateNumer(Number(_this.state.currentFaceEmotion.attention),2);
        var confuse=this.formateNumer(Number(_this.state.currentFaceEmotion.confuse),2);
        var understand=this.formateNumer(Number(_this.state.currentFaceEmotion.understandMore25),2);
        var thinking=this.formateNumer(Number(_this.state.currentFaceEmotion.thinking),2);
        var understandLow25=this.formateNumer(Number(_this.state.currentFaceEmotion.understandLow25),2);
        const jump=()=>{
            return ( <div onClick={() => this.openNewPage()} className="top_right_btn">新页面打开</div>);
        }
        //不理解度
        var understandRecord;
        if (understandUserList != null && typeof (understandUserList) != undefined) {
            understandRecord= understandUserList.map(function (item) {
                return (
                    <div>
                        <div>{item.userName}</div>
                        <div><img src={item.avatar}></img></div>
                    </div>
                )})

        }
        //专注度
        var attentionRecord;
        if (attentionUserList != null && typeof (attentionUserList) != undefined) {
            attentionRecord= understandUserList.map(function (item) {
                return (
                    <div  >
                        <div>{item.userName}</div>
                        <div><img src={item.avatar}></img></div>
                    </div>
                )})
        }
        //不理解度
        var noUnderstandRecord;
        if (noUnderstandUserList != null && typeof (noUnderstandUserList) != undefined) {
            noUnderstandRecord= understandUserList.map(function (item) {
                return (
                    <div  >
                        <div>{item.userName}</div>
                        <div><img src={item.avatar}></img></div>
                    </div>
                )})
        }
        //疑惑度
        var confuseRecord;
        if (confuseUserList != null && typeof (confuseUserList) != undefined) {
            confuseRecord= understandUserList.map(function (item) {
                return (
                    <div  >
                        <div>{item.userName}</div>
                        <div><img src={item.avatar}></img></div>
                    </div>
                )})
        }

        return (

            <div className="student_cont">
                <div className='over_flow_auto student_f_auto'>
                    <span className="student_f_left">占比/％</span>
                    <span className="student_f_right">时间/M</span>
                    <div>
                        <div>
                            <ReactEcharts
                                option={lineChartOption}
                                style={{height: '350px', width: '100%'}}
                               // loadingOption={this.getLoadingOption()}
                               // showLoading={true}
                               // onChartReady={this.onChartReady}
                                className='' />
                            <pre></pre>
                        </div>
                    </div>
                </div>
                <div>专注度{attention}</div>
                {attentionRecord}
                <div>理解度{understand}</div>
                {understandRecord}
                <div>不理解度{understandLow25}</div>
                {noUnderstandRecord}
                <div>疑惑度{confuse}</div>
                {confuseRecord}
                <div>思考度{thinking}</div>
            </div>
        );
    }

}
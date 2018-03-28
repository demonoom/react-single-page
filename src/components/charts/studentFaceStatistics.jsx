import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './studentFaceStatistics.css'
import {
    Toast, List
} from 'antd-mobile';

export default class studentFaceStatistics extends React.Component {
    classOpenSend = 0;
    closeCollectData=0;
    isClassOver=false;
    constructor(props) {
        super(props);
        this.state = {
            lineChartOption: this.initChartOption(),
            lastPoint: '0',
            currentFaceEmotion: {},
            screenHeight: screen.height
        };
    }

    componentDidMount() {
        document.title = '学生听课认真度分析';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        this.getVclassFaceEmotionsStatistics();
        var _this=this;
        setInterval(this.fetchNewDate, 4000);
        window.addEventListener( "message",
            function(e){
            console.log(e.data);
            if(e.data=='classOver') {
                _this.classOver();
            }
            },false);

    }

    fetchNewDate = () => {
        if (this.classOpenSend == 0||this.isClassOver) {
            return;
        }
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var vid = searchArray[0].split('=')[1];
        console.log(this.classOpenSend);
        const dataBlob = {};
        var param = {
            "method": 'getVclassFaceEmotionsBySecondsPoint',
            "vid": vid,
            "count": '10',
            "lastPoint": this.classOpenSend,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var data = result;
                if (!data.success) {
                    Toast.fail(data.msg, 1);
                    return;
                }
                _this.classOpenSend = data.class_opened_seconds + 5;
                var resourse = data.response;
                _this.handleResourse(resourse);
            },
            onError: function (error) {
                // message.error(error);
            }
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
    classOver() {
        this.isClassOver=true;
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

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var data = result;
                _this.classOpenSend = data.class_opened_seconds + 5;
                if (!data.success) {
                    Toast.fail(data.msg, 1);
                    return;
                }
                var resourse = data.response;
                _this.handleResourse(resourse);
            },
            onError: function (error) {
                // message.error(error);
            }
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
        var url = mobileServiceURL + "studentFaceStatistics?vid=" + vid;
        window.open(url);
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
                currentFaceEmotion = faceEmotionData;
                var xMinuite = this.formatSeconds(key);
                this.closeCollectData=xMinuite;
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

            this.showUserHandleByScreenWidth(currentFaceEmotion);
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
    showUserHandleByScreenWidth = (data) => {

        this.setState({currentFaceEmotion: data});
    }
    formateNumer = (number, i) => {
        if (!number) {
            return 0.00;
        }
        console.log(number)
        return number.toFixed(i);
    }
    initChartOption = () => {
        var _this = this;
        return {
            toolbox: {
                feature: {
                    saveAsImage: {},
                    myTool1: {
                        show: true,
                        title: '新页面打开',
                        icon: 'image://http://60.205.86.217/upload6/2018-01-30/12/871b0650-212d-43af-830e-7ab963d31de3.png?size=300x300',
                        onclick: function () {
                            _this.openNewPage();
                        }
                    }
                }
            },
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
        var lineChartOption = _this.state.lineChartOption;
        var aliveUserList = _this.state.currentFaceEmotion.aliveUserList;
        var attentionUserList = _this.state.currentFaceEmotion.attentionUserList;
        var confuseUserList = _this.state.currentFaceEmotion.confuseUserList;
        var noUnderstandUserList = _this.state.currentFaceEmotion.noUnderstandUserList;
        var understandUserList = _this.state.currentFaceEmotion.understandUserList;
        var thinkUserList = _this.state.currentFaceEmotion.thinkUserList;
        if (!aliveUserList) {
            aliveUserList = new Array();
        }
        if (!attentionUserList) {
            attentionUserList = new Array();
        }
        if (!confuseUserList) {
            confuseUserList = new Array();
        }
        if (!noUnderstandUserList) {
            noUnderstandUserList = new Array();
        }
        if (!understandUserList) {
            understandUserList = new Array();
        }
        if (!thinkUserList) {
            thinkUserList = new Array();
        }
        console.log(thinkUserList.length/aliveUserList.length);
        var attention=this.formateNumer(_this.state.currentFaceEmotion.attention/(aliveUserList.length-1),0);
        var confuse=this.formateNumer((confuseUserList.length/(aliveUserList.length-1)*100),0);
        var understand=this.formateNumer((understandUserList.length/(aliveUserList.length-1))*100,0);
        var thinking=this.formateNumer((thinkUserList.length/(aliveUserList.length-1))*100,0);
        var understandLow25=this.formateNumer((noUnderstandUserList.length/(aliveUserList.length-1))*100,0);
        var screenHeight=_this.state.screenHeight;
        var showConutByScreenHeight=16;
        if(screenHeight==1080){//16
            showConutByScreenHeight=16;
        }else if(screenHeight==768){//12
            showConutByScreenHeight=12;
        }else if(screenHeight==2160){
            showConutByScreenHeight=32;
        }
        const jump = () => {
            return ( <div onClick={() => this.openNewPage()} className="top_right_btn">新页面打开</div>);
        }
        //理解度
        var understandRecord;
        if (understandUserList != null && typeof (understandUserList) != undefined) {
            if (understandUserList.length == 0) {
                understandRecord = "";
            } else {
                understandRecord = understandUserList.map(function (item, index) {
                    if (index < showConutByScreenHeight) {
                        return (
                            <div className="concentration_user">
                                <div><img src={item.avatar}></img></div>
                                <div className="concentration_font">{item.userName}</div>
                            </div>
                        )
                    }
                    return
                })
            }

        }
        //专注度
        var attentionRecord;
        if (attentionUserList != null && typeof (attentionUserList) != undefined) {
            if (attentionUserList.length == 0) {
                attentionRecord = "";
            } else {
                attentionRecord = attentionUserList.map(function (item, index) {
                    if (index < showConutByScreenHeight) {
                        return (
                            <div className="concentration_user">
                                <div><img src={item.avatar}></img></div>
                                <div className="concentration_font">{item.userName}</div>
                            </div>
                        )
                    }
                    return
                })
            }
        }
        //不理解度
        var noUnderstandRecord;
        if (noUnderstandUserList != null && typeof (noUnderstandUserList) != undefined) {
            if (noUnderstandUserList.length == 0) {
                noUnderstandRecord = "";
            } else {
                noUnderstandRecord = noUnderstandUserList.map(function (item, index) {
                    if (index < showConutByScreenHeight) {
                        return (
                            <div className="concentration_user">
                                <div><img src={item.avatar}></img></div>
                                <div className="concentration_font">{item.userName}</div>
                            </div>
                        )
                    }
                    return
                })
            }
        }
        //疑惑度`
        var confuseRecord;
        if (confuseUserList != null && typeof (confuseUserList) != undefined) {
            if (confuseUserList.length == 0) {
                confuseRecord = "";
            } else {
                confuseRecord = confuseUserList.map(function (item, index) {
                    if (index < showConutByScreenHeight) {
                        return (
                            <div className="concentration_user">
                                <div><img src={item.avatar}></img></div>
                                <div className="concentration_font">{item.userName}</div>
                            </div>
                        )
                    }
                    return
                })
            }
        }
        //思考度
        var thinkRecord;
        if (thinkUserList != null && typeof (thinkUserList) != undefined) {
            if (thinkUserList.length == 0) {
                thinkRecord = "";
            } else {
                thinkRecord = thinkUserList.map(function (item, index) {
                    if (index < showConutByScreenHeight) {
                        return (
                            <div className="concentration_user">
                                <div><img src={item.avatar}></img></div>
                                <div className="concentration_font">{item.userName}</div>
                            </div>
                        )
                    }
                    return
                })
            }
        }
        return (

            <div className="face_cont_wrap">
                <div className='over_flow_auto student_f_auto concentration_title concentration_top'>课堂实时表情分析</div>
                <div className='over_flow_auto concentration_bottom my_flex flex_justify face_cont_wrap1'>
                    <div className="concentration_list">
                        <div className="concentration_title concentration_title3">专注度{attention}%</div>
                        <div className="concentration_title2">（专注度高的学生）</div>
                        <div className="concentration_user_cont">{attentionRecord}</div>
                    </div>


                    <div className="concentration_list concentration_list2 my_flex">
                        <div className="concentration_list2_1">
                            <div className="concentration_title concentration_title3">理解学生占比{understand}%</div>
                            <div className="concentration_title2">（理解的学生）</div>
                            <div className="concentration_user_cont">{understandRecord}</div>
                        </div>
                        <div className="concentration_list2_line">
                            <div className="concentration_list2_line_l"></div>
                        </div>
                        <div className="concentration_list2_1">
                            <div className="concentration_title concentration_title3">不理解学生占比{understandLow25}%</div>
                            <div className="concentration_title2">（不理解的学生）</div>
                            <div className="concentration_user_cont">{noUnderstandRecord}</div>
                        </div>
                    </div>


                    <div className="concentration_list">
                        <div className="concentration_title concentration_title3">疑惑学生占比{confuse}%</div>
                        <div className="concentration_title2">（高于平均值的学生）</div>
                        <div className="concentration_user_cont">{confuseRecord}</div>
                    </div>
                    <div className="concentration_list">
                        <div className="concentration_title concentration_title3">思考学生占比{thinking}%</div>
                        <div className="concentration_title2">（在思考的学生）</div>
                        <div className="concentration_user_cont">{thinkRecord}</div>
                    </div>
                </div>
                <div className='over_flow_auto face_cont_wrap2'>
                    <span className="student_f_left">占比/％</span>
                    <span className="student_f_right">时间/M</span>
                    <div className="face_cont_wrap">
                        <div className="face_cont_2_1">
                            <ReactEcharts
                                option={lineChartOption}
                                style={{height: '100%', width: '100%'}}
                                // loadingOption={this.getLoadingOption()}
                                // showLoading={true}
                                // onChartReady={this.onChartReady}
                                className=''/>
                            <pre></pre>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
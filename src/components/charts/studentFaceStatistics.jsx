import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './studentFaceStatistics.css'
import {
    Toast, List
} from 'antd-mobile';
var colors = ['#5793f3', '#d14a61'];
export default class studentFaceStatistics extends React.Component {
    classOpenSend = 1;
    closeCollectData=0;
    isClassOver=false;
    lastData;
    constructor(props) {
        super(props);
        this.state = {
            lineChartOption: this.initChartOption(),
            lastPoint: '0',
            currentFaceEmotion: {},
            screenHeight: screen.height,
            faceCont:'over_flow_auto concentration_bottom my_flex flex_justify face_cont2_1',
            faceCont2:'over_flow_auto face_cont2_2'
        };
    }

    componentDidMount() {
        document.title = '学生听课认真度分析';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        var _this=this;
        this.getVclassFaceEmotionsStatistics();

        //setInterval(this.fetchNewDate, 4000);
        window.addEventListener( "message",
            function(e){
                console.log(e.data);
                if(e.data=='classOver') {
                    _this.classOver();
                }
            },false);

    }
    onChartClick = (optional) => {
    };
    fetchNewDate = () => {
        if (this.classOpenSend == 0||this.isClassOver) {
            console.log("arthur test");
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
        var faceCont='over_flow_auto concentration_bottom my_flex flex_justify face_cont_wrap1';
        var faceCont2='over_flow_auto face_cont_wrap2 face_cont_wrap2_a';
        this.setState({faceCont: faceCont});
        this.setState({faceCont2: faceCont2});

        this.getLocalClassEachStudentFaceEmotion();
    }
    initEachStudentFaceEmotionCharts=(dataMap)=>{
        var vid = this.state.vid;
        var columnarChartOption = null;
        columnarChartOption = this.buildChartOption();
        let onEvents = {
            'click': this.onChartClick,
        };
        var divContentArray = [];
        columnarChartOption = this.buildChartOption();
        var avgUnderstand=0;
        var number=0;
        //if (!this.isEmptyObject(dataMap)) {
        for (var key in dataMap) {
            var faceEmotionData = dataMap[key];
            (columnarChartOption.xAxis)[0].data.push(faceEmotionData.users.userName);
            (columnarChartOption.series)[0].data.push(Math.abs(parseInt(faceEmotionData.understand/faceEmotionData.count)));
            avgUnderstand+=faceEmotionData.understand;
            number++;

        }

        // }
        for (var key in dataMap) {
            (columnarChartOption.series)[1].data.push(Math.abs(parseInt((faceEmotionData.understand / faceEmotionData.count) / number)));
        }
        var subjectJsonDiv = <div style={{height: '100%'}}>
            <div style={{height: '100%'}} className="echarts_wrap">
                <ReactEcharts
                    option={columnarChartOption}
                    style={{height: '100%', width: '100%'}}
                    // loadingOption={this.getLoadingOption()}
                    // showLoading={true}
                    // onChartReady={this.onChartReady}
                    onEvents={onEvents}
                    className=''/>
            </div>
        </div>;

        divContentArray.push(subjectJsonDiv);
        this.setState({divContentArray});

    };
    getLocalClassEachStudentFaceEmotion = () =>  {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var vid = searchArray[0].split('=')[1];
        var _this = this;
        var param;
        param = {
            "method": 'getLocalClassEachStudentFaceEmotion',
            "vid": vid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var dataMap = result.response;
                console.log(dataMap);
                _this.initEachStudentFaceEmotionCharts(dataMap);
            },
            onError: function (error) {
                console.log(error);
            }
        });
    }
    buildChartOption = () => {
        var _this = this;
        return {
            color: colors,

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            title: {
                text: '学生课堂理解度'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            /*      toolbox: {
             feature: {
             dataView: {show: true, readOnly: false},
             restore: {show: true},
             saveAsImage: {show: true}
             }
             },*/
            // legend: {
            //     // data:['理解度','时长']
            //     data:['理解度']
            // },
            dataZoom: [
                {
                    show: true,
                    //开始位置的百分比，0 - 100
                    start: 0,
                    //结束位置的百分比，0 - 100
                    end: 100
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    // data: ['学生A','学生B','学生C','学生D','学生E','学生F','学生G','学生H','学生I','学生J','学生K','学生L'],
                    data: [],
                    triggerEvent: true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '理解度',
                    min: 0,
                    //max: 100,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },

                {
                    type: 'value',
                    name: '班级平均理解度',
                    min: 0,
                    //max: 20,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        formatter: '{value}  %'
                    }
                }
            ],
            series: [
                {
                    name: '理解度',
                    type: 'bar',
                    showLabel: true,
                    // data:[-2.0, -40.9, 7.0, 23.2, -25.6, 76.7, -13.6, 62.2, 32.6, 20.0, 6.4, 3.3],
                    data: [],
                    itemStyle: {normal: {label: {show: true}}}
                },
                {
                    name: '班级平均理解度',
                    type: 'line',
                    yAxisIndex: 1,
                    // data:[2.0, 2, 3, 4, 6, 10, 19, 10, 15.0, 16, 12.0, 6],
                    data: [],
                    itemStyle: {
                        normal: {
                            color: 'red'
                        }
                    },
                }
            ]
        };
    };
    getVclassFaceEmotionsStatistics = () => {
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var vid = searchArray[0].split('=')[1];
        var status = searchArray[1].split('=')[1];
        this.setState({vid: vid});
        if(status=='close') {
            this.classOver();
        }
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
                setTimeout(function(){ setInterval(_this.fetchNewDate, 4000); }, 3000);
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
    cutDataHandle =(data)=>{
        var newData={};
        var time;
        var facedata;
        if (!this.isEmptyObject(data)) {
            for (var key in data) {
                time=key;
                facedata= data[key];
            }

        }
        newData[key]=facedata;
        return newData;
    }
    handleResourse = (resourse) => {
        if (!resourse) {
            Toast.fail(resourse, 1);
            return;
        }
        var faceEmotionDatas =resourse ;
        var lineChartOption = this.state.lineChartOption;
        var i = 1;
        var lastPoint;

        var currentFaceEmotion;
        if (!this.isEmptyObject(faceEmotionDatas)) {
           var faceEmotionDatascut= this.cutDataHandle(faceEmotionDatas)
            for (var key in faceEmotionDatascut) {
                i++;
                var faceEmotionData = faceEmotionDatascut[key];
                currentFaceEmotion = faceEmotionData;
                var xMinuite = this.formatSeconds(key);
                this.closeCollectData=xMinuite;
                if (xMinuite > 60) {
                    break;
                }
                (lineChartOption.xAxis)[0].data.push(xMinuite);
                var count=faceEmotionData.count;
                (lineChartOption.series)[0].data.push(faceEmotionData.attention.toFixed(2)/count);
                (lineChartOption.series)[1].data.push(faceEmotionData.confuse.toFixed(2)/count);
                (lineChartOption.series)[2].data.push(faceEmotionData.thinking.toFixed(2)/count);
                (lineChartOption.series)[3].data.push(faceEmotionData.joy.toFixed(2)/count);
                (lineChartOption.series)[4].data.push(faceEmotionData.surprise.toFixed(2)/count);
                (lineChartOption.series)[5].data.push(faceEmotionData.understand.toFixed(2)/count);
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
            this.showUserHandleByScreenWidth({});
            this.setState({lineChartOption: lineChartOption});
            this.setState({lastPoint: lastPoint});
        }

    }

    showUserHandleByScreenWidth = (data) => {
        // var oldData=this.lastData;
        // var noUnderstandUserList = data.noUnderstandUserList;
        // var understandUserList = data.understandUserList;
        // var aliveUserList =data.aliveUserList;
        // var attentionUserList =data.attentionUserList;
        // var confuseUserList = data.confuseUserList;
        // var thinkUserList =data.thinkUserList;
        // var newData={noUnderstandUserList:noUnderstandUserList,understandUserList:understandUserList,aliveUserList:aliveUserList,attentionUserList:attentionUserList,confuseUserList:confuseUserList,thinkUserList:thinkUserList}
        // if(oldData!=undefined){
        //     var _noUnderstandUserList = oldData.noUnderstandUserList;
        //     var _understandUserList = oldData.understandUserList;
        //     if(_understandUserList!=undefined){
        //         for(var i=0;i<_understandUserList.length;i++){
        //             var user=_understandUserList[i];
        //             var userId1=user.colUid;//上一次的数据
        //             var noUndersFlag1=false;
        //             var underFlag2=false;
        //             if(noUnderstandUserList!=undefined){
        //                 for(var j=0;j<noUnderstandUserList.length;j++){
        //                     var userId2=noUnderstandUserList[j].colUid;
        //                     if(userId1==userId2){
        //                         noUndersFlag1=true;//表示在下一次有
        //                     }
        //                 }
        //             }
        //             if(understandUserList!=undefined){
        //                 for(var k=0;k<understandUserList.length;k++){
        //                     var userId3=understandUserList[k].colUid;
        //                     if(userId1==userId3){
        //                         underFlag2=true;//表示在下一次有
        //                     }
        //                 }
        //             }
        //             if(noUndersFlag1){
        //                 return
        //             }
        //             if(underFlag2){
        //                 return
        //             }
        //             if(!noUndersFlag1&&!underFlag2){
        //                 if( newData.understandUserList==undefined){
        //                     newData.understandUserList=new Array();
        //                 }
        //                 newData.understandUserList.push(user);
        //             }
        //
        //         }
        //     }
        //     ///////
        //     if(_noUnderstandUserList!=undefined) {
        //         for (var i = 0; i < _noUnderstandUserList.length; i++) {
        //             var user = _noUnderstandUserList[i];
        //             var userId1 = user.colUid;//上一次的数据
        //             var noUndersFlag1 = false;
        //             var underFlag2 = false;
        //             if(noUnderstandUserList!=undefined){
        //                 for (var h = 0; h < noUnderstandUserList.length; h++) {
        //                     var userId2 = noUnderstandUserList[h].colUid;
        //                     if (userId1 == userId2) {
        //                         noUndersFlag1 = true;//表示在下一次有
        //                     }
        //                 }
        //             }
        //             if(noUnderstandUserList!=undefined) {
        //                 for (var m = 0; k < understandUserList.length; m++) {
        //                     var userId3 = understandUserList[m].colUid;
        //                     if (userId1 == userId3) {
        //                         underFlag2 = true;//表示在下一次有
        //                     }
        //                 }
        //             }
        //             if (noUndersFlag1) {
        //                 return
        //             }
        //             if (underFlag2) {
        //                 return
        //             }
        //             if (!noUndersFlag1 && !underFlag2) {
        //                 if( newData.noUnderstandUserList==undefined){
        //                     newData.noUnderstandUserList=new Array();
        //                 }
        //                 newData.noUnderstandUserList.push(user);
        //             }
        //
        //         }
        //     }
        // }
        this.setState({currentFaceEmotion: data});
       // this.lastData=data;
    }
    formateNumer = (number, i) => {
        if (!number) {
            return 0.00;
        }
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
                text: '课堂表情数据分析'
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
        var aliveUserNumber=(aliveUserList.length-1)==0?1:aliveUserList.length-1;
        var attention=this.formateNumer(attentionUserList.length/(aliveUserNumber)*100,0);
        var confuse=this.formateNumer((confuseUserList.length/(aliveUserNumber)*100),0);
        var understand=this.formateNumer((understandUserList.length/(aliveUserNumber))*100,0);
        var thinking=this.formateNumer((thinkUserList.length/(aliveUserNumber))*100,0);
        var understandLow25=this.formateNumer((noUnderstandUserList.length/(aliveUserNumber))*100,0);
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
                // understandRecord = "";
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
                //   noUnderstandRecord = "";
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
                <div className='over_flow_auto student_f_auto concentration_title concentration_top'>FaceMind课堂实时表情分析</div>
                <div className={_this.state.faceCont}>
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
                <div className={_this.state.faceCont2}>
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
                <div className="list_wrap_padding face_cont_wrap3 face_cont_wrap3_a">
                    {this.state.divContentArray}
                </div>
            </div>
        );
    }

}
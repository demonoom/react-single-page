import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './studentFaceStatistics.css'
import {
    Toast,
} from 'antd-mobile';
const debug=false;

const mobileUrl = debug?'http://192.168.1.34:9006/Excoord_ApiServer/webservice':'https://www.maaee.com/Excoord_For_Education/webservice';
export default class studentFaceStatistics extends React.Component{
    classOpenSend = 0;
    constructor(props) {
        super(props);
        this.state = {
            lineChartOption: this.initChartOption(),
            lastPoint:'0'
        };
    }
    componentDidMount(){
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
        if(this.classOpenSend==0){
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
            "vid":vid,
            "count":'10',
            "lastPoint":this.classOpenSend,
        };
        console.log(this.classOpenSend);
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
                var data = result.data;
                if (!data.success ) {
                    Toast.fail(data.msg, 1);
                    return;
                }
                _this.classOpenSend=data.class_opened_seconds+5;
                var resourse=data.response;
                _this.handleResourse(resourse);
            });

    };
    formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
// alertx(theTime);
        if(theTime > 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
// alert(theTime1+"-"+theTime);
            if(theTime1 > 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
            }
        }
        var result = ""+parseInt(theTime)+"s";
        if(theTime1 > 0) {
            result = ""+parseInt(theTime1)+"m"+result;
        }
        if(theTime2 > 0) {
            result = ""+parseInt(theTime2)+"h"+result;
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
    getVclassFaceEmotionsStatistics=()=> {
        var loginUser = JSON.parse(localStorage.getItem('loginUser'));
        var _this = this;
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var vid = searchArray[0].split('=')[1];
        const dataBlob = {};
        var param = {
            "method": 'getVclassFaceEmotionsStatistics',
            "vid":vid,
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
                var data = result.data;
                _this.classOpenSend=data.class_opened_seconds+5;
                if (!data.success ) {
                    Toast.fail(data.msg, 1);
                    return;
                }
                var resourse=data.response;
                _this.handleResourse(resourse);
            });
    }
    isEmptyObject=(obj)=>{
        for(var n in obj){return false}
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
        var url = "http://jiaoxue.maaee.com:8091/#/studentFaceStatistics?vid=" + vid;
        window.open(url);
        // var data = {};
        // data.method = 'openNewPage';
        // data.url = url;
        // Bridge.callHandler(data, null, function (error) {
        //     window.location.href = url;
        // });
    };
    onChartReady = (chart) => {
        this._t = setTimeout(function() {
            chart.hideLoading();
        }, 3000);
    };
    handleResourse=(resourse)=>{
        if(!resourse){
            Toast.fail(resourse, 1);
            return;
        }
        var faceEmotionDatas=resourse;
        var lineChartOption=this.state.lineChartOption;
        var i=1;
        var lastPoint;
        if(!this.isEmptyObject(faceEmotionDatas)) {
            for (var key in faceEmotionDatas) {
                i++;
                var faceEmotionData = faceEmotionDatas[key];
                var xMinuite = this.formatSeconds(key);
                if(xMinuite>60){
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

            this.setState({lineChartOption: lineChartOption});
            this.setState({lastPoint: lastPoint});
        }else{
            (lineChartOption.xAxis)[0].data.push( this.formatSeconds(this.classOpenSend));
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
    initChartOption = () => {
        return {
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            title: {
                text: ''
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[{name:'专注',icon:'rect'},
                    {name:'疑惑',icon:'rect'},
                    {name:'思考',icon:'rect'},
                    {name:'喜悦',icon:'rect'},
                    {name:'惊讶',icon:'rect'},
                    {name:'理解',icon:'rect'},
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
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    axisTick: {length:2},
                    data : [],
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'专注',
                    type:'line',
                    smooth:true,  //这句就是让曲线变平滑的
                    itemStyle:{
                        normal:{
                            color:'green'
                        }
                    },
                    data:[]
                },
                {
                    name:'疑惑',
                    type:'line',
                    smooth:true,  //这句就是让曲线变平滑的
                    itemStyle:{
                        normal:{
                            color:'black'
                        }
                    },
                    data:[]
                },
                {
                    name:'思考',
                    type:'line',
                    smooth:true,  //这句就是让曲线变平滑的
                    itemStyle:{
                        normal:{
                            color:'#DA22FF'
                        }
                    },
                    data:[]
                },
                {
                    name:'喜悦',
                    type:'line',
                    smooth:true,  //这句就是让曲线变平滑的
                    itemStyle:{
                        normal:{
                            color:'blue'
                        }
                    },
                    data:[]
                },
                {
                    name:'惊讶',
                    type:'line',
                    smooth:true,  //这句就是让曲线变平滑的
                    itemStyle:{
                        normal:{
                            color:'yellow'
                        }
                    },
                    data:[]
                },
                {
                    name:'理解',
                    type:'line',
                    smooth:true,  //这句就是让曲线变平滑的
                    itemStyle:{
                        normal:{
                            color:'red'
                        }
                    },
                    data:[]
                }
            ]
        };
    };
    render(){
        var _this = this;
        var lineChartOption=_this.state.lineChartOption;
    /*    // //上下行间距
        // const jump=()=>{
        //     return (<div onClick={() => this.openNewPage()}>新页面打开</div>);
        // }*/
        return (

            <div className="student_cont">
                <div onClick={() => this.openNewPage()} className="top_right_btn">新页面打开</div>
            <div className='over_flow_auto student_f_auto'>
                <span className="student_f_left">占比/％</span>
                <span className="student_f_right">时间/M</span>
                <div>
                    <ReactEcharts
                        option={lineChartOption}
                        style={{height: '350px', width: '100%'}}
                       // loadingOption={this.getLoadingOption()}
                       // showLoading={true}
                       // onChartReady={this.onChartReady}
                        className='' />
                    <pre>
          </pre>
                </div>
            </div>
            </div>
        );
    }

}
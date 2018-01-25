import React from 'react';
import ReactEcharts from 'echarts-for-react';
import './studentFaceStatistics.css'
import {
    Toast,
} from 'antd-mobile';
const debug=false;

const mobileUrl = debug?'http://192.168.1.34:9006/Excoord_ApiServer/webservice':'http://www.maaee.com/Excoord_For_Education/webservice';
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
        setInterval(this.fetchNewDate, 5000);

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
            "count":'5',
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
                var xMinuite = parseInt(key / 60);
                if(xMinuite>60){
                    break;
                }
                (lineChartOption.xAxis)[0].data.push(xMinuite);
                (lineChartOption.series)[0].data.push(faceEmotionData.attention.toFixed(2));
                (lineChartOption.series)[1].data.push(faceEmotionData.browFurrow.toFixed(2));
                (lineChartOption.series)[2].data.push(faceEmotionData.chinRaise.toFixed(2));
                (lineChartOption.series)[3].data.push(faceEmotionData.joy.toFixed(2));
                (lineChartOption.series)[4].data.push(faceEmotionData.surprise.toFixed(2));
                lastPoint = key;
            }

            this.setState({lineChartOption: lineChartOption});
            this.setState({lastPoint: lastPoint});
        }else{
            (lineChartOption.xAxis)[0].data.push( parseInt(this.classOpenSend / 60));
            (lineChartOption.series)[0].data.push(0);
            (lineChartOption.series)[1].data.push(0);
            (lineChartOption.series)[2].data.push(0);
            (lineChartOption.series)[3].data.push(0);
            (lineChartOption.series)[4].data.push(0);
            this.setState({lineChartOption: lineChartOption});
            this.setState({lastPoint: lastPoint});
        }

    }
    initChartOption = () => {
        return {
            title: {
                text: ''
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['专注','皱眉','思考','喜悦','惊讶']
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
                            color:'#E872FF'
                        }
                    },
                    data:[]
                },
                {
                    name:'皱眉',
                    type:'line',
                    smooth:true,  //这句就是让曲线变平滑的
                    itemStyle:{
                        normal:{
                            color:'#F56A55'
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
                            color:'#6DD100'
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
                            color:'#5DA8FF'
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
                            color:'#FFD000'
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
        return (
            <div className="student_cont">
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
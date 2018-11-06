import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, ActivityIndicator, WhiteSpace,Picker,Modal
} from 'antd-mobile';
import '../css/KnowledgeStatic.less'
const alert = Modal.alert;
export default class KnowledgeStatic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            domArray: [],
            clientHeight: document.body.clientHeight,
            animating: false,
            defaultValue: ['第三项'],
            nameArray:[],
            isHidden:false,
            type:'学生',
            //不再更新学生列表
            noUpdata: false,
        }
    }

    componentDidMount() {
        document.title = '知识点统计';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var openId = searchArray[0].split('=')[1];
        //获取前一个月的日期
        var startDate = new Date(WebServiceUtil.formatYMD(new Date().setMonth(new Date().getMonth() - 1)));
        var endDate = new Date();
        this.setState({
            openId: openId,
            startDate: startDate,
            endDate:endDate,
        }, function () {
            this.getUsersByOpenId(()=>{
                this.getAvgMasteryAccuaryLineChartData();
            })
        }.bind(this))
    }


    //获取用户信息
    getUsersByOpenId(callback){
        var param = {
            "method": 'getUsersByOpenId',
            "openId" :this.state.openId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'用户信息');
                if (result.success) {
                    var res = result.response;
                    if(res.length > 1){
                        alert('提示', '请选择您的角色', [
                            { text: '老师', onPress: () => {
                                for(var k in res){
                                    if(res[k].colUtype == "TEAC"){
                                        this.setState({
                                           userId: res[k].colUid,
                                            type:'老师',
                                        },()=>{
                                            if(callback){
                                                callback();
                                            }
                                        })
                                    }
                                }
                            } },
                            { text: '家长', onPress: () => {
                                for(var k in res){
                                    if(res[k].colUtype == "PAREN"){
                                        this.setState({
                                            userId: res[k].colUid,
                                        },()=>{
                                            if(callback){
                                                callback();
                                            }
                                        })
                                    }
                                }
                            } },
                        ])
                    }else if(res.length > 0){
                        this.setState({
                            //设置默认选中的学生
                            userId: res[0].colUid,
                        },()=>{
                            if(callback){
                                callback();
                            }
                        })
                    }else{
                        this.setState({
                            isHidden: true,
                        })
                    }
                } else {
                    Toast.fail('请求出错');
                    this.hideToast();
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    buildChartOption = (xClassArray, YArray) => {
        return {
            title: {
                // text: '知识点',   //标题  建议使用自定义
                // fontSize:'12px'
            },
            tooltip: {
                trigger: 'axis', //轴,
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line',         // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {          // 直线指示器样式设置
                        color: '#638BB7',
                        width: 1,
                        type: 'solid'
                    },
                },
            },
            legend: {
                data: ['正确率'],
                x: 'right',
                right: '0',
                textStyle: {
                    fontSize: 12,
                    color:'#666',
                }

            },
            grid:{
                x:27,
                y:55,
                x2:0,
                y2:30,
            },
            visualMap: {
                show: false,
                min: 0,
                max: 1000,
                color: ['#2B84EF']  , //折线颜色
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: xClassArray,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#C9C9C9',
                            width: 1,
                            type: 'solid'
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#666',
                            fontSize: 12
                        },
                        //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                        rotate: 0,
                        //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                        interval: 'auto',
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    name: '正确率',
                    max: 100,
                    min: 0,
                    boundaryGap: [0, 0],  //边距
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#C9C9C9',
                            width: 1,
                            type: 'solid'
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#eee',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#666',
                            fontSize: 12
                        },
                        //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                        rotate: 0,
                        //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                        interval: 'auto',
                    },
                },
            ],
            dataZoom: [
                {
                    show: false,
                    //开始位置的百分比，0 - 100
                    start: 0,
                    //结束位置的百分比，0 - 100
                    end: 100,
                    bottom:"7%",
                }
            ],
            series: [
                {
                    name: '正确率',
                    smooth: true,
                    showAllSymbol: true,
                    symbol: 'emptyCircle',
                    // symbolSize: 15,
                    type: 'line',
                    data: YArray,
                    // smooth: false,
                    label: {
                        normal: {
                            show: true,            //显示数字
                            position: 'top'        //这里可以自己选择位置
                        }
                    },
                    itemStyle: {
                        //通常情况下：
                        normal: {
                            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                            color: '#2B84EF',
                        },

                    },
                    // symbol: 'star',//节点形状
                }
            ],
            animation: true,
        };
    };


    getData(data) {   //设置数据结构
        console.log(data);
        if (!data) {
            Toast.info('暂无数据', 1);
        }
        var xArray = [],yArray = [];
        for(var k in data){
            xArray.push(data[k].x);
            yArray.push(data[k].y);
        }
        var columnarChartOption = this.buildChartOption(xArray,yArray);
        let onEvents = {
            'click': this.onChartClick.bind(this),
        }
        // columnarChartOption.getZr().click(function(event){
        //     if(!event.target){ console.log("点击空白处"); }
        // })
        var reactDom =
            <ReactEcharts start
                          option={columnarChartOption}
                          style={{height: this.state.clientHeight / 2 + 50, width: '100%'}}
                          // theme='macarons'
                          onEvents={onEvents}
                          className=''/>
        this.setState({
            domArray: reactDom,
        });
        this.hideToast();
    }


    onChartClick(optional) {
        var url = WebServiceUtil.mobileServiceURL + "KnowLedgeList?uid=" + this.state.userId + '&currentTime=' + optional.name;
        window.location.href = url;
        window.location.reload();
    }


    getAvgMasteryAccuaryLineChartData() {
        this.showToast();
        var param = {
            "method": 'getAvgMasteryAccuaryLineChartData',
            "startTime": WebServiceUtil.formatYMD(this.state.startDate.getTime()),
            "endTime": WebServiceUtil.formatYMD(this.state.endDate.getTime()),
            "userId" : this.state.userId
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,'图标数据');
                if (result.success) {
                    this.getData(result.response);
                    if(this.state.noUpdata){
                        return;
                    }else{
                        var newArray = result.users;
                        var newArray2=[];
                        for(var k in newArray){
                            newArray2.push({
                                label:newArray[k].userName,
                                value:newArray[k].colUid
                            })
                        }
                        this.setState({
                            nameArray: newArray2,
                            defaultValue:[newArray2[0].value],
                            noUpdata:true,
                        })
                    }

                } else {
                    this.hideToast();
                    Toast.fail('请求出错');

                }
            },
            onError: function (error) {
                this.hideToast();
                Toast.fail(error, 1);
            }
        });
    }


    showToast = () => {
        this.setState({animating: true});
    }

    hideToast = () => {
        this.setState({animating: false});
    }

    dateChange(event) {
        this.setState({
            startDate: event,
        }, function () {
            this.getAvgMasteryAccuaryLineChartData();
        }.bind(this))
    }

    endDateChange(event) {
        this.setState({
            endDate: event,
        }, function () {
            this.getAvgMasteryAccuaryLineChartData();
        }.bind(this))
    }

    onChangeColor = (params) => {
        this.setState({
            defaultValue: params,
            userId:params[0]
        },()=>{
            this.getAvgMasteryAccuaryLineChartData();
        });
    };

    toBindHTML(){
        console.log('toBindHTML');
        var url = WebServiceUtil.mobileServiceURL + "KnowledgeLogin?unid=" + this.state.openId;
        window.location.href = url;
    }



    render() {
        return (
            <div id="KnowledgeStatic" style={{
                height: this.state.clientHeight + 'px',
                overflow: 'auto',
            }}>
                <div className='emptyCont' style={this.state.isHidden?{display:'block'}:{display:'none'}}>
                    <img src={require('../img/weixin-empty.png')} alt=""  width="104" /><br />
                    该微信号还没有绑定,请<span className="toBind" onClick={this.toBindHTML.bind(this)}>前往绑定</span>
                </div>
                <div style={this.state.isHidden?{display:'none'}:{display:'block'}}>
                    <Picker disabled={this.state.type=='老师'?true:false} data={this.state.nameArray} cols={1} value={this.state.defaultValue} onOk={this.onChangeColor} className="forss">
                        <List.Item arrow="horizontal">{this.state.type}:</List.Item>
                    </Picker>
                    <DatePicker
                        mode="date"
                        extra={this.state.startDate}
                        value={this.state.startDate}
                        onOk={this.dateChange.bind(this)}
                    >
                        <List.Item arrow="horizontal" className="data_list">开始日期</List.Item>
                    </DatePicker>
                    <WhiteSpace size="lg"/>
                    <DatePicker
                        mode="date"
                        extra={this.state.endDate}
                        value={this.state.endDate}
                        onOk={this.endDateChange.bind(this)}
                    >
                        <List.Item arrow="horizontal" className="data_list">结束日期</List.Item>
                    </DatePicker>
                    <WhiteSpace size="lg"/>
                    <div className="dom_cont">
                        {this.state.domArray}
                    </div>
                    <ActivityIndicator
                        toast
                        text="Loading..."
                        animating={this.state.animating}
                    />
                </div>

            </div>
        );
    }

}
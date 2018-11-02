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
        }
    }

    componentDidMount() {
        // Bridge.setShareAble("false");
        document.title = '知识点统计';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var openId = searchArray[0].split('=')[1];
        var startDate = new Date('2010-01-01');
        var endDate = new Date();
        this.setState({
            openId: openId,
            startDate: startDate,
            endDate:endDate,
        }, function () {
            this.getUsersByOpenId(()=>{
                console.log(this.state.userId,'userId')
                console.log(this.state.userType,'userId')
                console.log(this.state.userName,'userId')
                this.setState({

                },()=>{
                    console.log(this.state.nameArray,'nameArray')
                    console.log(this.state.defaultValue,'defaultValue')
                    this.getAvgMasteryAccuaryLineChartData();
                })
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
                                           // userType: res[k].colUtype,
                                           userId: res[k].colUid,
                                            type:'老师'
                                           // userName:res[k].userName
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
                                            // userType: res[k].colUtype,
                                            userId: res[k].colUid,
                                            // userName:res[k].userName
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
                            // userType: res[0].colUtype,
                            userId: res[0].colUid,
                            // userName:res[0].userName
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
                trigger: 'axis'  //轴,
            },
            legend: {
                data: ['正确率'],
                x: 'right',
                textStyle: {
                    fontSize: 14
                }

            },
            grid:{
                x:25,
                y:33,
                x2:25,
                y2:80,
            },
            visualMap: {
                show: false,
                min: 0,
                max: 1000,
                color: ['red']   //折线颜色
            },
            xAxis: [
                {
                    type: 'category',
                    // name:'时间',
                    boundaryGap: true,
                    data: xClassArray,
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
                },
            ],
            dataZoom: [
                {
                    show: true,
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
        console.log(optional.name,'onChartClick_name');
        console.log(optional.data,'onChartClick_data');
        if(optional.data <= 0){
            Toast.info('数据为空无法查看');
        }else{
            // window.open(WebServiceUtil.mobileServiceURL + "KnowLedgeList?uid=" + this.state.userId + '&currentTime=' + optional.name);
            window.location.href = WebServiceUtil.mobileServiceURL + "KnowLedgeList?uid=" + this.state.userId + '&currentTime=' + optional.name;
        }
        // console.log(idArray[optional.dataIndex], '学生id');
        // if (idArray[optional.dataIndex]) {
        //     var analysisUrl = WebServiceUtil.mobileServiceURL + "answerFormStudent?studentId=" + idArray[optional.dataIndex] + "&topicId=" + this.state.topicId;
        //     var data = {
        //         method: 'openNewPage',
        //         url: analysisUrl,
        //     };
        //     Bridge.callHandler(data, null, function (error) {
        //         window.location.href = analysisUrl;
        //     });
        // } else {
        //     Toast.info('学生id不存在!');
        // }
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
                    var newArray = result.users;
                    console.log(newArray,'newArray')
                    var newArray2=[];
                    for(var k in newArray){
                        newArray2.push({
                            label:newArray[k].userName,
                            value:newArray[k].colUid
                        })
                    }
                    this.setState({
                        nameArray: newArray2,
                        defaultValue:[newArray2[0].value]
                    },()=>{

                    })
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
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
        console.log(params,'OKOKOKOK')
        this.setState({
            defaultValue: params,
        });
    };



    render() {
        const colors = [{
            label: '第一项',
            value: '第一项',
        },{
                label: '第二项',
                value: '第二项',
        },{
                label: '第三项',
                value: '第三项',
        }];
        return (
            <div id="KnowledgeStatic" style={{
                height: this.state.clientHeight + 'px',
                overflow: 'auto',
            }}>
                <div style={this.state.isHidden?{display:'block'}:{display:'none'}}>
                    该微信号未绑定
                </div>
                <div style={this.state.isHidden?{display:'none'}:{display:'block'}}>
                    <Picker disabled={this.state.type=='老师'?true:false} data={this.state.nameArray} cols={1} value={this.state.defaultValue} onOk={this.onChangeColor} className="forss">
                        <List.Item arrow="horizontal">{this.state.type}:</List.Item>
                    </Picker>
                    <DatePicker
                        mode="date"
                        // title="Select Date"
                        extra={this.state.startDate}
                        value={this.state.startDate}
                        // onChange={date => this.setState({ date })}
                        onOk={this.dateChange.bind(this)}

                    >
                        <List.Item arrow="horizontal" className="data_list">开始日期</List.Item>
                    </DatePicker>
                    <WhiteSpace size="lg"/>
                    <DatePicker
                        mode="date"
                        // title="Select Date"
                        extra={this.state.endDate}
                        value={this.state.endDate}
                        // onChange={date => this.setState({ date })}
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
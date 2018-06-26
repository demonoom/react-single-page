import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, Button, Picker
} from 'antd-mobile';
import '../css/answerFormStudent.less'
import '../css/macarons'

export default class answerFormStudent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            domArray: [],
            clientHeight: document.body.clientHeight,

        }
    }

    componentDidMount() {
        document.title = '作业表情分析';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var studentId = searchArray[0].split('=')[1];
        var topicId = searchArray[1].split('=')[1];
        this.setState({
            studentId:studentId,
            topicId: topicId,
        },function(){
            this.getFuzzyHomeworkEmotionByStudent();
        }.bind(this))
    }

  // todo type == 0 为理解度 反之为时长
    buildChartOption = (category, barData, lineData,type) => {
        var _this = this;
        var avgText = type == 0?'平均理解度':'平均时长';
        var text = type == 0? '理解度':'时长';
        return {
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: [avgText, text],
                textStyle: {
                    // color: '#5793f3'
                }
            },
            dataZoom: [
                {
                    show: true,
                    //开始位置的百分比，0 - 100
                    start: 0,
                    //结束位置的百分比，0 - 100
                    end: 100
                }
            ],
            xAxis: {
                data: category,  //x轴文本
                axisLine: {
                    lineStyle: {
                        // color: '#5793f3'
                    }
                }
            },
            yAxis: {
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        // color: '#5793F0'
                    }
                }
            },
            series: [{
                name: avgText,
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,  //
                label: {
                    normal: {
                        show: true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }, {
                name: text,
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                    normal: {
                        show: true,
                        position: 'top',
                        barBorderRadius: 5,
                        // color: (
                        //     0, 0, 0, 1,
                        //         [
                        //             {offset: 0, color: '#14c8d4'},
                        //             {offset: 1, color: '#43eec6'}
                        //         ]
                        // )
                    }
                },
                data: barData,   //柱状值
                label: {
                    normal: {
                        show: true,            //显示数字
                        position: 'top'        //这里可以自己选择位置
                    }
                }
            }
            ]
        };
    };


    getData(data) {
        console.log(data);
        var category = [], barData = [], lineData = [],barDataForTime=[],lineDataForTime = [],sum=0,timeSum=0;
        for (var k in data) {
            category.push('题目' + data[k].answer.item.index);
            barData.push((data[k].understand).toFixed(2));
            barDataForTime.push((data[k].elapsedTime).toFixed(2));
            sum += data[k].understand;
            timeSum += data[k].elapsedTime;
        }
        for(var k in data){
            lineData.push((sum / data.length).toFixed(2));
            lineDataForTime.push((timeSum / data.length).toFixed(2));
        }
        var columnarChartOption = this.buildChartOption(category, barData, lineData,0);
        var columnarChartOptionForTime = this.buildChartOption(category,barDataForTime,lineDataForTime,1)
        var domArray = [];
        var title = data.length > 0 ?data[0].users.userName+'作答理解度详情':'暂无数据';
        var rem = <div>
            <div className="title">{title}</div>
            <div style={{height: '300px'}} className="echarts_wrap">
                <ReactEcharts
                    option={columnarChartOption}
                    style={{height: '100%', width: '100%'}}
                    theme='macarons'
                />
            </div>
        </div>
        title = data.length > 0 ?data[0].users.userName+'作答时长详情':'暂无数据';
        var rom = <div>
            <div className="title">{title}</div>
            <div style={{height: '300px'}} className="echarts_wrap">
                <ReactEcharts
                    option={columnarChartOptionForTime}
                    style={{height: '100%', width: '100%'}}
                    theme='macarons'
                />
            </div>
        </div>
        domArray.push(rem);
        domArray.push(rom);
        this.setState({
            domArray: domArray,
        });
    }


    getFuzzyHomeworkEmotionByStudent() {
        var param = {
            "method": 'getFuzzyHomeworkEmotionByStudent',
            "topicId": this.state.topicId,
            "userId": this.state.studentId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (result) => {
                var response = result.response;
                // console.log(response);
                this.getData(response);
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    };

    render() {
        return (
            <div id="answerFormStudent" style={{
                height: this.state.clientHeight + 'px',
                overflow: 'auto'
            }}>
                {this.state.domArray}
            </div>
        );
    }

}
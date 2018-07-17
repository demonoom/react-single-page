import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast, DatePicker, List, Button, Picker
} from 'antd-mobile';
import '../css/answerListFormTeacher.less'
import '../css/macarons'

export default class answerListFormTeacher extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            domArray: [],
            clientHeight: document.body.clientHeight,
            type: 0,   //   0 为作业理解度分析统计  1 为时长统计
        }
    }

    componentDidMount() {
        document.title = '作业表情分析';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var teacherId = searchArray[0].split('=')[1];
        var topicId = searchArray[1].split('=')[1];
        this.setState({
            topicId: topicId,
            teacherId: teacherId,
        }, function () {
            this.getFuzzyHomeworkEmotionByTopicId();
        }.bind(this))
    }


    buildChartOption = (category, barData, lineData) => {
        // debugger
        var _this = this;
        var text = this.state.type == 0 ? '理解度' : '时长';
        return {
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['平均' + text, text],
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
                    end: 15,
                    minSpan:0,
                    //maxSpan:10,
                    //zoomLock:true,
                },
                {
                    show: true,
                    type: 'inside',
                    xAxisIndex: [0],
                    start:0,
                    end:15,
                    minSpan:0,
                    //maxSpan:10,
                    //zoomLock:true,
                    /*//开始位置的百分比，0 - 100
                    start: 0,
                    //结束位置的百分比，0 - 100
                    end: 100*/
                }
            ],
            xAxis: {
                data: category,
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
                name: '平均' + text,
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: lineData,
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
                data: barData,
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

    onChartClick(idArray, optional) {
        console.log(idArray[optional.dataIndex], '学生id');
        if (idArray[optional.dataIndex]) {
            var analysisUrl = WebServiceUtil.mobileServiceURL + "answerFormStudent?studentId=" + idArray[optional.dataIndex] + "&topicId=" + this.state.topicId;
            var data = {
                method: 'openNewPage',
                url: analysisUrl,
            };
            Bridge.callHandler(data, null, function (error) {
                window.location.href = analysisUrl;
            });
        } else {
            Toast.info('学生id不存在!');
        }


    }

    getData(data) {   //设置数据结构
        // debugger
        var domArray = [];
        console.log(data, 'getData')
        for (var k in data) {  //todo 循环生成题目
            var reactDom = [];
            var reactEchartsArray = [];   //要渲染的图表数组
            var classArray = data[k].clazzArray;   //获取到班级数组
            var category = [], barData = [], lineData = [], sum = 0, idArray = [];
            for (var v in classArray) {  //todo 循环生成图表
                var studentArray = classArray[v].fuzzyHomeworkAnswerEmotions;
                for (var s in studentArray) {  //todo 循环添加x轴数字及柱状数据    4
                    if (this.state.type == 0) {
                        console.log(studentArray[s].understand,'underStand');
                        console.log(studentArray[s].users.userName,'userName');
                        category.push(studentArray[s].users.userName+'('+classArray[v].pbClazz.name+")");
                        barData.push((studentArray[s].understand).toFixed(2));
                        sum += studentArray[s].understand;
                        // console.log('理解度')
                    } else {
                        category.push(studentArray[s].users.userName+'('+classArray[v].pbClazz.name+")");
                        barData.push((studentArray[s].elapsedTime).toFixed(2));
                        sum += studentArray[s].elapsedTime;
                        console.log('时长')
                    }
                    idArray.push(studentArray[s].studentId)
                }
                for (var s in studentArray) {   //循环添加平均值
                    // lineData.push((sum / studentArray.length).toFixed(2));
                    lineData.push((this.state.type == 0?data[k].avgUnderstand:data[k].avgTime).toFixed(2));
                }
                // console.log(category,'category');
                // console.log(barData);
                // console.log(lineData);
                if (category.length == 0 && barData.length == 0 && lineData.length == 0) {
                    console.log('拒接');
                } else {
                    var columnarChartOption = this.buildChartOption(category, barData, lineData);

                    console.log(columnarChartOption,'columnarChartOption');

                    let onEvents = {
                        'click': this.onChartClick.bind(this, idArray),
                    }
                    reactDom =
                        <ReactEcharts
                            option={columnarChartOption}
                            style={{height: '100%', width: '100%'}}
                            onEvents={onEvents}
                            theme='macarons'
                        />
                    // console.log(reactDom);
                    // reactEchartsArray.push(reactDom);
                }
            }
            var rem = <div className="canvasBox_cont">
                <div className="title">题目{data[k].questionCount}</div>
                <div className="sort">{this.state.type == 0 ? '本题耗时排名' : '本题理解度排名'}:{data[k].sort}</div>
                <div style={{height: '300px'}} className="echarts_wrap">
                    {reactDom}
                </div>
            </div>
            domArray.push(rem);
        }
        this.setState({
            domArray: domArray,
        });
    }

    getFuzzyHomeworkEmotionByTopicId() {
        var param = {
            "method": 'getFuzzyHomeworkEmotionByTopicId',
            "topicId": this.state.topicId,
            "userId": this.state.teacherId,
            "type": this.state.type
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    this.getData(result.response);
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    tabType() {
        this.setState({
            type: Math.abs(this.state.type - 1),
        }, function () {
            this.getFuzzyHomeworkEmotionByTopicId();
        }.bind(this))
    }

    render() {
        return (
            <div id="answerListFormTeacher" style={{
                height: this.state.clientHeight + 'px',
                // overflow: 'auto',
            }}>
                <button className="topButton" onClick={this.tabType.bind(this)}>
                    切换至{this.state.type == 0 ? '时长统计' : '理解度统计'}</button>
                <div className="canvasBox" style={{
                    height: this.state.clientHeight + 'px'
                }}>
                    {this.state.domArray}
                </div>
            </div>
        );
    }

}
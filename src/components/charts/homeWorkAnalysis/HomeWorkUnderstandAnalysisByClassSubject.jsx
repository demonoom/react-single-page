import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast,DatePicker,List,Button,Picker
} from 'antd-mobile';
import './css/homeWorkAnalysis.less'
var colors = ['#5793f3', '#d14a61'];

// 如果不是使用 List.Item 作为 children
const CustomChildren = (props) => {
    return (
        <div
            onClick={props.onClick}
            style={{ backgroundColor: '#fff', height: 45, lineHeight: '45px', padding: '0 15px' }}
        >
            {props.children}
            <span style={{ float: 'right' }}>{props.extra}</span>
        </div>
    );
};
export default class HomeWorkUnderstandAnalysisByClassSubject extends React.Component {

    constructor(props) {
        super(props);
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.state = {
            lastPoint: '0',
            currentFaceEmotion:{},
            screenHeight:screen.height,
            stuNameArray:[],
            avgOfTimeLengthArray:[],
            avgOfUnderstandArray : [],
            subjectContentArray:[],
            date: now,
            classList:[],
            clazzId: [],
        };
        this.analysisByClass = this.analysisByClass.bind(this);
        this.getTeacherClasses = this.getTeacherClasses.bind(this);
        this.getHomeWorkUnderstandAnalysisByClassSubject = this.getHomeWorkUnderstandAnalysisByClassSubject.bind(this);
    }

    componentDidMount() {
        document.title = '学生作业题目理解度统计';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        //todo 调用接口，完成班级学生平均理解度和平均时长数据的获取
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        // var userId = searchArray[0].split('=')[1];
        // this.getTeacherClasses(userId);
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var clazzId = searchArray[0].split('=')[1];
        var pushTime = searchArray[1].split('=')[1];
        this.getHomeWorkUnderstandAnalysisByClassSubject(clazzId,pushTime);
    }

    getHomeWorkUnderstandAnalysisByClassSubject(clazzId,pushTime){
        var _this = this;
        var param = {
            "method": 'getHomeWorkUnderstandAnalysisByCLassSubject',
            "clazzId": clazzId,
            "pushTime": pushTime
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var dataArray = result.response;
                var columnarChartOption = _this.state.columnarChartOption;
                var subjectDivContentArray = [];
                if(dataArray!=null && dataArray.length!=0){
                    dataArray.forEach(function (analysisJsonStr,index) {
                        var analysisJson = JSON.parse(analysisJsonStr);
                        subjectDivContentArray =  _this.buildSubjectArrayContent(subjectDivContentArray,analysisJson);
                    })
                    console.log(subjectDivContentArray);
                    _this.buildSubjectDivContentArray(subjectDivContentArray);
                }else{

                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }


    buildSubjectArrayContent=(subjectDivContentArray,analysisJson)=>{
        var _this = this;
        var stuJson = {"avgOfUnderstand":analysisJson.avgOfUnderstand,"avgOfTimeLength":analysisJson.avgOfTimeLength,"stuId":analysisJson.stuId,"stuName":analysisJson.stuName};
        var subjectJson = {"subjectId":analysisJson.subjectId,"subjectContent":analysisJson.subjectContent};
        var stuJsonArray = [stuJson];
        var dataJson = {subjectJson,stuJsonArray};
        if(subjectDivContentArray == null || subjectDivContentArray.length ==0){
            subjectDivContentArray.push(dataJson);
        }else{
            var studentJsonArray = _this.hasSameSubjectId(subjectDivContentArray,analysisJson.subjectId);
            if(studentJsonArray == null){
                studentJsonArray = [];
                studentJsonArray.push(stuJson);
                var newDataJson = {subjectJson,stuJsonArray};
                subjectDivContentArray.push(newDataJson);
            }else{
                studentJsonArray.push(stuJson);
            }
        }
        return subjectDivContentArray;
    };

    hasSameSubjectId=(subjectDivContentArray,subjectId)=>{
        var isHave = false;
        for(var i=0;i<subjectDivContentArray.length;i++){
            var subjectDivContent = subjectDivContentArray[i];
            //题目编号
            var subjectIdAtDivContent = subjectDivContent.subjectJson.subjectId;
            if(subjectId == subjectIdAtDivContent){
                isHave = true;
                return subjectDivContent.stuJsonArray;
                break;
            }
        }
        if(isHave == false){
            return null;
        }
    };

    buildSubjectDivContentArray=(subjectDivContentArray)=>{
        var _this = this;
        var divContentArray = [];

        subjectDivContentArray.forEach(function (subjectAndStudentJson,index) {
            var subjectJson = subjectAndStudentJson.subjectJson;
            var stuJsonArray = subjectAndStudentJson.stuJsonArray;
            var subjectShowNo = "题目"+(parseInt(index)+1);
            var columnarChartOption = null;
            var avgOfUnderstandTotal=0;
            var avgOfTimeLengthTotal=0;
            var numTotal=0;
            columnarChartOption = _this.buildChartOption();
            let onEvents = {
                'click': _this.onChartClick,
            }
            stuJsonArray.forEach(function (stuJson) {
                (columnarChartOption.xAxis)[0].data.push(stuJson.stuName);
                avgOfUnderstandTotal+=Math.abs(parseInt(stuJson.avgOfUnderstand));
                avgOfTimeLengthTotal+=Math.abs(parseInt(stuJson.avgOfTimeLength));
                numTotal++;
                (columnarChartOption.series)[0].data.push(Math.abs(parseInt(stuJson.avgOfUnderstand)));
                (columnarChartOption.series)[1].data.push(Math.abs(parseInt(stuJson.avgOfTimeLength)));
                // (columnarChartOption.series)[1].data.push(stuJson.avgOfTimeLength.toFixed(2));
            })
            var subjectJsonDiv=<div>
                <div className="subject_title">{subjectShowNo}:</div>
                <div className="subject_content">
                    <article dangerouslySetInnerHTML={{__html: subjectJson.subjectContent}}></article>
                </div>
                <div style={{height:'300px'}} className="echarts_wrap">
                    <ReactEcharts
                        option={columnarChartOption}
                        style={{height: '100%', width: '100%'}}
                        // loadingOption={this.getLoadingOption()}
                        // showLoading={true}
                        // onChartReady={this.onChartReady}
                        onEvents={onEvents}
                        className='' />
                </div>
                <div className="text_chart">
                    <span>平均理解度:<i>{(avgOfUnderstandTotal/numTotal).toFixed(0)}%</i></span><span>平均理解时间:<i>{(avgOfTimeLengthTotal/numTotal).toFixed(0)}秒</i></span>
                </div>

            </div>;
            divContentArray.push(subjectJsonDiv);
        })
        this.setState({divContentArray});
    };

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
            grid: {
                left: '15%'
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
                    triggerEvent:true
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '理解度',
                    min: 0,
                    max: 100,
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
                    name: '做题时长',
                    min: 0,
                    max: 20,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisTick:{
                        show:true
                    },
                    axisLabel: {
                        show:true,
                        formatter: '{value} 秒'
                    }
                }
            ],
            series: [
                {
                    name:'理解度',
                    type:'bar',
                    showLabel:true,
                    // data:[-2.0, -40.9, 7.0, 23.2, -25.6, 76.7, -13.6, 62.2, 32.6, 20.0, 6.4, 3.3],
                    data:[],
                    itemStyle : { normal: {label : {show: true}}}
                },
                {
                    name:'做题时长',
                    type:'line',
                    yAxisIndex: 1,
                    // data:[2.0, 2, 3, 4, 6, 10, 19, 10, 15.0, 16, 12.0, 6],
                    data:[],
                    itemStyle : { normal: {label : {show: true}}}
                }
            ]
        };
    };

    getLoadingOption = () => {
        return {
            text: '加载中...',
            color: '#4413c2',
            textColor: '#270240',
            maskColor: 'rgba(194, 88, 86, 0.3)',
            zlevel: 0
        };
    };

    onChartClick(optional){
    };

    formatTime(seconds) {
        return [
            parseInt(seconds / 60 / 60),
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
        ]
            .join(":")
            .replace(/\b(\d)\b/g, "0$1");
    };

    getTeacherClasses(ident){
        var _this = this;
        var param = {
            "method": 'getTeacherClasses',
            "ident": ident
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                var classList = [];
                response.forEach(function (e) {
                    var classArray = e.split("#");
                    var classId = classArray[0];
                    var className = classArray[1];
                    var classJson = {label: className,value: classId,}
                    classList.push(classJson)
                });
                _this.setState({classList: classList});
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    };

    analysisByClass(){
        // var d = this.state.date.getDate.toLocaleString();
        var da = new Date(this.state.date);
        var year = da.getFullYear();
        var month = parseInt(da.getMonth()+1)>9?da.getMonth()+1:"0"+(da.getMonth()+1);
        var date = parseInt(da.getDate())>9?da.getDate():"0"+da.getDate();
        var dayStr = [year,month,date].join('-');
        //todo 调用接口，完成班级学生平均理解度和平均时长数据的获取
        this.getHomeWorkUnderstandAnalysisByClassSubject(this.state.clazzId[0],dayStr);
    };

    render() {
        let onEvents = {
            'click': this.onChartClick,
        }
        return (
            <div id="homeWorkAnalysis">
                {/*<div>学生题目理解度统计</div>*/}
                {/*<div>
                    <div>
                        <span>
                            <DatePicker
                                mode="date"
                                title="Select Date"
                                extra="Optional"
                                value={this.state.date}
                                onChange={date => this.setState({ date })}
                            >
                              <List.Item arrow="horizontal">发布日期</List.Item>
                            </DatePicker>
                        </span>
                    </div>
                    <div>
                        <span>
                            <Picker data={this.state.classList} title="选择班级" extra="请选择(可选)" cols={1} value={this.state.clazzId} onChange={(v) => this.setState({ clazzId: v })}>
                                <CustomChildren>班级选择</CustomChildren>
                              </Picker>
                        </span>
                    </div>
                    <div>
                        <span>
                            <Button onClick={this.analysisByClass}>分析</Button>
                        </span>
                    </div>
                </div>*/}
                <div>
                    <div>
                        {/*<div style={{height:'400px'}}>
                        </div>*/}
                        <div className="list_wrap_padding">
                            {this.state.divContentArray}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast
} from 'antd-mobile';
import './css/dashboard.less';

var dataGZ = [
    [1,26],
    [2,85],
    [3,78],
    [4,21],
    [5,41],
    [6,56],
    [7,64],
    [8,55],
    [9,76],
    [10,91],
    [11,84],
    [12,64],
    [13,70],
    [14,77],
    [15,109],
    [16,73],
    [17,54],
    [18,51],
    [19,91],
    [20,73],
    [21,73],
    [22,84],
    [23,93],
    [24,99],
    [25,146],
    [26,113],
    [27,81],
    [28,56],
    [29,82],
    [30,106],
    [31,118]
];


var schema = [
    {name: 'AQIindex', index: 0, text: 'AQI指数'},

];


var itemStyle = {
    normal: {
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
    }
};

export default class dashboard extends React.Component {

    constructor(props) {
        super(props);
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.state = {};
        this.getDashBoardDataByArea = this.getDashBoardDataByArea.bind(this);
    }

    componentDidMount() {
        document.title = '大数据管理驾驶舱';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var destId = searchArray[0].split('=')[1];
        var areaType = searchArray[1].split('=')[1];
        this.setState({destId, areaType});
        //调取驾驶舱数据
        this.getDashBoardDataByArea(destId, areaType);
    }

    /**
     * 调取管理驾驶舱的数据
     * @param destId 目标数据id，如果是国家范围，则id为空，如果是省范围，在id为省的id，如果是学校范围，则id为学校的id
     * @param areaType 区域类型（国家、地区、学校）
     */
    getDashBoardDataByArea(destId, areaType) {
        var _this = this;
        var param;
        param = {
            "method": 'getDashBoardDataByArea',
            "destId": destId,
            "areaType": areaType
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                var jsonObj = JSON.parse(response);
                console.log(jsonObj);
                //学校总人数
                var userCountOfSchool = jsonObj.userCountOfSchool;
                //学校24小时消息总数
                var messageCount = jsonObj.messageCount;
                //蚁巢活跃量
                var topicResults = jsonObj.topicResult;
                //每个学校老师上传的蚁盘资源数量
                var cloudFileResults = jsonObj.cloudFileResult;
                //每个班发布的蚁巢作业数量
                var topicHomeWorkResults = jsonObj.topicHomeWorkResult;
                //正在上课的课堂列表
                var vClazzResults = jsonObj.vClazzResult;
                //今日开课次数统计
                var todayOpenClazzResults = jsonObj.todayOpenClazzResults;
                //本月开课次数统计
                var currentMonthOpenClazzResults = jsonObj.currentMonthOpenClazzResults;
                //班级步数统计排行
                var braceletSportSteps = jsonObj.braceletSportSteps;

                //蚁巢班级数量
                if (WebServiceUtil.isEmpty(userCountOfSchool) == false) {
                    var userCountJson = JSON.parse(userCountOfSchool);
                    var userCount = userCountJson.userCount;
                    var schoolName = userCountJson.schoolName;
                    _this.setState({userCount,schoolName});
                }
                //蚁巢班级数量
                if (WebServiceUtil.isEmpty(topicResults) == false) {
                    _this.buildTopicBarChart(topicResults);
                }
                //老师蚁盘资源上传情况
                if (WebServiceUtil.isEmpty(cloudFileResults) == false) {
                    _this.buildCloudFileBarChart(cloudFileResults);
                }

                //老师蚁盘资源上传情况
                if (WebServiceUtil.isEmpty(topicHomeWorkResults) == false) {
                    // _this.buildTopicHomeWorkTrArray(topicHomeWorkResults);
                    _this.buildHomeWorkPieChart(topicHomeWorkResults);
                }

                //正在上课的课堂列表
                if (WebServiceUtil.isEmpty(vClazzResults) == false) {
                    _this.buildOpenClazzTrArray(vClazzResults);
                }

                if(WebServiceUtil.isEmpty(braceletSportSteps)==false){
                    _this.buildStepBarChart(braceletSportSteps);
                }

                _this.buildTodayOpenClazzJson(todayOpenClazzResults,currentMonthOpenClazzResults);

                _this.buildHotPlaceScatterChart();

                _this.setState({messageCount});
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    /**
     * 构建蚁巢统计数据的柱形图数据
     */
    buildTopicBarOption = (xClazzName, seriesData) => {
        return {
            title: {
                text: '蚁巢活跃度统计',
                subtext: '',
                left: 'left',
                textStyle:{
                    color:'#a6abb9',
                    fontSize: 16,
                    fontWeight: 'normal'
                }
            },
            xAxis: {
                type: 'category',
                data: xClazzName
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: seriesData,
                type: 'bar',

                itemStyle: {
                    //通常情况下：
                    normal: {
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params) {
                            var colorList = ['#f00', '#ff0'];
                            if((params.dataIndex+1)%2 == 0){//为偶数的数据使用第一个颜色，其他使用第二个颜色
                                return colorList[0];//1,3,5,7
                            }else{
                                return colorList[1];//2,4,6,8
                            }

                        }
                    },
                }
            }]
        };
    }

    /**
     * 创建蚁巢柱状图
     */
    buildTopicBarChart=(topicResults)=>{
        var _this = this;
        var xClazzNameArray = [];
        var seriesDataArray = [];
        topicResults.forEach(function (topicResult) {
            var topicObj = JSON.parse(topicResult);
            var clazzName = topicObj.col_name;
            var totalTopic = topicObj.totalTopic;
            xClazzNameArray.push(clazzName);
            seriesDataArray.push(totalTopic);
        });
        var topicOption = _this.buildTopicBarOption(xClazzNameArray, seriesDataArray);
        var topicDiv = <div>
            <div style={{height: '300px'}} className="echarts_wrap">
                <ReactEcharts
                    option={topicOption}
                    style={{height: '100%', width: '100%'}}
                    className=''/>
            </div>
        </div>;
        _this.setState({topicDiv});
    }

    /**
     * 构建蚁盘统计数据的柱形图数据
     */
    buildCloudFileBarOption = (xClazzName, seriesData) => {
        return {
            xAxis: {
                type: 'category',
                data: xClazzName
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: seriesData,
                type: 'bar'
            }]
        };
    }

    /**
     * 构建蚁盘统计数据的柱形图数据
     */
    buildCloudFilePieOption = (xClazzName, seriesData) => {
        return {
            title : {
                text: '蚁盘资源上传情况分布',
                subtext: '',
                x:'center',
                textStyle:{
                    color:'#a6abb9',
                    fontSize: 16,
                    fontWeight: 'normal'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:xClazzName
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'面积模式',
                    type:'pie',
                    radius : [30, 110],
                    center : ['75%', '50%'],
                    roseType : 'area',
                    data:seriesData
                }
            ]
        };
    }

    /**
     * 创建蚁盘资源上传情况统计柱状图
     */
    buildCloudFileBarChart=(cloudFileResults)=>{
        var _this = this;
        var xTeacherNameArray = [];
        var seriesDataArray = [];
        cloudFileResults.forEach(function (cloudFileResult) {
            var cloudFileObj = JSON.parse(cloudFileResult);
            var teacherName = cloudFileObj.col_name;
            var fileCount = cloudFileObj.fileCount;
            var cloudFileJson = {value:fileCount, name:teacherName};
            xTeacherNameArray.push(teacherName);
            // seriesDataArray.push(fileCount);
            seriesDataArray.push(cloudFileJson);
        });
        // var cloudFileOption = _this.buildCloudFileBarOption(xTeacherNameArray, seriesDataArray);
        var cloudFileOption = _this.buildCloudFilePieOption(xTeacherNameArray, seriesDataArray);
        var cloudFileDiv = <div>
            <div style={{height: '300px'}} className="echarts_wrap">
                <ReactEcharts
                    option={cloudFileOption}
                    style={{height: '100%', width: '100%'}}
                    className=''/>
            </div>
        </div>;
        _this.setState({cloudFileDiv});
    }

    buildHomeWorkOption=(xClazzNameArray, seriesDataArray)=>{
        return {
            title: {
                text: '班级作业布置情况分析',
                subtext: '',
                left: 'left',
                textStyle:{
                    color:'#a6abb9',
                    fontSize: 16,
                    fontWeight: 'normal'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                bottom: 10,
                left: 'center',
                data: xClazzNameArray
            },
            series : [
                {
                    type: 'pie',
                    radius : '65%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data:seriesDataArray,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    /**
     * 创建蚁盘资源上传情况统计柱状图
     */
    buildHomeWorkPieChart=(topicHomeWorkResults)=>{
        var _this = this;
        var xClazzNameArray = [];
        var seriesDataArray = [];
        topicHomeWorkResults.forEach(function (topicHomeWorkResult) {
            var topicHomeWorkObj = JSON.parse(topicHomeWorkResult);
            var clazzName = topicHomeWorkObj.col_name;
            var totalTopic = topicHomeWorkObj.totalTopic;
            var homeWorkJson = {value:totalTopic, name: clazzName};
            xClazzNameArray.push(clazzName);
            seriesDataArray.push(homeWorkJson);
        })
        var homeWorkOption = _this.buildHomeWorkOption(xClazzNameArray,seriesDataArray)
        var homeWorkDiv = <div>
            <div style={{height: '300px'}} className="echarts_wrap">
                <ReactEcharts
                    option={homeWorkOption}
                    style={{height: '100%', width: '100%'}}
                    className=''/>
            </div>
        </div>;
        _this.setState({homeWorkDiv});
    }

    buildTopicHomeWorkTrArray=(topicHomeWorkResults)=>{
        var trArray = [];
        topicHomeWorkResults.forEach(function (topicHomeWorkResult) {
            var topicHomeWorkObj = JSON.parse(topicHomeWorkResult);
            var clazzName = topicHomeWorkObj.col_name;
            var totalTopic = topicHomeWorkObj.totalTopic;
            var trObj = <tr>
                <td>{clazzName}</td>
                <td>{totalTopic}</td>
            </tr>;
            trArray.push(trObj);
        });
        this.setState({trArray});
    }

    buildOpenClazzTrArray=(vClazzResults)=>{
        var openClazzTrArray = [];
        vClazzResults.forEach(function (vClazzResult) {
            var vClazzObj = JSON.parse(vClazzResult);
            var col_vid = vClazzObj.col_vid;
            var col_cid = vClazzObj.col_cid;
            var col_teacher_uid = vClazzObj.col_teacher_uid;
            var col_start_time = WebServiceUtil.formatAllTime(vClazzObj.col_start_time);
            var clazzType = vClazzObj.clazzType;
            var clazzName = vClazzObj.clazzName;
            var teacherName = vClazzObj.teacherName;
            var courseId = vClazzObj.courseId;
            var courseName = vClazzObj.courseName;
            var trObj = <tr>
                <td>{courseName}</td>
                <td>{clazzName}</td>
                <td>{teacherName}</td>
                <td>{col_start_time}</td>
            </tr>;
            openClazzTrArray.push(trObj);
        });
        this.setState({openClazzTrArray});
    }

    buildTodayOpenClazzJson(todayOpenClazzResults,currentMonthOpenClazzResults){
        var todayOpenClazzJson = {
            "ie": 9743
        };

        var monthOpenClazzJson = {};

        var todayJson = {};
        if(WebServiceUtil.isEmpty(todayOpenClazzResults)==false){
            todayOpenClazzResults.forEach(function (todayOpenClazzResult) {
                var todayOpenClazzObj = JSON.parse(todayOpenClazzResult);
                var openCount = todayOpenClazzObj.openCount;
                var teacherName = todayOpenClazzObj.teacherName;
                todayJson[teacherName] = openCount;
            });
        }

        if(WebServiceUtil.isEmpty(currentMonthOpenClazzResults)==false){
            currentMonthOpenClazzResults.forEach(function (currentMonthOpenClazzResult) {
                var currentMonthOpenClazzObj = JSON.parse(currentMonthOpenClazzResult);
                var openCount = currentMonthOpenClazzObj.openCount;
                var teacherName = currentMonthOpenClazzObj.teacherName;
                monthOpenClazzJson[teacherName] = openCount;
            });
        }

        todayOpenClazzJson.components = todayJson;
        this.buildOpenClazzBarAndPie(todayOpenClazzJson,monthOpenClazzJson);
    }

    buildOpenClazzBarAndPie=(todayOpenClazzJson,monthOpenClazzJson)=>{
        var _this = this;
        var openClazzOption = _this.buildClazzOpenCountOption(todayOpenClazzJson,monthOpenClazzJson)
        var openClazzDiv = <div>
            <div style={{height: '300px'}} className="echarts_wrap">
                <ReactEcharts
                    option={openClazzOption}
                    style={{height: '100%', width: '100%'}}
                    className=''/>
            </div>
        </div>;
        _this.setState({openClazzDiv});
    }

    buildClazzOpenCountOption=(todayOpenClazzJson,monthOpenClazzJson)=>{
        return {
            tooltip: {},
            title: [{
                text: '今日开课次数统计',
                subtext: '',
                x: '25%',
                textAlign: 'center',
                textStyle:{
                    color:'#a6abb9',
                    fontSize: 16,
                    fontWeight: 'normal'
                }
            }, {
                text: '本月开课次数统计',
                subtext: '',
                x: '75%',
                textAlign: 'center',
                textStyle:{
                    color:'#a6abb9',
                    fontSize: 16,
                    fontWeight: 'normal'
                }
            }],
            grid: [{
                top: 50,
                width: '50%',
                bottom: '45%',
                left: 10,
                containLabel: true
            }, {
                top: 50,
                width: '50%',
                bottom: '45%',
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                },

            }],
            yAxis: [{
                type: 'category',
                data: Object.keys(todayOpenClazzJson.components),
                axisLabel: {
                    interval: 0,
                    rotate: 30
                },
                splitLine: {
                    show: false
                }
            }],
            series: [ {
                type: 'bar',
                stack: 'component',
                xAxisIndex: 0,
                yAxisIndex: 0,
                z: 3,
                label: {
                    normal: {
                        position: 'right',
                        show: true,
                    }
                },
                data: Object.keys(todayOpenClazzJson.components).map(function (key) {
                    return todayOpenClazzJson.components[key];
                })
            }, {
                type: 'pie',
                radius: [0, '30%'],
                center: ['75%', '30%'],
                data: Object.keys(monthOpenClazzJson).map(function (key) {
                    return {
                        name: key.replace('.js', ''),
                        value: monthOpenClazzJson[key]
                    }
                })
            }]
        };
    }

    buildStepBarChart=(braceletSportSteps)=>{
        var _this = this;

        var xClazzNameArray = [];
        var seriesDataArray = [];
        braceletSportSteps.forEach(function (braceletSportStepObj) {
            var clazzName = braceletSportStepObj.clazz.name;
            var sportStep = braceletSportStepObj.sportStep;
            xClazzNameArray.push(clazzName);
            seriesDataArray.push(sportStep);
        });
        var stepOption = _this.buildStepOption(xClazzNameArray, seriesDataArray)
        var stepChartDiv = <div>
            <div style={{height: '300px'}} className="echarts_wrap">
                <ReactEcharts
                    option={stepOption}
                    style={{height: '100%', width: '100%'}}
                    className=''/>
            </div>
        </div>;
        _this.setState({stepChartDiv});
    }

    /**
     * 创建步数统计柱形图的option
     */
    buildStepOption=(xClazzNameArray, seriesDataArray)=>{
        return {
            title : {
                text: '班级步数统计',
                subtext: ''
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['步数']
            },
            toolbox: {
                show : true,
                feature : {
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : xClazzNameArray
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'步数',
                    type:'bar',
                    data:seriesDataArray,
                    markLine : {
                        data : [
                            {type : 'average', name : '平均值'}
                        ]
                    }
                }
            ]
        };
    }

    onChartClick = (index, optional) => {
        var arr = this.state.subjectDivContentArray;
        var analysisUrl = WebServiceUtil.mobileServiceURL + "brotherXu?clazzId=" + this.state.clazzId + "&pushTime=" + this.state.pushTime + "&stuId=" + arr[index].stuJsonArray[optional.dataIndex].stuId;

        var data = {
            method: 'openNewPage',
            url: analysisUrl,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = analysisUrl;
        });
    };

    buildHotPlaceScatterChart=()=>{
        var _this = this;

        /*var xClazzNameArray = [];
        var seriesDataArray = [];
        braceletSportSteps.forEach(function (braceletSportStepObj) {
            var clazzName = braceletSportStepObj.clazz.name;
            var sportStep = braceletSportStepObj.sportStep;
            xClazzNameArray.push(clazzName);
            seriesDataArray.push(sportStep);
        });*/
        var hotPlaceScatterOption = _this.buildHotPlaceScatterOption();
        var hotPlaceScatterChartDiv = <div>
            <div style={{height: '300px'}} className="echarts_wrap">
                <ReactEcharts
                    option={hotPlaceScatterOption}
                    style={{height: '100%', width: '100%'}}
                    className=''/>
            </div>
        </div>;
        _this.setState({hotPlaceScatterChartDiv});
    }

    /**
     * 创建学生活动的热点图
     */
    buildHotPlaceScatterOption=()=>{
       return  {
           backgroundColor: '#404a59',
           color: [
               '#dd4444', '#fec42c', '#80F1BE'
           ],
           legend: {
               y: 'top',
               data: ['学生活动热点'],
               textStyle: {
                   color: '#fff',
                   fontSize: 16
               }
           },
           grid: {
               x: '10%',
               x2: 150,
               y: '18%',
               y2: '10%'
           },
           tooltip: {
               padding: 10,
               backgroundColor: '#222',
               borderColor: '#777',
               borderWidth: 1,
               formatter: function (obj) {
                   var value = obj.value;
                   return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                       + obj.seriesName + ' ' + value[0] + '日：'
                       + value[7]
                       + '</div>'
                       + schema[0].text + '：' + value[1] + '<br>';
               }
           },
           xAxis: {
               type: 'value',
               name: '日期',
               nameGap: 16,
               nameTextStyle: {
                   color: '#fff',
                   fontSize: 14
               },
               max: 31,
               splitLine: {
                   show: false
               },
               axisLine: {
                   lineStyle: {
                       color: '#eee'
                   }
               }
           },
           yAxis: {
               type: 'value',
               name: '活动区域',
               nameLocation: 'end',
               nameGap: 20,
               nameTextStyle: {
                   color: '#fff',
                   fontSize: 16
               },
               axisLine: {
                   lineStyle: {
                       color: '#eee'
                   }
               },
               splitLine: {
                   show: false
               }
           },
           series: [
               {
                   name: '广州',
                   type: 'scatter',
                   itemStyle: itemStyle,
                   data: dataGZ
               }
           ]
       };
    }

    render() {
        var _this = this;
        return (
            <div id="dashboard">
                <div className="cont">
                    <div className="topTitle">
                        <div>学校名称：{_this.state.schoolName}</div>
                        <div>总人数：{_this.state.userCount}人</div>
                        <div>24小时消息收发数量：{_this.state.messageCount}条</div>
                    </div>
                    <div className="list_wrap_padding topList">
                        <div>当前开课列表</div>
                        <div className="tableDiv">
                            <table>
                                <thead>
                                <tr>
                                    <td>课程名</td>
                                    <td>班级</td>
                                    <td>授课老师</td>
                                    <td>开课时间</td>
                                </tr>
                                </thead>
                                <tbody>
                                {_this.state.openClazzTrArray}
                                </tbody>
                            </table>
                        </div>
                        {/*{this.state.divContentArray}*/}
                    </div>

                    <div className="list_wrap_padding">
                        {this.state.openClazzDiv}
                    </div>

                    <div className="list_wrap_padding">
                        {this.state.homeWorkDiv}
                    </div>

                    {/*<div className="list_wrap_padding">
                        {this.state.hotPlaceScatterChartDiv}
                    </div>*/}

                    <div className="list_wrap_padding">
                        {this.state.topicDiv}
                    </div>

                    <div className="list_wrap_padding resource">
                        {this.state.cloudFileDiv}
                    </div>

                    <div className="list_wrap_padding">
                        {this.state.stepChartDiv}
                    </div>
                </div>
            </div>
        );
    }

}
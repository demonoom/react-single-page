import React from 'react';
import ReactEcharts from 'echarts-for-react';
import {
    Toast,
    NoticeBar
} from 'antd-mobile';
import CanvasMap from './canvasMap/canvasMap'
import './css/dashboard.less';
import "./css/chalk2";
import "./css/walden";

var dataGZ = [
    [1, 26],
    [2, 85],
    [3, 78],
    [4, 21],
    [5, 41],
    [6, 56],
    [7, 64],
    [8, 55],
    [9, 76],
    [10, 91],
    [11, 84],
    [12, 64],
    [13, 70],
    [14, 77],
    [15, 109],
    [16, 73],
    [17, 54],
    [18, 51],
    [19, 91],
    [20, 73],
    [21, 73],
    [22, 84],
    [23, 93],
    [24, 99],
    [25, 146],
    [26, 113],
    [27, 81],
    [28, 56],
    [29, 82],
    [30, 106],
    [31, 118]
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

//班级柱状图option
var optionForClassColumn = {
    title: {
        text: '学生考勤统计',
        subtext: '',
        left: 'left',
    },
    tooltip: {},
    legend: {
        data: ['人数'],
        y:'bottom',
        x:'left'
    },
    xAxis: {
        data: ['应到', '实到', '缺勤']
    },
    yAxis: {},
    series: [{
        name: '人数',
        type: 'bar',
        data: [80, 50, 30],
        itemStyle: {
            //通常情况下：
            normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (params) {
                    var colorList = ['#00a8ff', '#00fdd8'];
                    if ((params.dataIndex + 1) % 2 == 0) {//为偶数的数据使用第一个颜色，其他使用第二个颜色
                        return colorList[0];//1,3,5,7
                    } else {
                        return colorList[1];//2,4,6,8
                    }

                }
            },
        },
        label: {
            normal: {
                show: true,
                position: 'top',
            }
        }
    }]
}

//全校饼图考勤option
var optionForSchoolPie = {
    title: {
        text: '学校考勤统计',
        subtext: '应到人数 : ' + (867 + 2756) + '人',
        left: 'left',
    },
    tooltip: {},
    legend: {
        bottom: 0,
        left: 'left',
        data: ['实到', '缺勤']
    },
    series: [
        {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [{value: 2756, name: '实到'}, {value: 867, name: '缺勤'}],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                normal: {
                    formatter: '{d}%',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 12
                    }
                }
            }
        }
    ]
}

//老师饼图考勤option
var optionForTeacherPie = {
    title: {
        text: '教师考勤统计',
        subtext: '',
        left: 'left',
    },
    tooltip: {},
    legend: {
        bottom: 0,
        left: 'left',
        data: ['正常', '迟到', '早退', '缺勤']
    },
    series: [
        {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [{value: 120, name: '正常'}, {value: 11, name: '迟到'}, {value: 3, name: '早退'}, {value: 9, name: '缺勤'}],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                normal: {
                    formatter: '{d}%',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 12
                    }
                }
            }
        }
    ]
}

export default class dashboard extends React.Component {

    constructor(props) {
        super(props);
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.state = {
            openClazzTrArray: ''
        };
        this.getDashBoardDataByArea = this.getDashBoardDataByArea.bind(this);
    }

    componentDidMount() {
        var _this = this;
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
        setInterval(function () {
            //调取驾驶舱数据
            _this.getDashBoardDataByArea(destId, areaType);
        }, 1000 * 2)
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
                //学校总人数
                var userCountOfSchool = jsonObj.userCountOfSchool;
                //全校教研活动量
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
                //体育运动量统计
                var braceletHeartRate = jsonObj.braceletHeartRate;

                //蚁巢班级数量
                if (WebServiceUtil.isEmpty(userCountOfSchool) == false) {
                    var userCountJson = JSON.parse(userCountOfSchool);
                    var userCount = userCountJson.userCount;
                    var schoolName = userCountJson.schoolName;
                    _this.setState({userCount, schoolName});
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

                if (WebServiceUtil.isEmpty(braceletSportSteps) == false) {
                    _this.buildStepBarChart(braceletSportSteps);
                }

                //体育运动量
                if (WebServiceUtil.isEmpty(braceletHeartRate) == false) {
                    _this.buildSportsChart(braceletHeartRate);
                }else{
                    // classHeartRateArray.push(sportData[k].braceletHeartRate.heartRate);
                    // classNameArray.push(sportData[k].courseTableItem.clazz.name + sportData[k].courseTableItem.courseName+'课')
                    let data = [
                        {
                            braceletHeartRate:{
                                heartRate:120,
                            },
                            courseTableItem:{
                                clazz:{
                                    name:'测试班'
                                },
                                courseName:'语文'
                            }
                        },
                        {
                            braceletHeartRate:{
                                heartRate:110,
                            },
                            courseTableItem:{
                                clazz:{
                                    name:'测试班'
                                },
                                courseName:'体育'
                            }
                        },
                        {
                            braceletHeartRate:{
                                heartRate:130,
                            },
                            courseTableItem:{
                                clazz:{
                                    name:'测试班'
                                },
                                courseName:'英语'
                            }
                        }
                    ]
                    _this.buildSportsChart(data);
                }

                _this.buildTodayOpenClazzJson(todayOpenClazzResults, currentMonthOpenClazzResults);

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
                text: '课前探究性学习统计',
                subtext: '',
                left: 'left',
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
                            var colorList = ['#00a8ff', '#00fdd8'];
                            if ((params.dataIndex + 1) % 2 == 0) {//为偶数的数据使用第一个颜色，其他使用第二个颜色
                                return colorList[0];//1,3,5,7
                            } else {
                                return colorList[1];//2,4,6,8
                            }

                        }
                    },
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                    }
                }
            }]
        };
    }

    /**
     * 课前探究性学习
     */
    buildTopicBarChart = (topicResults) => {
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
            <div style={{height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={topicOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
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
                type: 'bar',
                itemStyle: {
                    //通常情况下：
                    normal: {
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params) {
                            var colorList = ['#00a8ff', '#00fdd8'];
                            if ((params.dataIndex + 1) % 2 == 0) {//为偶数的数据使用第一个颜色，其他使用第二个颜色
                                return colorList[0];//1,3,5,7
                            } else {
                                return colorList[1];//2,4,6,8
                            }

                        }
                    },
                }
            }]
        };
    }

    /**
     * 构建蚁盘统计数据的柱形图数据
     */
    buildCloudFilePieOption = (xClazzName, seriesData) => {
        return {
            title: {
                text: '学习资源分布情况统计',
                subtext: '',
                x: 'left',
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            legend: {
                x: 'left',
                y: 'bottom',
                data: xClazzName
            },
            /*toolbox: {
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
            },*/
            calculable: true,
            series: [
                {
                    name: '面积模式',
                    type: 'pie',
                    radius: [5, 70],
                    center: ['50%', '45%'],
                    roseType: 'area',
                    data: seriesData,
                    label: {
                        normal: {
                            formatter: '{b}:{c}: ({d}%)',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 12
                            }
                        }
                    }
                }
            ]
        };
    }

    /**
     * 创建学习资源分布情况统计
     */
    buildCloudFileBarChart = (cloudFileResults) => {
        var _this = this;
        var xTeacherNameArray = [];
        var seriesDataArray = [];
        cloudFileResults.forEach(function (cloudFileResult) {
            var cloudFileObj = JSON.parse(cloudFileResult);
            var teacherName = cloudFileObj.col_name;
            var fileCount = cloudFileObj.fileCount;
            var cloudFileJson = {value: fileCount, name: teacherName};
            xTeacherNameArray.push(teacherName);
            // seriesDataArray.push(fileCount);
            seriesDataArray.push(cloudFileJson);
        });
        // var cloudFileOption = _this.buildCloudFileBarOption(xTeacherNameArray, seriesDataArray);
        var cloudFileOption = _this.buildCloudFilePieOption(xTeacherNameArray, seriesDataArray);
        var cloudFileDiv = <div>
            <div style={{height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={cloudFileOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
                    className=''/>
            </div>
        </div>;
        _this.setState({cloudFileDiv});
    }

    buildHomeWorkOption = (xClazzNameArray, seriesDataArray) => {
        return {
            title: {
                text: '课后作业布置情况分析',
                subtext: '',
                left: 'left',
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                bottom: '0',
                left: 'left',
                data: xClazzNameArray
            },
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: seriesDataArray,
                    itemStyle: {

                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{b}:{c}次: ({d}%)',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 12
                            }
                        }
                    }
                }
            ]
        };
    }

    /**
     * 创建蚁盘资源上传情况统计柱状图
     */
    buildHomeWorkPieChart = (topicHomeWorkResults) => {
        var _this = this;
        var xClazzNameArray = [];
        var seriesDataArray = [];
        topicHomeWorkResults.forEach(function (topicHomeWorkResult) {
            var topicHomeWorkObj = JSON.parse(topicHomeWorkResult);
            var clazzName = topicHomeWorkObj.col_name;
            var totalTopic = topicHomeWorkObj.totalTopic;
            var homeWorkJson = {value: totalTopic, name: clazzName};
            xClazzNameArray.push(clazzName);
            seriesDataArray.push(homeWorkJson);
        })
        var homeWorkOption = _this.buildHomeWorkOption(xClazzNameArray, seriesDataArray);
        var homeWorkDiv = <div>
            <div style={{height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={homeWorkOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
                />
            </div>
        </div>;
        _this.setState({homeWorkDiv});
    }

    buildTopicHomeWorkTrArray = (topicHomeWorkResults) => {
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

    buildOpenClazzTrArray = (vClazzResults) => {
        var openClazzTrArray = '';
        vClazzResults.forEach(function (vClazzResult) {
            var vClazzObj = JSON.parse(vClazzResult);
            openClazzTrArray += vClazzObj.clazz.name + ' ' + vClazzObj.course.name + ' ' + vClazzObj.teacher.userName
        });
        this.setState({openClazzTrArray});
    }

    buildTodayOpenClazzJson(todayOpenClazzResults, currentMonthOpenClazzResults) {
        var todayOpenClazzJson = {
            "ie": 9743
        };

        var monthOpenClazzJson = {};

        var todayJson = {};
        if (WebServiceUtil.isEmpty(todayOpenClazzResults) == false) {
            todayOpenClazzResults.forEach(function (todayOpenClazzResult) {
                var todayOpenClazzObj = JSON.parse(todayOpenClazzResult);
                var openCount = todayOpenClazzObj.openCount;
                var teacherName = todayOpenClazzObj.teacherName;
                todayJson[teacherName] = openCount;
            });
        }

        if (WebServiceUtil.isEmpty(currentMonthOpenClazzResults) == false) {
            currentMonthOpenClazzResults.forEach(function (currentMonthOpenClazzResult) {
                var currentMonthOpenClazzObj = JSON.parse(currentMonthOpenClazzResult);
                var openCount = currentMonthOpenClazzObj.openCount;
                var teacherName = currentMonthOpenClazzObj.teacherName;
                monthOpenClazzJson[teacherName] = openCount;
            });
        }

        todayOpenClazzJson.components = todayJson;
        this.buildOpenClazzBarAndPie(todayOpenClazzJson, monthOpenClazzJson);
    }

    /**
     * 开课次数统计的柱形图和饼图
     * @param todayOpenClazzJson
     * @param monthOpenClazzJson
     */
    buildOpenClazzBarAndPie = (todayOpenClazzJson, monthOpenClazzJson) => {
        var _this = this;
        var openClazzOption = _this.buildClazzOpenCountOption(todayOpenClazzJson, monthOpenClazzJson)
        var openClazzDiv = <div>
            <div style={{height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={openClazzOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
                    className=''/>
            </div>
        </div>;
        _this.setState({openClazzDiv});
    }

    buildClazzOpenCountOption = (todayOpenClazzJson, monthOpenClazzJson) => {
        return {
            tooltip: {},
            title: [{
                text: '今日开课次数统计',
                subtext: '',
                x: 'left',
                textAlign: 'left',
            }, {
                text: '本月开课次数统计',
                subtext: '',
                x: 'left',
                y: '56%',
                textAlign: 'left',
            }],
            grid: [{
                top: 50,
                width: '100%',
                bottom: '45%',
                left: 0,
                containLabel: true
            }, {

                width: '100%',
                left: 10,
                bottom: 0,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#a6abb9',
                    }
                }

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
                },
                axisLine: {
                    lineStyle: {
                        color: '#a6abb9',
                    }
                }
            }],
            series: [{
                type: 'bar',
                stack: 'component',
                xAxisIndex: 0,
                yAxisIndex: 0,
                z: 3,
                itemStyle: {
                    //通常情况下：
                    normal: {
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params) {
                            var colorList = ['#00a8ff', '#00fdd8'];
                            if ((params.dataIndex + 1) % 2 == 0) {//为偶数的数据使用第一个颜色，其他使用第二个颜色
                                return colorList[0];//1,3,5,7
                            } else {
                                return colorList[1];//2,4,6,8
                            }

                        }
                    },
                },
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
                radius: [0, '20%'],
                center: ['50%', '82%'],
                data: Object.keys(monthOpenClazzJson).map(function (key) {
                    return {
                        name: key.replace('.js', ''),
                        value: monthOpenClazzJson[key],
                        label: {
                            normal: {
                                formatter: '{b}:{c}: ({d}%)',
                                textStyle: {
                                    fontWeight: 'normal',
                                    fontSize: 12
                                }
                            }
                        }
                    }
                })
            }]
        };
    }

    /**
     * 健康情况统计
     * @param braceletSportSteps
     */
    buildStepBarChart = (braceletSportSteps) => {
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
            <div style={{width: '100%', height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={stepOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
                    className=''/>
            </div>
        </div>;
        _this.setState({stepChartDiv});
    }

    /**
     * 创建步数统计柱形图的option
     */
    buildStepOption = (xClazzNameArray, seriesDataArray) => {
        return {
            title: {
                text: '健康情况统计',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['步数'],
                bottom: 0,
                left: 'left',
            },
            /*toolbox: {
                show : true,
                feature : {
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },*/
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    data: xClazzNameArray
                }
            ],
            yAxis: [
                {
                    type: 'value',
                }
            ],
            series: [
                {
                    name: '步数',
                    type: 'bar',
                    data: seriesDataArray,
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    },
                    itemStyle: {
                        //通常情况下：
                        normal: {
                            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                            color: function (params) {
                                var colorList = ['#00a8ff', '#00fdd8'];
                                if ((params.dataIndex + 1) % 2 == 0) {//为偶数的数据使用第一个颜色，其他使用第二个颜色
                                    return colorList[0];//1,3,5,7
                                } else {
                                    return colorList[1];//2,4,6,8
                                }

                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                        }
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

    buildHotPlaceScatterChart = () => {
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
            <div style={{height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={hotPlaceScatterOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'/>
            </div>
        </div>;
        _this.setState({hotPlaceScatterChartDiv});
    }

    /**
     * 创建学生活动的热点图
     */
    buildHotPlaceScatterOption = () => {
        return {
            backgroundColor: '#404a59',
            color: [
                '#dd4444', '#fec42c', '#80F1BE'
            ],
            legend: {
                y: 'top',
                data: ['学生活动热点'],

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


    //创建体育运动统计图
    buildSportsChart(sportData) {
        var _this = this;
        var classNameArray = [];
        var classHeartRateArray = [];
        for (var k in sportData) {
            classHeartRateArray.push(sportData[k].braceletHeartRate.heartRate);
            classNameArray.push(sportData[k].courseTableItem.clazz.name + sportData[k].courseTableItem.courseName + '课')
        }
        var sportOption = _this.buildSportsOption(classNameArray, classHeartRateArray)
        var sportDiv = <div>
            <div style={{height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={sportOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
                    className=''/>
            </div>
        </div>;
        _this.setState({sportDiv});
    }

    /**
     * 创建体育运动量options
     */
    buildSportsOption = (classNameArray, classPeopleArray) => {
        return {
            title: {
                text: '体育运动量统计',
                subtext: '',
                left: 'left',
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['平均心率'],
                y:'bottom',
                x:'left'
            },
            xAxis: {
                data: classNameArray
            },
            yAxis: {},
            series: [{
                name: '平均心率',
                type: 'bar',
                data: classPeopleArray,
                itemStyle: {
                    //通常情况下：
                    normal: {
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params) {
                            var colorList = ['#00a8ff', '#00fdd8'];
                            if ((params.dataIndex + 1) % 2 == 0) {//为偶数的数据使用第一个颜色，其他使用第二个颜色
                                return colorList[0];//1,3,5,7
                            } else {
                                return colorList[1];//2,4,6,8
                            }

                        }
                    },
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                    }
                }
            }]
        };
    }

    render() {
        var _this = this;
        return (
            <div id="dashboard">
                <div className="dashCont">
                    <div className="topTitle">
                        <div className="schoolName">{_this.state.schoolName}</div>
                        <div className="notice">
                            <NoticeBar marqueeProps={{loop: true, style: {padding: '0 7.5px'}}}>
                                {'正在开课:' + this.state.openClazzTrArray}
                            </NoticeBar>
                        </div>
                    </div>
                    <div className="cont">
                        <div className="clear">
                            <div className="fl left">
                                {/*课前探究性学习*/}
                                <div className="list_wrap_padding">
                                    {this.state.topicDiv}
                                </div>
                                {/*//学习资源分布统计*/}
                                <div className="list_wrap_padding">
                                    {this.state.cloudFileDiv}
                                </div>
                            </div>
                            <div className="center fl">
                                <div className="list_wrap_padding map">
                                    <div className="clear numDiv">
                                        <div className="fl allNUm">
                                            <p className="gradeTitle">总人数</p>
                                            <p className="num">{_this.state.userCount}</p>
                                        </div>
                                        <div className="fl msgNum">
                                            <p className="gradeTitle">全校教研活动量</p>
                                            <p className="num">{_this.state.messageCount}</p>
                                        </div>
                                    </div>
                                    {/*热力图*/}
                                    <CanvasMap/>
                                </div>
                            </div>
                            <div className="fl right">
                                <div className="list_wrap_padding">
                                    {this.state.homeWorkDiv}
                                </div>
                                <div className="list_wrap_padding">
                                    {this.state.openClazzDiv}
                                </div>
                            </div>

                        </div>

                        <div className="flex_div bottom">

                            <div className="list_wrap_padding">
                                {this.state.stepChartDiv}
                            </div>

                            {/*//体育运动统计*/}
                            <div className="list_wrap_padding">
                                {this.state.sportDiv}
                            </div>
                            {/*学生考勤班级柱状图*/}
                            <div className="list_wrap_padding">
                                <div style={{height: '270px'}} className="echarts_wrap">
                                    <ReactEcharts
                                        option={optionForClassColumn}
                                        style={{height: '100%', width: '100%'}}
                                        theme='chalk2'
                                        className=''/>
                                </div>
                            </div>

                            {/*全校考勤饼图*/}
                            {/*<div className="list_wrap_padding">
                                <div style={{height: '270px'}} className="echarts_wrap">
                                    <ReactEcharts
                                        option={optionForSchoolPie}
                                        style={{height: '100%', width: '100%'}}
                                        theme='chalk2'
                                        className=''/>
                                </div>
                            </div>*/}

                            {/*教师考勤饼图*/}
                            <div className="list_wrap_padding">
                                <div style={{height: '270px'}} className="echarts_wrap">
                                    <ReactEcharts
                                        option={optionForTeacherPie}
                                        style={{height: '100%', width: '100%'}}
                                        theme='chalk2'
                                        className=''/>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
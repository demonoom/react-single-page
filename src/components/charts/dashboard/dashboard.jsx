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
        document.title = '小蚂蚁智慧校园大数据管理驾驶舱';
        Bridge.setShareAble("false");
        Bridge.setRefreshAble("false");
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var destId = searchArray[0].split('=')[1];
        var areaType = searchArray[1].split('=')[1];
        this.setState({destId, areaType});
        localStorage.setItem("destId", destId);
        // this.viewTeacherPunchStatistics(destId);
        //调取驾驶舱数据
        this.getDashBoardDataByArea(destId, areaType);
        setInterval(function () {
            //调取驾驶舱数据
            _this.getDashBoardDataByArea(destId, areaType);
        }, 1000 * 2)
    }

    viewTeacherPunchStatistics(destId, areaType) {
        var _this = this;
        var param;
        param = {
            "method": 'viewTeacherPunchStatistics',
            "schId": destId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                var response = result.response;
                _this.buildTeacherAttendancePieChart(response);
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
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
                // var topicHomeWorkResults = jsonObj.topicHomeWorkResult;
                var homeWorkSubjectResults = jsonObj.homeWorkSubjectResults;
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
                //教务审批统计数据
                var proceCountResults = jsonObj.proceCountResults;
                //老师考勤数据
                var teacherAttendance = jsonObj.teacherAttendance;
                //学生考勤数据
                var studAttendance = jsonObj.studAttendance;

                //蚁巢班级数量
                if (WebServiceUtil.isEmpty(userCountOfSchool) == false) {
                    var userCountJson = JSON.parse(userCountOfSchool);
                    var userCount = userCountJson.userCount;
                    var schoolName = userCountJson.schoolName;
                    _this.setState({userCount, schoolName});
                }
                //蚁巢班级数量
                if (WebServiceUtil.isEmpty(topicResults) == false && topicResults.length >= 30) {
                    _this.buildTopicBarChart(topicResults.splice(0, 10));
                } else {
                    _this.buildTopicBarChart(topicResults);
                }
                //老师蚁盘资源上传情况
                if (WebServiceUtil.isEmpty(cloudFileResults) == false && cloudFileResults.length >= 30) {
                    _this.buildCloudFileBarChart(cloudFileResults.splice(0, 10));
                } else {
                    _this.buildCloudFileBarChart(cloudFileResults);
                }

                //班级课后作业的布置情况统计，统计每个班发布的题目数量
                if (WebServiceUtil.isEmpty(homeWorkSubjectResults) == false && homeWorkSubjectResults.length >= 30) {
                    _this.buildHomeWorkPieChart(homeWorkSubjectResults.splice(0, 10));
                } else {
                    _this.buildHomeWorkPieChart(homeWorkSubjectResults);
                }

                _this.buildOpenClazzTrArray(vClazzResults);

                _this.buildStepBarChart(braceletSportSteps);

                //体育运动量
                _this.buildSportsChart(braceletHeartRate);

                _this.buildFlowPieChart(proceCountResults);

                _this.buildStudentAttendancePieChart(studAttendance);
                // _this.buildStudentAttendanceMultiPieChart(studAttendance);

                _this.buildTeacherAttendancePieChart(teacherAttendance);

                // _this.buildTodayOpenClazzJson(todayOpenClazzResults, currentMonthOpenClazzResults);

                // _this.buildHotPlaceScatterChart();

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
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: xClazzName,
                padding: [5, 10],
                axisLabel: {
                    //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                    rotate: 30,
                    //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                    interval: 0
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '学习次数',
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
            var clazzName = topicObj.clazz.grade.name + '' + topicObj.col_name;
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
                    name: '资源数量',
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
            var teacherObj = cloudFileObj.teacher;
            var courseName = "";
            var teacherName = cloudFileObj.col_name;
            if (WebServiceUtil.isEmpty(teacherObj) == false && WebServiceUtil.isEmpty(teacherObj.course) == false) {
                var courseObj = teacherObj.course;
                courseName = courseObj.name;
                teacherName += "(" + courseName + ")";
            }
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
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['作业题目数量'],
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
                    data: xClazzNameArray,
                    axisLabel: {
                        //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                        rotate: 30,
                        //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                        interval: 0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                }
            ],
            series: [
                {
                    name: '作业题目数量',
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

    /**
     * 创建蚁盘资源上传情况统计柱状图
     */
    buildHomeWorkPieChart = (homeWorkSubjectResults) => {
        var _this = this;
        var xClazzNameArray = [];
        var seriesDataArray = [];
        if (WebServiceUtil.isEmpty(homeWorkSubjectResults) == false) {
            homeWorkSubjectResults.forEach(function (homeWorkSubjectResult) {
                var homeWorkSubjectObj = JSON.parse(homeWorkSubjectResult);
                var clazzName = homeWorkSubjectObj.clazzName;
                var subjectCount = homeWorkSubjectObj.subjectCount;
                // var homeWorkJson = {value: subjectCount, name: clazzName};
                xClazzNameArray.push(clazzName);
                // seriesDataArray.push(subjectCount);
                // var subjectCount = Math.ceil(Math.random()*10)+20;
                seriesDataArray.push(subjectCount);
            })
        }
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

    /**
     * 创建正在开课的跑马灯数据
     * @param vClazzResults
     */
    buildOpenClazzTrArray = (vClazzResults) => {
        var openClazzTrArray = []
        vClazzResults.forEach(function (vClazzResult) {
            var vClazzObj = JSON.parse(vClazzResult);
            openClazzTrArray.push(<span style={{marginRight: '30px'}}>
                {vClazzObj.clazz.name + ' ' + vClazzObj.course.name + ' ' + vClazzObj.teacher.userName}
            </span>)
        });
        this.setState({openClazzTrArray});
    }

    /*buildTodayOpenClazzJson(todayOpenClazzResults, currentMonthOpenClazzResults) {
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
        // this.buildOpenClazzBarAndPie(todayOpenClazzJson, monthOpenClazzJson.splice(0, 10));

        this.buildOpenClazzBarAndPie(todayOpenClazzJson, monthOpenClazzJson);
    }*/

    /**
     * 开课次数统计的柱形图和饼图
     * @param todayOpenClazzJson
     * @param monthOpenClazzJson
     */
    /*buildOpenClazzBarAndPie = (todayOpenClazzJson, monthOpenClazzJson) => {
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
    }*/

    /*buildClazzOpenCountOption = (todayOpenClazzJson, monthOpenClazzJson) => {
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
                top: 40,
                width: '100%',
                bottom: '48%',
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
                height: '45%',
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
    }*/

    /**
     * 健康情况统计
     * @param braceletSportSteps
     */
    buildStepBarChart = (braceletSportSteps) => {
        var _this = this;

        var xClazzNameArray = [];
        var seriesDataArray = [];
        braceletSportSteps.forEach(function (braceletSportStepObj) {
            var clazzName = braceletSportStepObj.clazz.grade.name + '' + braceletSportStepObj.clazz.name;
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
                    data: xClazzNameArray,
                    axisLabel: {
                        //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                        rotate: 25,
                        //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                        interval: 0
                    }
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

    /**
     * 气泡图demo
     */
    /*buildHotPlaceScatterChart = () => {
        var _this = this;

        /!*var xClazzNameArray = [];
        var seriesDataArray = [];
        braceletSportSteps.forEach(function (braceletSportStepObj) {
            var clazzName = braceletSportStepObj.clazz.name;
            var sportStep = braceletSportStepObj.sportStep;
            xClazzNameArray.push(clazzName);
            seriesDataArray.push(sportStep);
        });*!/
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
    }*/

    /**
     * 创建学生活动的热点图
     */
    /*buildHotPlaceScatterOption = () => {
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
    }*/


    //创建体育运动统计图
    buildSportsChart(sportData) {
        var _this = this;
        var classNameArray = [];
        var classHeartRateArray = [];
        for (var k in sportData) {
            classHeartRateArray.push(sportData[k].braceletHeartRate.heartRate);
            classNameArray.push(sportData[k].courseTableItem.clazz.grade.name + '' + sportData[k].courseTableItem.clazz.name + sportData[k].courseTableItem.courseName + '课')
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
                y: 'bottom',
                x: 'left'
            },
            xAxis: {
                data: classNameArray,
                axisLabel: {
                    //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                    rotate: 30,
                    //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                    interval: 0
                }
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

    /**
     * 教务审批统计
     * @param
     */
    buildFlowPieChart = (proceCountResults) => {
        var _this = this;
        var xFlowNameArray = [];
        var ySeriesDataArray = [];
        if (WebServiceUtil.isEmpty(proceCountResults) == false) {
            proceCountResults.forEach(function (proceCountObj) {
                var procDefName = proceCountObj.procDefName;
                var procCount = proceCountObj.procCount;
                var seriesJson = {value: procCount, name: procDefName};
                xFlowNameArray.push(procDefName);
                ySeriesDataArray.push(seriesJson);
            });
        }
        var flowOption = _this.buildFlowOption(xFlowNameArray, ySeriesDataArray)
        var flowPieChartDiv = <div>
            <div style={{width: '100%', height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={flowOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
                    className=''/>
            </div>
        </div>;
        _this.setState({flowPieChartDiv});
    }

    /**
     * 教务审批统计option
     * @param xFlowNameArray
     * @param ySeriesDataArray
     * @returns {{title: {text: string, subtext: string, left: string}, tooltip: {}, legend: {bottom: number, left: string, data: *}, series: [null]}}
     */
    buildFlowOption = (xFlowNameArray, ySeriesDataArray) => {
        return {
            title: {
                text: '教务审批统计',
                subtext: '',
                left: 'left',
            },
            tooltip: {},
            legend: {
                bottom: 0,
                left: 'left',
                data: xFlowNameArray
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: ySeriesDataArray,
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
        }
    }

    /**
     * 老师考勤统计
     * @param
     */
    buildTeacherAttendancePieChart = (attendanceResults) => {
        var _this = this;
        var xAttendanceNameArray = [];
        var ySeriesDataArray = [];
        if (WebServiceUtil.isEmpty(attendanceResults) == false) {
            var absent = attendanceResults["absent"];
            var early = attendanceResults["early"];
            var late = attendanceResults["late"];
            var miss = attendanceResults["miss"];
            var missPeople = attendanceResults["missPeople"];
            var sum = attendanceResults["sum"];
            var normal = attendanceResults["normal"];
            var othersData = 0;
            if (WebServiceUtil.isEmpty(absent) == false) {
                xAttendanceNameArray.push("旷工");
                var absentJson = {value: absent, name: '旷工'};
                ySeriesDataArray.push(absentJson);
                // othersData += parseInt(absent);
            }
            if (WebServiceUtil.isEmpty(early) == false) {
                xAttendanceNameArray.push("早退");
                var earlyJson = {value: early, name: '早退'};
                ySeriesDataArray.push(earlyJson);
                othersData += parseInt(early);
            }
            if (WebServiceUtil.isEmpty(late) == false) {
                xAttendanceNameArray.push("迟到");
                var lateJson = {value: late, name: '迟到'};
                ySeriesDataArray.push(lateJson);
                othersData += parseInt(late);
            }
            if (WebServiceUtil.isEmpty(miss) == false) {
                /* xAttendanceNameArray.push("缺勤");
                 var missPerson = parseInt(parseInt(miss)/2);
                 var missJson = {value: missPerson, name: '缺勤'};
                 ySeriesDataArray.push(missJson);*/
                othersData += parseInt(miss);
            }
            if (WebServiceUtil.isEmpty(missPeople) == false) {
                xAttendanceNameArray.push("缺卡");
                var missPeopleJson = {value: missPeople, name: '缺卡'};
                ySeriesDataArray.push(missPeopleJson);
            }
            if (WebServiceUtil.isEmpty(normal) == false) {
                // var normal = parseInt(sum) - parseInt(othersData);
                xAttendanceNameArray.push("正常");
                var normalJson = {value: normal, name: '正常'};
                ySeriesDataArray.push(normalJson);
            }

        }
        var attendanceOption = _this.buildTeacherAttendanceOption(xAttendanceNameArray, ySeriesDataArray)
        var attendancePieChartDiv = <div>
            <div style={{width: '100%', height: '270px'}} className="echarts_wrap">
                <ReactEcharts
                    option={attendanceOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
                    className=''/>
            </div>
        </div>;
        _this.setState({attendancePieChartDiv});
    }

    /**
     * 构建老师考勤报表的Option结构
     * @param xFlowNameArray
     * @param ySeriesDataArray
     * @returns {{title: {text: string, subtext: string, left: string}, tooltip: {}, legend: {bottom: number, left: string, data: *}, series: [null]}}
     */
    buildTeacherAttendanceOption = (xAttendanceNameArray, ySeriesDataArray) => {
        return {
            title: {
                text: '教师考勤统计',
                subtext: '',
                left: 'left',
            },
            tooltip: {},
            legend: {
                bottom: 0,
                left: 'left',
                data: xAttendanceNameArray
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: ySeriesDataArray,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            formatter: '{b}:{c}人: ({d}%)',
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
     * 学生考勤统计
     * @param
     */
    buildStudentAttendancePieChart = (attendanceResults) => {
        var _this = this;
        var xAttendanceNameArray = [];
        var ySeriesDataArray = [];
        var totalTipArray = [];
        if (WebServiceUtil.isEmpty(attendanceResults) == false) {
            for (var gradeName in attendanceResults) {
                var valueJson = attendanceResults[gradeName];
                var absentCount = valueJson.absentCount;
                var punchCount = valueJson.punchCount;
                var totalCount = valueJson.totalCount;
                if (WebServiceUtil.isEmpty(absentCount) == false) {
                    var gradeTip = gradeName + "缺勤";
                    xAttendanceNameArray.push(gradeTip);
                    var absentJson = {value: absentCount, name: gradeTip};
                    ySeriesDataArray.push(absentJson);
                }
                if (WebServiceUtil.isEmpty(punchCount) == false) {
                    var gradeTip = gradeName + "实到";
                    xAttendanceNameArray.push(gradeTip);
                    var punchCountJson = {value: punchCount, name: gradeTip};
                    ySeriesDataArray.push(punchCountJson);
                }
                if (WebServiceUtil.isEmpty(totalCount) == false) {
                    totalTipArray.push(<span
                        style={{marginRight: '8px', color: '#e4e4e4', fontSize: '12px', lineHeight: '26px'}}>{gradeName}应到:{totalCount}人</span>);
                }
                /*if (WebServiceUtil.isEmpty(totalCount) == false) {
                    var gradeTip = gradeName+"应到";
                    xAttendanceNameArray.push(gradeTip);
                    var totalCountJson = {value: totalCount, name: gradeTip};
                    ySeriesDataArray.push(totalCountJson);
                }*/
            }
        }
        var attendanceOption = _this.buildStudentAttendanceOption(xAttendanceNameArray, ySeriesDataArray)
        var studentAttendancePieChartDiv = <div style={{position: 'relative'}}>
            <div style={{fontSize: '16px', fontWeight: 'bold'}}>学生考勤统计</div>
            <div style={{width: '100%', height: '252px'}} className="echarts_wrap">
                <div style={{width: '100%', maxHeight: '40px', paddingTop: '12px'}}>{totalTipArray}</div>
                <div style={{width: '100%', height: '200px'}}>
                    <ReactEcharts
                        option={attendanceOption}
                        style={{height: '100%', width: '100%'}}
                        theme='chalk2'
                        className=''/>
                </div>
            </div>
        </div>;
        _this.setState({studentAttendancePieChartDiv});
    }

    /**
     * 构建学生考勤报表的Option结构
     * @param xFlowNameArray
     * @param ySeriesDataArray
     * @returns {{title: {text: string, subtext: string, left: string}, tooltip: {}, legend: {bottom: number, left: string, data: *}, series: [null]}}
     */
    buildStudentAttendanceOption = (xAttendanceNameArray, ySeriesDataArray) => {
        return {
            title: {
                // text: '学生考勤统计',
                subtext: '',
                left: 'left',
            },
            tooltip: {},
            legend: {
                bottom: 0,
                left: 'left',
                data: xAttendanceNameArray
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: ySeriesDataArray,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    /*label: {
                        normal: {
                            formatter: '{d}%',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: 12
                            }
                        }
                    }*/
                    label: {
                        normal: {
                            formatter: '{b}:{c}人: ({d}%)',
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
     * 构建学生考勤的嵌套饼图
     * @param
     */
    buildStudentAttendanceMultiPieChart = (attendanceResults) => {
        var _this = this;
        var attendanceData = [];
        if (WebServiceUtil.isEmpty(attendanceResults) == false) {
            for (var gradeName in attendanceResults) {
                var valueJson = attendanceResults[gradeName];
                var absentCount = valueJson.absentCount;
                var punchCount = valueJson.punchCount;
                // var totalCount = valueJson.totalCount;
                var attendanceJson = {
                    name: gradeName,
                    itemStyle: {
                        color: '#da0d68'
                    },
                    children: [{
                        name: '实到',
                        value: punchCount,
                        itemStyle: {
                            color: '#e0719c'
                        }
                    }, {
                        name: '缺勤',
                        value: absentCount,
                        itemStyle: {
                            color: '#e0a18c'
                        }
                    }]
                };
                attendanceData.push(attendanceJson);
            }
        }
        var attendanceOption = _this.buildStudentAttendanceMultiPieOption(attendanceData);
        var studentAttendancePieChartDiv = <div>
            <div style={{width: '100%', height: '310px'}} className="echarts_wrap">
                <ReactEcharts
                    option={attendanceOption}
                    style={{height: '100%', width: '100%'}}
                    theme='chalk2'
                    className=''/>
            </div>
        </div>;
        _this.setState({studentAttendancePieChartDiv});
    }


    /**
     * 以嵌套饼图的形式构建学生的考勤
     */
    buildStudentAttendanceMultiPieOption(attendanceData) {
        return {
            title: {
                text: '学生考勤统计',
                textStyle: {
                    fontSize: 14,
                    align: 'center'
                },
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c}",
            },
            series: {
                type: 'sunburst',
                highlightPolicy: 'ancestor',
                data: attendanceData,
                radius: [0, '100%'],
                sort: null,
                levels: [{}, {
                    r0: '15%',
                    r: '35%',
                    itemStyle: {
                        borderWidth: 2
                    },
                    label: {
                        rotate: 'tangential'
                    }
                }, {
                    r0: '35%',
                    r: '70%',
                    label: {
                        align: 'right'
                    }
                }, {
                    r0: '70%',
                    r: '72%',
                    label: {
                        position: 'outside',
                        padding: 3,
                        silent: false
                    },
                    itemStyle: {
                        borderWidth: 3
                    }
                }],
                label: {            //饼图图形上的文本标签
                    normal: {
                        show: true,
                        position: 'inner', //标签的位置
                        textStyle: {
                            fontWeight: 300,
                            fontSize: 12    //文字的字体大小
                        },
                        formatter: '{b}{c}人'


                    }
                }
            }
        };
    }

    dangerStrCallBack = (str) => {
        this.setState({dangerStr: str})
    }

    render() {
        var _this = this;
        return (
            <div id="dashboard">
                <div className="dashCont">
                    <div className="bodyIcon">
                        <img className="icon_topLeft" src={require("./image/bodyIcon.gif")}/>
                        <img className="icon_topRight" src={require("./image/bodyIcon.gif")}/>
                    </div>
                    <div className="topTitle clear">

                        <div className="notice fl">
                            <NoticeBar marqueeProps={{loop: true, style: {padding: '0 7.5px'}}}>
                                正在开课:{this.state.openClazzTrArray}
                            </NoticeBar>
                        </div>
                        <div className="schoolName textOver fl">{_this.state.schoolName}{/*西安市第九十九中学*/}</div>
                        <div className="notice fl">
                            <NoticeBar marqueeProps={{loop: true, style: {padding: '0 7.5px'}}}>
                                {this.state.dangerStr}
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
                                        <div className="fl msgNum">
                                            <p className="gradeTitle">全校教研活动量:<span
                                                className="num">{_this.state.messageCount}</span></p>
                                        </div>
                                    </div>
                                    {/*热力图*/}
                                    <CanvasMap
                                        dangerStrCallBack={this.dangerStrCallBack}
                                    />
                                </div>
                            </div>
                            <div className="fl right">
                                <div className="list_wrap_padding">
                                    {this.state.homeWorkDiv}
                                </div>

                                {/*学生考勤班级柱状图*/}
                                <div className="list_wrap_padding">
                                    {/*<div style={{height: '270px'}} className="echarts_wrap">
                                        <ReactEcharts
                                            option={optionForClassColumn}
                                            style={{height: '100%', width: '100%'}}
                                            theme='chalk2'
                                            className=''/>
                                    </div>*/}
                                    {this.state.studentAttendancePieChartDiv}
                                </div>
                            </div>

                        </div>

                        <div className="flex_div bottom">

                            <div className="list_wrap_padding">
                                {this.state.stepChartDiv}
                            </div>

                            <div className="list_wrap_padding">
                                {/*{this.state.openClazzDiv}*/}
                                {this.state.flowPieChartDiv}
                            </div>


                            {/*//体育运动统计*/}
                            <div className="list_wrap_padding">
                                {this.state.sportDiv}
                            </div>

                            {/*教师考勤饼图*/}
                            <div className="list_wrap_padding">
                                {/*<div style={{height: '270px'}} className="echarts_wrap">
                                    <ReactEcharts
                                        option={optionForTeacherPie}
                                        style={{height: '100%', width: '100%'}}
                                        theme='chalk2'
                                        className=''/>
                                </div>*/}
                                {this.state.attendancePieChartDiv}
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


                        </div>
                    </div>
                    <div className="bodyIcon">
                        <img className="icon_bottomLeft" src={require("./image/bodyIcon.gif")}/>
                        <img className="icon_bottomRight" src={require("./image/bodyIcon.gif")}/>
                    </div>

                </div>
            </div>
        );
    }

}
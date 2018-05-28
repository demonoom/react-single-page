import React from 'react';
import {Toast} from 'antd-mobile';
import '../../css/homePage/header.less'

var demeanor;
var timeOffset;
var now;
var timer;

/*
     设置日期的方法，针对年月日星期的显示
    */
function setTodayDate(today) {
    var months, dates, weeks, intYears, intMonths, intDates, intWeeks, today, timeString;

    intMonths = today.getMonth() + 1;//获得月份+1
    intDates = today.getDate();//获得天数
    intWeeks = today.getDay();//获得星期

    if (intMonths < 10) {
        months = '0' + intMonths + '月';
    } else {
        months = intMonths + '月';
    }

    if (intDates < 10) {
        dates = '0' + intDates + '日     ';
    } else {
        dates = intDates + '日     ';
    }

    var weekArray = new Array(7);
    weekArray[0] = '星期日';
    weekArray[1] = '星期一';
    weekArray[2] = '星期二';
    weekArray[3] = '星期三';
    weekArray[4] = '星期四';
    weekArray[5] = '星期五';
    weekArray[6] = '星期六';
    weeks = weekArray[intWeeks] + ' ';

    timeString = months + dates + weeks;

    return timeString;
}

/*
 设置北京时间的方法，针对时分秒的显示
*/
function set(time) {
    timeOffset = ((-1 * (new Date()).getTimezoneOffset()) - (8 * 60)) * 60000;
    now = new Date(time - timeOffset);
    return p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds())
}

/*
  格式化时间的显示方式
*/
function p(s) {
    return s < 10 ? '0' + s : s;
}

export default class header extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            weatherArr: [],
            timeHeader: '',
            timeFoot: '',
            abcode: '',
            classroomName: '',
        };
    }

    componentWillMount() {
        this.makeTime();
        this.viewClassRoom();
        var data = {
            method: 'getAbCode',
        };

        /**
         * 从客户端获取abcode用于请求天气
         * 客户端没有传abcode将按照西安天气展示
         */
        Bridge.callHandler(data, function (res) {
            demeanor.weatherInfo(res)
            demeanor.setState({abcode: res})
        }, function (error) {
            Toast.fail('地点获取失败', 5);
            demeanor.weatherInfo(610113);
            demeanor.setState({abcode: 610113})
        });
    }

    componentDidUpdate() {
        //每天刷新天气两次
        if (this.state.timeFoot == '00:10:00' || this.state.timeFoot == '12:10:00') {
            demeanor.weatherInfo(demeanor.state.abcode)
        }
        if (this.state.timeFoot == '00:10:00') {
            var date = new Date();
            demeanor.setState({timeHeader: setTodayDate(date)});
        }
    }

    componentWillUnmount() {
        clearInterval(timer)
    }

    viewClassRoom() {
        var param = {
            "method": 'viewClassRoom',
            "id": localStorage.getItem('roomId'),
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        demeanor.setState({classroomName: result.response.defaultBindedClazz.name})
                    }
                }
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 制作电子表
     */
    makeTime() {
        var date = new Date(),
            time = date.getTime();
        timer = setInterval(function () {
            demeanor.setState({timeFoot: set(time)})
            time = Number(time);
            time += 1000;
        }, 1000);
        demeanor.setState({timeHeader: setTodayDate(date)})
    }

    /**
     * 获取未来天气
     * 一天调用两次
     * @param adcode
     */
    weatherInfo(adcode) {
        $.get('http://restapi.amap.com/v3/weather/weatherInfo?key=fce57f3f5ed99a1b7925992439e5a224&city=' + adcode + '&extensions=all', function (res) {
            demeanor.setState({weatherArr: res.forecasts[0].casts.splice(0, 2)})
        })
    }

    render() {
        return (
            <div id="header">
                <div className="headTitle"><span className="headTitleT text_hidden">{this.state.classroomName}</span>
                </div>
                <div className="header_date float_ri">
                    <div className="weatherColor2 space_high4">{this.state.timeFoot}</div>
                    <div>{this.state.timeHeader}</div>
                </div>
                <div className="header_weather float_ri">
                    {
                        this.state.weatherArr.map(function (v, i) {
                            if (i == 0) {
                                // 阴  晴  多云  雨   雷阵雨 雪
                                var img = ''
                                if (v.dayweather.indexOf('阴') != -1) {
                                    img = <img src={require('../../img/Overcast_icon.png')} alt=""/>
                                } else if (v.dayweather.indexOf('晴') != -1) {
                                    img = <img src={require('../../img/sunny_icon.png')} alt=""/>
                                } else if (v.dayweather.indexOf('多云') != -1) {
                                    img = <img src={require('../../img/Cloudy_icon.png')} alt=""/>
                                } else if (v.dayweather.indexOf('雷') != -1) {
                                    img = <img src={require('../../img/Thundershower_icon.png')} alt=""/>
                                } else if (v.dayweather.indexOf('雨') != -1) {
                                    img = <img src={require('../../img/rain_icon.png')} alt=""/>
                                } else if (v.dayweather.indexOf('雪') != -1) {
                                    img = <img src={require('../../img/snow_icon.png')} alt=""/>
                                }
                                return <span className="header_date3">
                                    <div>{img}</div>
                                    <div>
                                        <div className="weatherColor1 space_high">{v.dayweather}</div>
                                        <div>{v.nighttemp + '℃~' + v.daytemp + '℃'}</div>
                                    </div>
                                </span>
                            } else if (i == 1) {
                                return <span className="header_date2">
                                    <div className="space_high2">明天</div>
                                    <div className="space_high3">{v.dayweather}</div>
                                    <div>{v.nighttemp + '℃~' + v.daytemp + '℃'}</div>
                                </span>
                            }
                        })
                    }
                </div>

            </div>
        );
    }
}

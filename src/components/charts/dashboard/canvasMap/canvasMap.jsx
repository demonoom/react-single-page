import React from 'react';
import {} from 'antd-mobile';
import './css/canvasMap.less'

var demeanor;
var canvas;
var context;
var timer;

export default class canvasMap extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {
        var width_cont = $(window).width();
        var canvasWidth = (width_cont - 25) / 2;
        canvas = document.getElementById('noom');
        context = canvas.getContext('2d');
        canvas.width = canvasWidth;
        canvas.height = 550;
        context.lineWidth = 10;
        context.lineCap = 'round';
        //查看学校绑定的所有地图
        this.getSchoolMapBySchoolId()
    }

    componentWillUnmount() {
        clearInterval(timer)
    }

    /**
     * 查看学校绑定的所有地图
     */
    getSchoolMapBySchoolId() {
        var _this = this;
        var param = {
            "method": 'getSchoolMapBySchoolId',
            "schId": localStorage.getItem('destId'),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    var sectionStyle = {
                        backgroundSize: "100% 100%",
                        backgroundImage: `url(${result.response.path})`
                    };
                    _this.setState({sectionStyle});
                    //查看当前时间的教室人数热点图
                    demeanor.viewRoomHeapmap()
                    timer = setInterval(function () {
                        demeanor.viewRoomHeapmap()
                    }, 10000)
                }
            },
            onError: function (error) {

            }
        });
    }

    /**
     * 查看当前时间的教室人数热点图
     */
    viewRoomHeapmap() {
        var param = {
            // "method": 'viewRoomHeapmap',
            "method": 'getBraceletStudentLocationBySchoolId',
            // "schId": localStorage.getItem('destId'),
            "schoolId": localStorage.getItem('destId'),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    //数据打点
                    demeanor.drawPoint(result.response)
                }
            },
            onError: function (error) {

            }
        });
    }

    /**
     * 数据打点
     */
    drawPoint(data) {
        //清除画布
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (WebServiceUtil.isEmpty(data) == false) {
            console.log(data);
            data.forEach(function (v, i) {
                for (var i = 0; i < v.count; i++) {

                    var numX = Math.random() * 10 * Math.pow(-1, Math.round(Math.random()));
                    var numY = Math.random() * 10 * Math.pow(-1, Math.round(Math.random()));

                    context.beginPath()
                    if (v.count < 20) {
                        context.strokeStyle = '#0000ff';
                    } else if (v.count > 50) {
                        context.strokeStyle = '#c00000';
                    } else {
                        context.strokeStyle = '#fffc00';
                    }
                    context.lineTo(canvas.width * v.location.x + numX, canvas.height * v.location.y + numY);
                    context.stroke();
                }
            })
        }
    }

    render() {
        return (
            <div id="canvasMap">
                <canvas
                    id="noom" style={this.state.sectionStyle}
                />
            </div>
        );
    }
}

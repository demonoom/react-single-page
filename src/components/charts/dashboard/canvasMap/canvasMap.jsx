import React from 'react';
import {} from 'antd-mobile';
import Background from '../image/schoolMap.png';
import './css/canvasMap.less'

var demeanor;
var canvas;
var context;

var sectionStyle = {
    backgroundSize: "100% 100%",
// makesure here is String确保这里是一个字符串，以下是es6写法
    backgroundImage: `url(${Background})`
};

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
        setInterval(function () {
            demeanor.viewRoomHeapmap()
        }, 1000)
        this.getSchoolMapBySchoolId()
    }

    componentDidUpdate() {
        document.getElementById("noom").addEventListener('click', demeanor.simulateClick);
    }

    simulateClick(e) {
        console.log(e.offsetX);
        console.log(e.offsetY);
        alert(e.offsetX+'-'+e.offsetY)
    }

    /**
     * 查看学校绑定的所有地图
     */
    getSchoolMapBySchoolId() {
        var param = {
            "method": 'getSchoolMapBySchoolId',
            "schId": localStorage.getItem('destId'),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result);
                if (result.msg == '调用成功' || result.success == true) {
                    // demeanor.drawPoint(result.response)
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
            "method": 'viewRoomHeapmap',
            "schId": localStorage.getItem('destId'),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
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
                    context.strokeStyle = 'black';
                    context.lineTo(canvas.width * v.location.x + numX, canvas.height * v.location.y + numY);
                    context.stroke();
                }
            })
        }
    }
    
    render() {
        return (
            <div id="canvasMap" style={sectionStyle}>
                <canvas id="noom"></canvas>
            </div>
        );
    }
}

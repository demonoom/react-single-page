import React from 'react';
import {} from 'antd-mobile';
import './css/canvasMap.less'

var demeanor;
var canvas;
var context;

export default class canvasMap extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        var width_cont = $(window).width();
        var canvasWidth = (width_cont - 25) / 2;
        canvas = document.getElementById('noom');
        context = canvas.getContext('2d');
        canvas.width = 620;
        canvas.height = 580;
        context.lineWidth = 10;
        context.lineCap = 'round';
        // demeanor.drawPoint()
        this.startStep()
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
     * 开始步数
     */
    startStep() {
        setInterval(function () {
            var width_cont = $(window).width();
            var canvasWidth = (width_cont - 25) / 2;
            canvas = document.getElementById('noom');
            context = canvas.getContext('2d');
            canvas.width = 620;
            canvas.height = 550;
            context.lineWidth = 10;
            context.lineCap = 'round';
            context.restore()
            // demeanor.drawPoint()
        }, 10000)
    }

    /**
     * 模拟打点
     */
    drawPoint() {
        var x = Math.random() * canvas.width - 8;
        var y = Math.random() * canvas.height - 8;

        var a = Math.random() * canvas.width - 8;
        var b = Math.random() * canvas.height - 8;

        context.beginPath()
        context.strokeStyle = 'red';
        context.lineTo(x, y);
        context.stroke();

        context.beginPath()
        context.strokeStyle = 'black';
        context.lineTo(a, b);
        context.stroke();

        context.beginPath()
        context.strokeStyle = 'yellow';
        context.lineTo(211, 206);
        context.stroke();
    }
    
    render() {
        return (
            <div id="canvasMap">
                <canvas id="noom"></canvas>
            </div>
        );
    }
}

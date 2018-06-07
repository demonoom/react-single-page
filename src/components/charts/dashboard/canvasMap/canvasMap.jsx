import React from 'react';
import {} from 'antd-mobile';
import Img from '../img/map.png'

var demeanor;
var canvas;
var context;
var step = 5;

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
        this.startStep()
    }

    /**
     * 开始步数
     */
    startStep() {
        setInterval(function () {
            var width_cont = $(window).width();
            var canvasWidth = (width_cont-25)/2;
            step += 5;
            canvas = document.getElementById('noom');
            context = canvas.getContext('2d');
            var img = new Image();
            canvas.width = canvasWidth;
            canvas.height = 550;
            context.lineWidth = 10;
            context.lineCap = 'round';
            img.src = Img;
            img.onload = function () {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                demeanor.drawPoint(step)
            }
        }, 2000)
    }

    /**
     * 模拟打点
     */
    drawPoint(step) {
        var x = Math.random() * 700;
        var y = Math.random() * 400;

        var a = Math.random() * 700;
        var b = Math.random() * 400;

        context.beginPath()
        context.strokeStyle = 'red';
        context.lineTo(x, y);
        context.stroke();

        context.beginPath()
        context.strokeStyle = 'black';
        context.lineTo(a, b);
        context.stroke();
    }

    canvasOnClick() {

    }

    render() {
        return (
            <div id="canvasMap">
                <canvas id="noom" onClick={this.canvasOnClick}></canvas>
            </div>
        );
    }
}

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
            step += 5;
            canvas = document.getElementById('noom');
            context = canvas.getContext('2d');
            var img = new Image();
            canvas.width = 720
            canvas.height = 400
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
        context.beginPath()
        context.strokeStyle = 'red';
        context.lineTo(100, 100 + step);
        context.stroke();

        context.beginPath()
        context.strokeStyle = 'black';
        context.lineTo(345 + step, 356);
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

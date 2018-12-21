import React from 'react';
import {} from 'antd-mobile';
import './css/baiduMap.less'

var demeanor;
var canvas;
var map = null;
var heatmapOverlay = null;
export default class baiduMap extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            points:[]
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        console.log("aaaaaaaaaaaaaaaaaaaaaa");
        //heatmapOverlay.show();
        map = new BMap.Map("container");          // 创建地图实例
        console.log("222"+map);
        /*
        var point = new BMap.Point(111.276691, 30.697428);
        map.centerAndZoom(point, 15);             // 初始化地图，设置中心点坐标和地图级别
        map.enableScrollWheelZoom(); // 允许滚轮缩放
        console.log("map=====>"+map);
        this.getPoints();*/
    }

    /**
     * 获取地图坐标点人数数据（用来构建热力图）
     */
    /*getPoints=()=>{
        var points =[
            {"lng":111.276691,"lat":30.697428,"count":1000},
            {"lng":111.276681,"lat":30.697439,"count":500},
            {"lng":111.276781,"lat":30.697528,"count":300},
            {"lng":111.346212,"lat":30.758511,"count":1300},
            {"lng":111.294118,"lat":30.704039,"count":2500}
        ];
        this.setState({points});
        this.buildHeatMap(points);
    }*/

    /*buildHeatMap=(points)=>{
        if(!this.isSupportCanvas()){
            alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
        }
        //详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
        //参数说明如下:
        /!* visible 热力图是否显示,默认为true
         * opacity 热力的透明度,1-100
         * radius 势力图的每个点的半径大小
         * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
         *	{
                .2:'rgb(0, 255, 255)',
                .5:'rgb(0, 110, 255)',
                .8:'rgb(100, 0, 255)'
            }
            其中 key 表示插值的位置, 0~1.
                value 为颜色值.
         *!/
        heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
        map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data:points,max:100});
    }*/

    //判断浏览区是否支持canvas
    /*isSupportCanvas=()=>{
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }*/



    render() {
        return (
            <div id="baiduMap">
                <div id="container">11111111</div>
            </div>
        );
    }
}

webpackJsonp([155],{1324:function(e,t){},328:function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function a(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),o=window.location.href.indexOf("?")+1,n=window.location.href.substr(o,window.location.href.length-1),a=n.match(t);return null!=a?unescape(a[2]):null}Object.defineProperty(t,"__esModule",{value:!0});var r=o(41),u=n(r),i=o(42),l=n(i),c=o(43),d=n(c),s=o(44),p=n(s),f=o(7),v=n(f);o(1324);var m,h=function(e){function t(e){(0,u.default)(this,t);var o=(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));m=o,o.state={sourceObj:[]};var n=document.createElement("script");n.type="text/javascript",n.src="hls-noom-master/video.js",$("body").append(n);var a=document.createElement("script");return a.type="text/javascript",a.src="hls-noom-master/videojs-contrib-hls.js",$("body").append(a),o}return(0,p.default)(t,e),(0,l.default)(t,[{key:"componentWillMount",value:function(){var e=a("path");document.title="小蚂蚁直播",this.buildSourceObj(e)}},{key:"componentDidMount",value:function(){var e={sourceOrder:!0,controls:!0,autoplay:!0,preload:"auto",techOrder:["html5","flash"]},t=videojs("playVideoBox",{options:e},function(){t.play(),t.on("ended",function(){})})}},{key:"buildSourceObj",value:function(e){var t=this,o=v.default.createElement("source",{src:e,type:""});-1!=e.indexOf("m3u8")&&(o=v.default.createElement("source",{src:e,type:"application/x-mpegURL"}));var n=v.default.createElement("video",{id:"playVideoBox",controls:!0,className:"video-js vjs-default-skin vjs-big-play-centered",preload:"auto",width:"640",height:"600"},o);t.setState({videoObj:n})}},{key:"render",value:function(){return v.default.createElement("div",{id:"m3u8Player"},this.state.videoObj)}}]),t}(v.default.Component);t.default=h}});
webpackJsonp([143],{368:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(41),i=n(r),o=a(42),u=n(o),p=a(43),c=n(p),l=a(44),d=n(l),f=a(7),s=n(f),m=void 0,v=function(e){function t(e){(0,i.default)(this,t);var a=(0,c.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));a.state={};var n=document.createElement("script");n.type="text/javascript",n.src="//webapi.amap.com/maps?v=1.4.6&key=fce57f3f5ed99a1b7925992439e5a224",$("body").append(n);var r=document.createElement("script");return r.type="text/javascript",r.src="//webapi.amap.com/ui/1.0/main.js?v=1.0.11",$("body").append(r),a}return(0,d.default)(t,e),(0,u.default)(t,[{key:"componentWillMount",value:function(){}},{key:"componentDidMount",value:function(){m=new AMap.Map("container",{zoom:4}),AMapUI.load(["ui/misc/PathSimplifier","lib/$"],function(e,t){if(!e.supportCanvas)return void alert("当前环境不支持 Canvas！");var a=new e({zIndex:100,map:m,getPath:function(e,t){return e.path},getHoverTitle:function(e,t,a){return a>=0?e.name+"，点："+a+"/"+e.path.length:e.name+"，点数量"+e.path.length},renderOptions:{renderAllPointsIfNumberBelow:100}});window.pathSimplifierIns=a,a.setData([{name:"路线0",path:[[116.405289,39.904987],[113.964458,40.54664],[111.47836,41.135964],[108.949297,41.670904],[106.380111,42.149509],[103.774185,42.56996],[101.135432,42.930601],[98.46826,43.229964],[95.777529,43.466798],[93.068486,43.64009],[90.34669,43.749086],[87.61792,43.793308],[116.405289,39.904987]]}]),a.createPathNavigator(0,{loop:!0,speed:1e6}).start()})}},{key:"render",value:function(){return s.default.createElement("div",{id:"particlePath"},s.default.createElement("div",{id:"container"}))}}]),t}(s.default.Component);t.default=v}});
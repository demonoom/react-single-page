webpackJsonp([169],{469:function(e,t,l){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=l(41),u=a(n),i=l(42),r=a(i),o=l(43),s=a(o),c=l(44),d=a(c),f=l(7),p=a(f),m=function(e){function t(e){(0,u.default)(this,t);var l=(0,s.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return l.state={url:""},l}return(0,d.default)(t,e),(0,r.default)(t,[{key:"componentDidMount",value:function(){Bridge.setRefreshAble(!1);var e=decodeURI(window.location.href),t=e.substr(e.indexOf("?")+1),l=t.split("&"),a=l[0].split("=")[1],n=l[1].split("=")[1],u=(l[2].split("=")[1],l[3].split("=")[1]),i=(l[4].split("=")[1],"https://jiaoxue.maaee.com:9093/#/cloundSchoolDetail?vId="+a+"&userId="+n+"&type=3&name="+u+"&judgeFlag=''");this.setState({url:i})}},{key:"historyGoBack",value:function(){var e={method:"finish"};Bridge.callHandler(e,null,function(e){console.log(e)})}},{key:"render",value:function(){return p.default.createElement("div",{id:"classSortPage"},p.default.createElement("div",null,p.default.createElement("div",{className:"topTitle line_public"},p.default.createElement("span",{className:"icon_back",onClick:this.historyGoBack},"返回"),p.default.createElement("span",null,"查看回顾")),p.default.createElement("iframe",{className:"classFrame",src:this.state.url,frameborder:"0"})))}}]),t}(p.default.Component);t.default=m}});
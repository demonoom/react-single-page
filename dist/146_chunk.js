webpackJsonp([146],{381:function(e,t,o){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=o(41),i=n(a),c=o(42),s=n(c),p=o(43),u=n(p),r=o(44),l=n(r),d=o(7),f=n(d),h=function(e){function t(e){(0,i.default)(this,t);var o=(0,u.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return o.state={appId:"wx181574f3ea687daf",local:"http://jiaoxue.maaee.com:8091/#/",info:"###",jsp:"http://www.maaee.com/elearning/common/weChatLoginOpenId.jsp",scope:"snsapi_base"},o}return(0,l.default)(t,e),(0,s.default)(t,[{key:"componentDidMount",value:function(){var e=this,t=window.location.href,o=t.substr(t.indexOf("?")+1),n=o.split("&")[0].split("=")[1];this.setState({local:this.state.local+n},function(){window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+e.state.appId+"&redirect_uri="+encodeURIComponent(e.state.jsp)+"&response_type=code&scope="+e.state.scope+"&state="+encodeURIComponent(e.state.local)+"#wechat_redirect"})}},{key:"render",value:function(){return f.default.createElement("div",{id:"wxLogin"})}}]),t}(f.default.Component);t.default=h}});
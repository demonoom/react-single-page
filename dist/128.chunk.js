webpackJsonp([128],{1214:function(e,t){},314:function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var c=r(41),s=a(c),n=r(42),o=a(n),l=r(43),i=a(l),u=r(44),f=a(u),d=r(7),p=a(d);r(1214);var m=function(e){function t(e){(0,s.default)(this,t);var r=(0,i.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.state={content:""},r}return(0,f.default)(t,e),(0,o.default)(t,[{key:"componentDidMount",value:function(){Bridge.setRefreshAble(!1),Bridge.setShareAble(!1),document.title="文件预览";var e=JSON.parse(localStorage.getItem("previewFile"));if(0==WebServiceUtil.isEmpty(e))if(e.src=e.src.replace("60.205.86.217","www.maaee.com"),e.src=e.src.replace("60.205.111.227","www.maaee.com"),"1"==e.type||"31"==e.type){var t="http://www.maaee.com/Excoord_For_Education/js/pdfjs/web/viewer.html?file="+e.src,r=p.default.createElement("iframe",{className:"ppt_wrap",src:t,frameborder:"0"});this.setState({content:r})}else if("9"==e.type){var r=p.default.createElement("audio",{className:"mp3_wrap",src:e.src,controls:"controls"});this.setState({content:r})}else if("7"==e.type){var r=p.default.createElement("video",{className:"mp3_wrap",src:e.src,controls:"controls"});this.setState({content:r})}else{var t=e.src,r=p.default.createElement("iframe",{className:"ppt_wrap",src:t,frameborder:"0"});this.setState({content:r})}}},{key:"render",value:function(){return p.default.createElement("div",{id:"previewFile",style:{height:document.body.clientHeight}},this.state.content)}}]),t}(p.default.Component);t.default=m}});
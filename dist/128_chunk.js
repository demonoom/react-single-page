webpackJsonp([128],{1366:function(e,t,n){e.exports=n.p+"abed8fbd6ae5be0a56c83b0f28fe8e45.png"},1367:function(e,t,n){e.exports=n.p+"7c7bcd1a74d79cd87c309343fe97e688.png"},433:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=n(41),o=a(l),d=n(42),u=a(d),i=n(43),c=a(i),s=n(44),f=a(s),p=n(7),r=a(p),m=function(e){function t(e){(0,o.default)(this,t);var n=(0,c.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.downLoadFile=function(){"IOS"==n.state.phone?window.open("https://itunes.apple.com/cn/app/apple-store/id1268534857?mt=8"):window.open("http://60.205.86.217/upload7_app/2018-08-02/19/3c09e2df-fd58-4f81-8b5f-7deb38748000.apk")},n.state={phone:"IOS"},n}return(0,f.default)(t,e),(0,u.default)(t,[{key:"componentDidMount",value:function(){var e=navigator.userAgent;e.indexOf("iPhone")>-1||e.indexOf("iPad")>-1?this.setState({phone:"IOS"}):this.setState({phone:"Android"}),window.location.href.indexOf("/yunxiao")>-1&&(history.pushState(null,null,document.URL),window.addEventListener("popstate",function(){history.pushState(null,null,document.URL)}))}},{key:"render",value:function(){return r.default.createElement("div",{id:"fileDownload",className:"yunxiao"},r.default.createElement("div",{className:"topImg"},r.default.createElement("img",{src:n(1366),alt:""})),r.default.createElement("div",{className:"textCont"},r.default.createElement("div",null,"小蚂蚁云校"),r.default.createElement("span",null,"实景体验式学习，把世界装进课堂")),r.default.createElement("div",{className:this.state.phone+" downBtn",onClick:this.downLoadFile},r.default.createElement("span",null,"免费下载",this.state.phone,"版")),r.default.createElement("div",{className:"bottomImg"},r.default.createElement("img",{src:n(1367),alt:""})))}}]),t}(r.default.Component);t.default=m}});
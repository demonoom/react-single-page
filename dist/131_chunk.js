webpackJsonp([131],{1312:function(e,t){},387:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(41),i=n(l),o=a(42),r=n(o),s=a(43),u=n(s),d=a(44),c=n(d),f=a(7),m=n(f);a(1312);var v,h=function(e){function t(e){(0,i.default)(this,t);var a=(0,u.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return v=a,a.state={initData:[],htmlList:[]},a}return(0,c.default)(t,e),(0,r.default)(t,[{key:"componentDidMount",value:function(){document.title="题目列表";var e=window.location.href,t=e.substr(e.indexOf("?")+1),a=t.split("&"),n=a[0].split("=")[1],l=a[1].split("=")[1];this.setState({tId:n,stuId:l}),this.getHomeworkData(n,l)}},{key:"getHomeworkData",value:function(e,t){var a=this,n={method:"viewFuzzyHomework",tId:e,stuId:t};WebServiceUtil.requestLittleAntApi(JSON.stringify(n),{onResponse:function(e){var t=this;if(console.log(e),"调用成功"==e.msg||1==e.success){var n=[];a.state.initData=e.response,a.state.initData.forEach(function(e,l){var i="100% "+Math.ceil(e.answerCount/e.answerTotalCount*100+8)+"%";if(0==e.answerTotalCount);else{var o=m.default.createElement("div",null,m.default.createElement("div",{className:"water",onClick:a.toWaterDetail.bind(t,e.index)},m.default.createElement("i",{className:"before",style:{backgroundSize:i}}),m.default.createElement("div",{className:"inner"},m.default.createElement("div",null," ",Math.ceil(e.answerCount/e.answerTotalCount*100)+"%"),m.default.createElement("span",null,"已提交"))),m.default.createElement("span",{className:"num"},"第",e.index+1,"题"));n.push(o)}}),a.setState({htmlList:n})}},onError:function(e){}})}},{key:"toWaterDetail",value:function(e){var t={method:"waterDetailMethod",id:e+"",tId:v.state.tId+""};console.log(t),Bridge.callHandler(t,null,function(e){})}},{key:"render",value:function(){var e=this;return m.default.createElement("div",{id:"waterWorkContent"},m.default.createElement("div",{className:"flex"},e.state.htmlList))}}]),t}(m.default.Component);t.default=h}});
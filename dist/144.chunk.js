webpackJsonp([144],{303:function(e,t,n){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n(41),s=l(a),i=n(42),d=l(i),r=n(43),u=l(r),o=n(44),c=l(o),f=n(7),m=l(f),_=function(e){function t(e){(0,s.default)(this,t);var n=(0,u.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={questionDetil:{},knowledgeInfoArr:[],divShow:"block"},n}return(0,c.default)(t,e),(0,d.default)(t,[{key:"componentDidMount",value:function(){Bridge.setShareAble("false"),document.title="题目详情";var e=decodeURI(window.location.href),t=e.substr(e.indexOf("?")+1),n=t.split("&"),l=n[0].split("=")[1];this.getSubjectLineById(l)}},{key:"componentDidUpdate",value:function(){var e=document.getElementsByTagName("img");if(0==WebServiceUtil.isEmpty(e))for(var t=0;t<e.length;t++)e[t].addEventListener("click",function(){var e={method:"showImage",url:this.src,currentUrl:this.src};Bridge.callHandler(e,null,function(e){console.log(e)})})}},{key:"getSubjectLineById",value:function(e){var t=this,n={method:"getSubjectLineById",sid:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(n),{onResponse:function(e){var n=e;if("调用成功"==n.msg&&1==n.success){var l=n.response;t.setState({questionDetil:l});var a=l.knowledgeInfoList;if(0==WebServiceUtil.isEmpty(a)){var s=[];a.forEach(function(e,t){var n=m.default.createElement("span",null,e.knowledgeName);s.push(n)}),t.setState({knowledgeInfoArr:s})}else t.setState({divShow:"none"})}},onError:function(e){}})}},{key:"render",value:function(){return m.default.createElement("div",{className:"question_detil_cont"},m.default.createElement("div",{className:"list_padding",style:{display:this.state.divShow}},m.default.createElement("div",{className:"tags_blue my_flex my_flex_wrap"},this.state.knowledgeInfoArr)),m.default.createElement("div",{className:"list_padding"},m.default.createElement("h3",null,m.default.createElement("span",{className:"b_c_1"}),this.state.questionDetil.typeName),m.default.createElement("div",{dangerouslySetInnerHTML:{__html:this.state.questionDetil.content},className:"question_detil"})),m.default.createElement("div",{className:"list_padding"},m.default.createElement("h3",null,m.default.createElement("span",{className:"b_c_2"}),"正确答案"),m.default.createElement("div",{dangerouslySetInnerHTML:{__html:this.state.questionDetil.answer},className:"question_detil"})),m.default.createElement("div",{className:"list_padding list_padding_no_b"},m.default.createElement("h3",null,m.default.createElement("span",{className:"b_c_3"}),"解析"),m.default.createElement("div",{dangerouslySetInnerHTML:{__html:this.state.questionDetil.analysisContent},className:"question_detil"})))}}]),t}(m.default.Component);t.default=_}});
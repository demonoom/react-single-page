webpackJsonp([147],{422:function(e,t,n){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a,u=n(41),s=l(u),i=n(42),r=l(i),o=n(43),d=l(o),c=n(44),f=l(c),m=n(7),p=l(m),v=function(e){function t(e){(0,s.default)(this,t);var n=(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.toStudentDetail=function(e){var t=WebServiceUtil.mobileServiceURL+"studentDetail?className="+e,n={method:"openNewPage",url:t};Bridge.callHandler(n,null,function(e){window.location.href=t})},a=n,n.state={studentListData:[]},n}return(0,f.default)(t,e),(0,r.default)(t,[{key:"componentDidMount",value:function(){document.title="手环检测统计列表";var e=decodeURI(window.location.href),t=e.substr(e.indexOf("?")+1),n=t.split("&"),l=n[0].split("=")[1];a.getClassStudents(l)}},{key:"getClassStudents",value:function(e){var t={method:"getClassStudents",clazzId:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(t),{onResponse:function(e){console.log(e,"学生"),"调用成功"!=e.msg&&1!=e.success||0==WebServiceUtil.isEmpty(e.response)&&a.setState({studentListData:e.response})},onError:function(e){message.error(e)}})}},{key:"getPartStu",value:function(){}},{key:"render",value:function(){var e=this;return p.default.createElement("div",null,p.default.createElement("div",null,p.default.createElement("span",{onClick:a.getPartStu},"范围内实时数据列表"),p.default.createElement("span",null,"全部学生列表")),a.state.studentListData.map(function(t,n){return p.default.createElement("div",{onClick:a.toStudentDetail.bind(e,t.userName)},p.default.createElement("span",null,t.userName),p.default.createElement("span",null))}))}}]),t}(p.default.Component);t.default=v}});
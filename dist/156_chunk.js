webpackJsonp([156],{1375:function(e,t){},366:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(41),n=i(l),s=a(42),o=i(s),r=a(43),c=i(r),u=a(44),d=i(u),m=a(7),f=i(m);a(1375);var v=function(e){function t(e){(0,n.default)(this,t);var a=(0,c.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={},a}return(0,d.default)(t,e),(0,o.default)(t,[{key:"componentWillMount",value:function(){var e=decodeURI(window.location.href),t=e.substr(e.indexOf("?")+1),a=t.split("&"),i=a[0].split("=")[1];this.setState({ident:i})}},{key:"componentDidMount",value:function(){Bridge.setShareAble("false"),document.title="班级风采列表",this.getClazzesByUserId(this.state.ident)}},{key:"getClazzesByUserId",value:function(e){var t=this,a={method:"searchClazzByUserId",userId:e,keyWord:""};WebServiceUtil.requestLittleAntApi(JSON.stringify(a),{onResponse:function(e){"调用成功"!=e.msg&&1!=e.success||0==WebServiceUtil.isEmpty(e.response)&&t.setState({listData:e.response})},onError:function(e){message.error(e)}})}},{key:"toClassDetail",value:function(e,t){var a=void 0;e&&(a=encodeURI(WebServiceUtil.mobileServiceURL+"classDemeanor?ident="+e+"&className="+t));var i={method:"openNewPage",url:a};Bridge.callHandler(i,null,function(e){window.location.href=a})}},{key:"render",value:function(){var e=[],t=this.state.listData;for(var a in t)e.push(f.default.createElement("li",{className:"am-list-item am-list-item-middle",onClick:this.toClassDetail.bind(this,t[a].id,t[a].name)},f.default.createElement("div",{className:"am-list-line"},f.default.createElement("div",{className:"am-list-content"},t[a].name),f.default.createElement("div",{className:"am-list-arrow am-list-arrow-horizontal"}))));return f.default.createElement("div",{id:"classDemeanorList",style:{height:document.body.clientHeight}},f.default.createElement("div",{className:"noticeMsg_common"},"请在列表中选择班级进行设置"),f.default.createElement("ul",null,e))}}]),t}(f.default.Component);t.default=v}});
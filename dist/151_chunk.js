webpackJsonp([151],{1393:function(e,t){},397:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(41),o=i(n),l=a(42),s=i(l),r=a(43),u=i(r),d=a(44),c=i(d),m=a(7),f=i(m);a(1393);var p,v=function(e){function t(e){(0,o.default)(this,t);var a=(0,u.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.buildDOM=function(e){var t=[];for(var i in e)t.push(f.default.createElement("div",{className:"am-list-item am-list-item-middle",onClick:a.toUpdateARTextbook.bind(a,i)},f.default.createElement("div",{className:"am-list-line"},f.default.createElement("div",{className:"am-list-content"},"第",Number(i)+1,"组",f.default.createElement("img",{src:e[i].pic})),f.default.createElement("span",{className:"gray_page"},"第",e[i].page,"页"),f.default.createElement("div",{className:"am-list-arrow am-list-arrow-horizontal"}))));a.setState({domArray:t})},p=a,a}return(0,c.default)(t,e),(0,s.default)(t,[{key:"componentWillMount",value:function(){var e=window.location.href,t=e.substr(e.indexOf("?")+1),a=t.split("&")[0].split("=")[1],i=t.split("&")[1].split("=")[1],n=t.split("&")[2].split("=")[1];this.viewARBook(a),this.setState({bId:a,uId:i,ArName:n})}},{key:"componentDidMount",value:function(){document.title=decodeURI(this.state.ArName)+"教材组列表",Bridge.setShareAble("false")}},{key:"viewARBook",value:function(e){var t=this,a={method:"viewARBook",bId:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(a),{onResponse:function(e){"调用成功"==e.msg||1==e.success?(p.state.initData=e.response,p.setState({itemList:p.state.initData.itemList}),t.buildDOM(p.state.initData.itemList)):Toast.fail(e.msg,5)},onError:function(e){}})}},{key:"toUpdateARTextbook",value:function(e){var t=encodeURI(WebServiceUtil.mobileServiceURL+"UpdateARTextbook?bId="+this.state.bId+"&uid="+this.state.uId+"&index="+e)+"&ArName="+this.state.ArName,a={method:"openNewPage",url:t};Bridge.callHandler(a,null,function(e){window.location.href=t})}},{key:"render",value:function(){var e=this;return f.default.createElement("div",{id:"groupList"},e.state.domArray)}}]),t}(f.default.Component);t.default=v}});
webpackJsonp([125],{1290:function(e,t){},333:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(557),i=o(r),a=n(41),s=o(a),l=n(42),c=o(l),u=n(43),d=o(u),h=n(44),f=o(h);n(587);var p=n(7),v=o(p);n(1290);var g=function(e){function t(e){(0,s.default)(this,t);var n=(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));n.onEndReached=function(e){var t=n.state.defaultPageNo;(n.state.isLoadingLeft||n.state.hasMore)&&(t+=1,n.setState({isLoadingLeft:!0,defaultPageNo:t}),n.getNoticeReadMore(),n.setState({dataSource:n.state.dataSource.cloneWithRows(n.initData),isLoadingLeft:!0}))},n.onClick=function(e){$(".ulBox li").find(".noticeContent").css({display:"none"}),$(e.target).next().css({display:"block"})};var o=new i.default.DataSource({rowHasChanged:function(e,t){return e!==t}});return n.initData=[],n.state={dataSource:o.cloneWithRows(n.initData),clientHeight:document.body.clientHeight,listViewDisplay:!1,defaultPageNo:1,initArrData:[],dataFlag:!1},n}return(0,f.default)(t,e),(0,c.default)(t,[{key:"componentWillMount",value:function(){var e=decodeURI(window.location.href),t=e.substr(e.indexOf("?")+1),n=t.split("&"),o=n[0].split("=")[1];this.setState({defaultId:o})}},{key:"componentDidMount",value:function(){this.getNoticeReadMore()}},{key:"getNoticeReadMore",value:function(){var e=this;e.state.listViewDisplay=!0;var t={},n=e.state.defaultPageNo,o={method:"getClassBrandNoticeListByClassId",classroomId:localStorage.getItem("roomId"),pageNo:n};WebServiceUtil.requestLittleAntApi(JSON.stringify(o),{onResponse:function(n){if(1==n.success&&"调用成功"==n.msg)if(e.state.initArrData=n.response,0===n.response.length)e.setState({isLoadingLeft:!1});else{for(var o=n.response,r=n.pager,i=0;i<o.length;i++){var a=o[i];t[""+i]=a}var s=!1;o.length>0?s=!(1==r.pageCount&&r.rsCount<9):(s=!1,e.setState({dataFlag:!0})),e.initData=e.initData.concat(o),e.setState({dataSource:e.state.dataSource.cloneWithRows(e.initData),isLoadingLeft:s,refreshing:!1})}},onError:function(e){}})}},{key:"getTimeFormat",value:function(e){var t=new Date(e);return(t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1)+"/"+(t.getDate()<10?"0"+t.getDate():t.getDate())+" "+(t.getHours()<10?"0"+t.getHours():t.getHours())+":"+(t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes())}},{key:"historyGoBack",value:function(){var e={method:"finish"};Bridge.callHandler(e,null,function(e){console.log(e)})}},{key:"render",value:function(){var e=this,t=function(t,n,o){return v.default.createElement("div",{className:"divBox"},v.default.createElement("ul",{className:"ulBox"},v.default.createElement("li",{onClick:e.onClick},v.default.createElement("p",{className:"title"},t.noticeTitle,v.default.createElement("span",{className:"time"},e.getTimeFormat(t.createTime))),v.default.createElement("div",{className:"noticeContent",style:{display:"0"==o?"block":"none"}},t.noticeContent))))};return v.default.createElement("div",{id:this.state.defaultId},v.default.createElement("div",{id:"noticeReadMore",className:"home_content",style:{height:document.body.clientHeight}},v.default.createElement("div",{className:"inner_bg"},v.default.createElement("div",{className:"navBar"},v.default.createElement("span",{onClick:this.historyGoBack},"首页"),v.default.createElement("span",{className:"icon"}),v.default.createElement("span",null,"通知")),0==this.state.initArrData.length?this.state.dataFlag?v.default.createElement("div",{className:"emptyPage_content"},v.default.createElement("div",{className:"empty_center"},v.default.createElement("div",{className:"emptyPage_icon emptyPage_publicImg"}),v.default.createElement("div",{className:"emptyPage_text"},"暂无数据"))):v.default.createElement("div",null):v.default.createElement(i.default,{ref:function(t){return e.lv=t},dataSource:this.state.dataSource,renderFooter:function(){return v.default.createElement("div",{style:{paddingTop:5,paddingBottom:40,textAlign:"center"}},e.state.isLoadingLeft?"正在加载":"已经全部加载完毕")},renderRow:t,className:"am-list",pageSize:15,scrollRenderAheadDistance:200,onEndReached:this.onEndReached,onEndReachedThreshold:10,initialListSize:15,scrollEventThrottle:20,style:{height:this.state.clientHeight,display:this.state.listViewDisplay?"block":"none"}}))))}}]),t}(v.default.Component);t.default=g},467:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(143),r=n.n(o),i=n(41),a=n.n(i),s=n(42),l=n.n(s),c=n(43),u=n.n(c),d=n(44),h=n.n(d),f=n(7),p=n.n(f),v=n(144),g=n.n(v),m=("undefined"!=typeof window&&window,function(e){function t(){a()(this,t);var e=u()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.state={active:!1},e.onTouchStart=function(t){e.triggerEvent("TouchStart",!0,t)},e.onTouchMove=function(t){e.triggerEvent("TouchMove",!1,t)},e.onTouchEnd=function(t){e.triggerEvent("TouchEnd",!1,t)},e.onTouchCancel=function(t){e.triggerEvent("TouchCancel",!1,t)},e.onMouseDown=function(t){e.props.onTouchStart&&e.triggerEvent("TouchStart",!0,t),e.triggerEvent("MouseDown",!0,t)},e.onMouseUp=function(t){e.props.onTouchEnd&&e.triggerEvent("TouchEnd",!1,t),e.triggerEvent("MouseUp",!1,t)},e.onMouseLeave=function(t){e.triggerEvent("MouseLeave",!1,t)},e}return h()(t,e),l()(t,[{key:"componentDidUpdate",value:function(){this.props.disabled&&this.state.active&&this.setState({active:!1})}},{key:"triggerEvent",value:function(e,t,n){var o="on"+e;this.props[o]&&this.props[o](n),this.setState({active:t})}},{key:"render",value:function(){var e=this.props,t=e.children,n=e.disabled,o=e.activeClassName,i=e.activeStyle,a=n?void 0:{onTouchStart:this.onTouchStart,onTouchMove:this.onTouchMove,onTouchEnd:this.onTouchEnd,onTouchCancel:this.onTouchCancel,onMouseDown:this.onMouseDown,onMouseUp:this.onMouseUp,onMouseLeave:this.onMouseLeave},s=p.a.Children.only(t);if(!n&&this.state.active){var l=s.props,c=l.style,u=l.className;return!1!==i&&(i&&(c=r()({},c,i)),u=g()(u,o)),p.a.cloneElement(s,r()({className:u,style:c},a))}return p.a.cloneElement(s,a)}}]),t}(p.a.Component)),y=m;m.defaultProps={disabled:!1},n.d(t,"default",function(){return y})},469:function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}},477:function(e,t,n){"use strict";n(146),n(498)},488:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(143),i=o(r),a=n(41),s=o(a),l=n(42),c=o(l),u=n(43),d=o(u),h=n(44),f=o(h),p=n(144),v=o(p),g=n(7),m=o(g),y=n(509),S=o(y),w=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var r=0,o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&(n[o[r]]=e[o[r]]);return n},_=function(e){function t(){return(0,s.default)(this,t),(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,f.default)(t,e),(0,c.default)(t,[{key:"render",value:function(){var e=this.props,t=e.prefixCls,n=e.children,o=e.className,r=e.style,a=e.renderHeader,s=e.renderFooter,l=w(e,["prefixCls","children","className","style","renderHeader","renderFooter"]),c=(0,v.default)(t,o);return m.default.createElement("div",(0,i.default)({className:c,style:r},l),a?m.default.createElement("div",{className:t+"-header"},"function"==typeof a?a():a):null,n?m.default.createElement("div",{className:t+"-body"},n):null,s?m.default.createElement("div",{className:t+"-footer"},"function"==typeof s?s():s):null)}}]),t}(m.default.Component);t.default=_,_.Item=S.default,_.defaultProps={prefixCls:"am-list"},e.exports=t.default},498:function(e,t){},509:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.Brief=void 0;var r=n(143),i=o(r),a=n(145),s=o(a),l=n(41),c=o(l),u=n(42),d=o(u),h=n(43),f=o(h),p=n(44),v=o(p),g=n(144),m=o(g),y=n(7),S=o(y),w=n(467),_=o(w),C=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var r=0,o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&(n[o[r]]=e[o[r]]);return n},R=t.Brief=function(e){function t(){return(0,c.default)(this,t),(0,f.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,v.default)(t,e),(0,d.default)(t,[{key:"render",value:function(){return S.default.createElement("div",{className:"am-list-brief",style:this.props.style},this.props.children)}}]),t}(S.default.Component),b=function(e){function t(e){(0,c.default)(this,t);var n=(0,f.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.onClick=function(e){var t=n.props,o=t.onClick,r=t.platform,i="android"===r;if(o&&i){n.debounceTimeout&&(clearTimeout(n.debounceTimeout),n.debounceTimeout=null);var a=e.currentTarget,s=Math.max(a.offsetHeight,a.offsetWidth),l=e.currentTarget.getBoundingClientRect(),c=e.clientX-l.left-a.offsetWidth/2,u=e.clientY-l.top-a.offsetWidth/2,d={width:s+"px",height:s+"px",left:c+"px",top:u+"px"};n.setState({coverRippleStyle:d,RippleClicked:!0},function(){n.debounceTimeout=setTimeout(function(){n.setState({coverRippleStyle:{display:"none"},RippleClicked:!1})},1e3)})}o&&o(e)},n.state={coverRippleStyle:{display:"none"},RippleClicked:!1},n}return(0,v.default)(t,e),(0,d.default)(t,[{key:"componentWillUnmount",value:function(){this.debounceTimeout&&(clearTimeout(this.debounceTimeout),this.debounceTimeout=null)}},{key:"render",value:function(){var e,t,n,o=this,r=this.props,a=r.prefixCls,l=r.className,c=r.activeStyle,u=r.error,d=r.align,h=r.wrap,f=r.disabled,p=r.children,v=r.multipleLine,g=r.thumb,y=r.extra,w=r.arrow,R=r.onClick,b=C(r,["prefixCls","className","activeStyle","error","align","wrap","disabled","children","multipleLine","thumb","extra","arrow","onClick"]),E=(b.platform,C(b,["platform"])),k=this.state,T=k.coverRippleStyle,L=k.RippleClicked,N=(0,m.default)(a+"-item",l,(e={},(0,s.default)(e,a+"-item-disabled",f),(0,s.default)(e,a+"-item-error",u),(0,s.default)(e,a+"-item-top","top"===d),(0,s.default)(e,a+"-item-middle","middle"===d),(0,s.default)(e,a+"-item-bottom","bottom"===d),e)),I=(0,m.default)(a+"-ripple",(0,s.default)({},a+"-ripple-animate",L)),P=(0,m.default)(a+"-line",(t={},(0,s.default)(t,a+"-line-multiple",v),(0,s.default)(t,a+"-line-wrap",h),t)),H=(0,m.default)(a+"-arrow",(n={},(0,s.default)(n,a+"-arrow-horizontal","horizontal"===w),(0,s.default)(n,a+"-arrow-vertical","down"===w||"up"===w),(0,s.default)(n,a+"-arrow-vertical-up","up"===w),n)),x=S.default.createElement("div",(0,i.default)({},E,{onClick:function(e){o.onClick(e)},className:N}),g?S.default.createElement("div",{className:a+"-thumb"},"string"==typeof g?S.default.createElement("img",{src:g}):g):null,S.default.createElement("div",{className:P},void 0!==p&&S.default.createElement("div",{className:a+"-content"},p),void 0!==y&&S.default.createElement("div",{className:a+"-extra"},y),w&&S.default.createElement("div",{className:H,"aria-hidden":"true"})),S.default.createElement("div",{style:T,className:I})),D={};return Object.keys(E).forEach(function(e){/onTouch/i.test(e)&&(D[e]=E[e],delete E[e])}),S.default.createElement(_.default,(0,i.default)({},D,{disabled:f||!R,activeStyle:c,activeClassName:a+"-item-active"}),x)}}]),t}(S.default.Component);b.defaultProps={prefixCls:"am-list",align:"middle",error:!1,multipleLine:!1,wrap:!1,platform:"ios"},b.Brief=R,t.default=b},516:function(e,t,n){"use strict";function o(e,t,n){return e[t][n]}function r(e,t){return e[t]}function i(e){for(var t=0,n=0;n<e.length;n++){t+=e[n].length}return t}function a(e){if(H()(e))return{};for(var t={},n=0;n<e.length;n++){var o=e[n];D()(!t[o],"Value appears more than once in array: "+o),t[o]=!0}return t}function s(e){var t=0;do{isNaN(e.offsetTop)||(t+=e.offsetTop)}while(e=e.offsetParent);return t}function l(e){return e.touches&&e.touches.length?e.touches[0]:e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e}function c(e,t){var n=!0,o=!0;return function(r){n&&(n=!1,setTimeout(function(){n=!0,e(r)},t),o&&(e(r),o=!1))}}function u(e){window.document.body.scrollTop=e,window.document.documentElement.scrollTop=e}Object.defineProperty(t,"__esModule",{value:!0});var d=n(143),h=n.n(d),f=n(469),p=n.n(f),v=n(41),g=n.n(v),m=n(42),y=n.n(m),S=n(43),w=n.n(S),_=n(44),C=n.n(_),R=n(7),b=n.n(R),E=n(9),k=n.n(E),T=n(57),L=n.n(T),N=n(0),I=n.n(N),P=n(558),H=n.n(P),x=n(15),D=n.n(x),O=function(){function e(t){g()(this,e),I()(t&&"function"==typeof t.rowHasChanged,"Must provide a rowHasChanged function."),this._rowHasChanged=t.rowHasChanged,this._getRowData=t.getRowData||o,this._sectionHeaderHasChanged=t.sectionHeaderHasChanged,this._getSectionHeaderData=t.getSectionHeaderData||r,this._dataBlob=null,this._dirtyRows=[],this._dirtySections=[],this._cachedRowCount=0,this.rowIdentities=[],this.sectionIdentities=[]}return y()(e,[{key:"cloneWithRows",value:function(e,t){var n=t?[t]:null;return this._sectionHeaderHasChanged||(this._sectionHeaderHasChanged=function(){return!1}),this.cloneWithRowsAndSections({s1:e},["s1"],n)}},{key:"cloneWithRowsAndSections",value:function(t,n,o){I()("function"==typeof this._sectionHeaderHasChanged,"Must provide a sectionHeaderHasChanged function with section data."),I()(!n||!o||n.length===o.length,"row and section ids lengths must be the same");var r=new e({getRowData:this._getRowData,getSectionHeaderData:this._getSectionHeaderData,rowHasChanged:this._rowHasChanged,sectionHeaderHasChanged:this._sectionHeaderHasChanged});return r._dataBlob=t,r.sectionIdentities=n||Object.keys(t),o?r.rowIdentities=o:(r.rowIdentities=[],r.sectionIdentities.forEach(function(e){r.rowIdentities.push(Object.keys(t[e]))})),r._cachedRowCount=i(r.rowIdentities),r._calculateDirtyArrays(this._dataBlob,this.sectionIdentities,this.rowIdentities),r}},{key:"getRowCount",value:function(){return this._cachedRowCount}},{key:"getRowAndSectionCount",value:function(){return this._cachedRowCount+this.sectionIdentities.length}},{key:"rowShouldUpdate",value:function(e,t){var n=this._dirtyRows[e][t];return D()(void 0!==n,"missing dirtyBit for section, row: "+e+", "+t),n}},{key:"getRowData",value:function(e,t){var n=this.sectionIdentities[e],o=this.rowIdentities[e][t];return D()(void 0!==n&&void 0!==o,"rendering invalid section, row: "+e+", "+t),this._getRowData(this._dataBlob,n,o)}},{key:"getRowIDForFlatIndex",value:function(e){for(var t=e,n=0;n<this.sectionIdentities.length;n++){if(!(t>=this.rowIdentities[n].length))return this.rowIdentities[n][t];t-=this.rowIdentities[n].length}return null}},{key:"getSectionIDForFlatIndex",value:function(e){for(var t=e,n=0;n<this.sectionIdentities.length;n++){if(!(t>=this.rowIdentities[n].length))return this.sectionIdentities[n];t-=this.rowIdentities[n].length}return null}},{key:"getSectionLengths",value:function(){for(var e=[],t=0;t<this.sectionIdentities.length;t++)e.push(this.rowIdentities[t].length);return e}},{key:"sectionHeaderShouldUpdate",value:function(e){var t=this._dirtySections[e];return D()(void 0!==t,"missing dirtyBit for section: "+e),t}},{key:"getSectionHeaderData",value:function(e){if(!this._getSectionHeaderData)return null;var t=this.sectionIdentities[e];return D()(void 0!==t,"renderSection called on invalid section: "+e),this._getSectionHeaderData(this._dataBlob,t)}},{key:"_calculateDirtyArrays",value:function(e,t,n){for(var o=a(t),r={},i=0;i<n.length;i++){var s=t[i];D()(!r[s],"SectionID appears more than once: "+s),r[s]=a(n[i])}this._dirtySections=[],this._dirtyRows=[];for(var l,c=0;c<this.sectionIdentities.length;c++){var s=this.sectionIdentities[c];l=!o[s];var u=this._sectionHeaderHasChanged;!l&&u&&(l=u(this._getSectionHeaderData(e,s),this._getSectionHeaderData(this._dataBlob,s))),this._dirtySections.push(!!l),this._dirtyRows[c]=[];for(var d=0;d<this.rowIdentities[c].length;d++){var h=this.rowIdentities[c][d];l=!o[s]||!r[s][h]||this._rowHasChanged(this._getRowData(e,s,h),this._getRowData(this._dataBlob,s,h)),this._dirtyRows[c].push(!!l)}}}}]),e}(),M=O,B=n(144),V=n.n(B),j={className:k.a.string,prefixCls:k.a.string,listPrefixCls:k.a.string,listViewPrefixCls:k.a.string,style:k.a.object,contentContainerStyle:k.a.object,onScroll:k.a.func},z=function(e){function t(){var e,n,o,r;g()(this,t);for(var i=arguments.length,a=Array(i),s=0;s<i;s++)a[s]=arguments[s];return n=o=w()(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(a))),W.call(o),r=n,w()(o,r)}return C()(t,e),y()(t,[{key:"componentWillUpdate",value:function(e){this.props.dataSource===e.dataSource&&this.props.initialListSize===e.initialListSize||!this.handleScroll||(this.props.useBodyScroll?window.removeEventListener("scroll",this.handleScroll):this.ScrollViewRef.removeEventListener("scroll",this.handleScroll))}},{key:"componentDidUpdate",value:function(e){var t=this;this.props.dataSource===e.dataSource&&this.props.initialListSize===e.initialListSize||!this.handleScroll||setTimeout(function(){t.props.useBodyScroll?window.addEventListener("scroll",t.handleScroll):t.ScrollViewRef.addEventListener("scroll",t.handleScroll)},0)}},{key:"componentDidMount",value:function(){var e=this,t=function(t){return e.props.onScroll&&e.props.onScroll(t,e.getMetrics())};this.props.scrollEventThrottle&&(t=c(t,this.props.scrollEventThrottle)),this.handleScroll=t,this.onLayout=function(){return e.props.onLayout({nativeEvent:{layout:{width:window.innerWidth,height:window.innerHeight}}})},this.props.useBodyScroll?(window.addEventListener("scroll",this.handleScroll),window.addEventListener("resize",this.onLayout)):this.ScrollViewRef.addEventListener("scroll",this.handleScroll)}},{key:"componentWillUnmount",value:function(){this.props.useBodyScroll?(window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("resize",this.onLayout)):this.ScrollViewRef.removeEventListener("scroll",this.handleScroll)}},{key:"render",value:function(){var e=this,t=this.props,n=t.children,o=t.className,r=t.prefixCls,i=t.listPrefixCls,a=t.listViewPrefixCls,s=t.style,l=void 0===s?{}:s,c=t.contentContainerStyle,u=void 0===c?{}:c,d=t.useBodyScroll,f=t.pullToRefresh,p={position:"relative",overflow:"auto",WebkitOverflowScrolling:"touch"},v=r||a||"",g={ref:function(t){return e.ScrollViewRef=t||e.ScrollViewRef},style:h()({},d?{}:p,l),className:V()(o,v+"-scrollview")},m={ref:function(t){return e.InnerScrollViewRef=t},style:h()({position:"absolute",minWidth:"100%"},u),className:V()(v+"-scrollview-content",i)},y=function(t){return b.a.cloneElement(f,{getScrollContainer:t?function(){return document.body}:function(){return e.ScrollViewRef}},n)};return d?f?b.a.createElement("div",g,y(!0)):b.a.createElement("div",g,n):f?b.a.createElement("div",g,b.a.createElement("div",m,y())):b.a.createElement("div",g,b.a.createElement("div",m,n))}}]),t}(b.a.Component);z.propTypes=j;var W=function(){var e=this;this.getMetrics=function(){var t=!e.props.horizontal;if(e.props.useBodyScroll){var n=document.scrollingElement?document.scrollingElement:document.body;return{visibleLength:window[t?"innerHeight":"innerWidth"],contentLength:e.ScrollViewRef?e.ScrollViewRef[t?"scrollHeight":"scrollWidth"]:0,offset:n[t?"scrollTop":"scrollLeft"]}}return{visibleLength:e.ScrollViewRef[t?"offsetHeight":"offsetWidth"],contentLength:e.ScrollViewRef[t?"scrollHeight":"scrollWidth"],offset:e.ScrollViewRef[t?"scrollTop":"scrollLeft"]}},this.getInnerViewNode=function(){return e.InnerScrollViewRef},this.scrollTo=function(){if(e.props.useBodyScroll){var t;(t=window).scrollTo.apply(t,arguments)}else e.ScrollViewRef.scrollLeft=arguments.length<=0?void 0:arguments[0],e.ScrollViewRef.scrollTop=arguments.length<=1?void 0:arguments[1]}},q=z,F=function(e){function t(){return g()(this,t),w()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return C()(t,e),y()(t,[{key:"shouldComponentUpdate",value:function(e){return e.shouldUpdate}},{key:"render",value:function(){return this.props.render()}}]),t}(b.a.Component),A=function(e){function t(){var e,n,o,r;g()(this,t);for(var i=arguments.length,a=Array(i),s=0;s<i;s++)a[s]=arguments[s];return n=o=w()(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(a))),Q.call(o),r=n,w()(o,r)}return C()(t,e),y()(t,[{key:"componentWillMount",value:function(){this.scrollProperties={visibleLength:null,contentLength:null,offset:0},this._childFrames=[],this._visibleRows={},this._prevRenderedRowsCount=0,this._sentEndForContentLength=null}},{key:"componentWillReceiveProps",value:function(e){var t=this;this.props.dataSource===e.dataSource&&this.props.initialListSize===e.initialListSize||this.setState(function(n,o){return t._prevRenderedRowsCount=0,{curRenderedRowsCount:Math.min(Math.max(n.curRenderedRowsCount,e.initialListSize),e.dataSource.getRowCount())}},function(){return t._renderMoreRowsIfNeeded()})}},{key:"render",value:function(){for(var e=this,t=this.props.dataSource,n=t.rowIdentities,o=[],r=0,i=0;i<n.length;i++){var a=t.sectionIdentities[i],s=n[i];if(0!==s.length){var l=void 0;if(this.props.renderSectionHeader){var c=r>=this._prevRenderedRowsCount&&t.sectionHeaderShouldUpdate(i);l=b.a.createElement(F,{key:"s_"+a,shouldUpdate:!!c,render:this.props.renderSectionHeader.bind(null,t.getSectionHeaderData(i),a)})}for(var u=[],d=0;d<s.length;d++){var f=s[d],v=a+"_"+f,g=r>=this._prevRenderedRowsCount&&t.rowShouldUpdate(i,d),m=b.a.createElement(F,{key:"r_"+v,shouldUpdate:!!g,render:this.props.renderRow.bind(null,t.getRowData(i,d),a,f,this.onRowHighlighted)});if(u.push(m),this.props.renderSeparator&&(d!==s.length-1||i===n.length-1)){var y=this.state.highlightedRow.sectionID===a&&(this.state.highlightedRow.rowID===f||this.state.highlightedRow.rowID===s[d+1]),S=this.props.renderSeparator(a,f,y);S&&u.push(S)}if(++r===this.state.curRenderedRowsCount)break}var w=b.a.cloneElement(this.props.renderSectionBodyWrapper(a),{className:this.props.sectionBodyClassName},u);if(this.props.renderSectionWrapper?o.push(b.a.cloneElement(this.props.renderSectionWrapper(a),{},l,w)):(o.push(l),o.push(w)),r>=this.state.curRenderedRowsCount)break}}var _=this.props,C=_.renderScrollComponent,R=p()(_,["renderScrollComponent"]);return b.a.cloneElement(C(h()({},R,{onScroll:this._onScroll})),{ref:function(t){return e.ListViewRef=t},onContentSizeChange:this._onContentSizeChange,onLayout:this._onLayout},this.props.renderHeader?this.props.renderHeader():null,b.a.cloneElement(R.renderBodyComponent(),{},o),this.props.renderFooter?this.props.renderFooter():null,R.children)}}]),t}(b.a.Component);A.DataSource=M,A.propTypes=h()({},q.propTypes,{dataSource:k.a.instanceOf(M).isRequired,renderSeparator:k.a.func,renderRow:k.a.func.isRequired,initialListSize:k.a.number,onEndReached:k.a.func,onEndReachedThreshold:k.a.number,pageSize:k.a.number,renderFooter:k.a.func,renderHeader:k.a.func,renderSectionHeader:k.a.func,renderScrollComponent:k.a.func,scrollRenderAheadDistance:k.a.number,onChangeVisibleRows:k.a.func,scrollEventThrottle:k.a.number,renderBodyComponent:k.a.func,renderSectionWrapper:k.a.func,renderSectionBodyWrapper:k.a.func,sectionBodyClassName:k.a.string,listViewPrefixCls:k.a.string,useBodyScroll:k.a.bool}),A.defaultProps={initialListSize:10,pageSize:1,renderScrollComponent:function(e){return b.a.createElement(q,e)},renderBodyComponent:function(){return b.a.createElement("div",null)},renderSectionBodyWrapper:function(e){return b.a.createElement("div",{key:e})},sectionBodyClassName:"list-view-section-body",listViewPrefixCls:"rmc-list-view",scrollRenderAheadDistance:1e3,onEndReachedThreshold:1e3,scrollEventThrottle:50,scrollerOptions:{}};var Q=function(){var e=this;this.state={curRenderedRowsCount:this.props.initialListSize,highlightedRow:{}},this.getMetrics=function(){return{contentLength:e.scrollProperties.contentLength,totalRows:e.props.dataSource.getRowCount(),renderedRows:e.state.curRenderedRowsCount,visibleRows:Object.keys(e._visibleRows).length}},this.getInnerViewNode=function(){return e.ListViewRef.getInnerViewNode()},this.scrollTo=function(){var t;e.ListViewRef&&e.ListViewRef.scrollTo&&(t=e.ListViewRef).scrollTo.apply(t,arguments)},this.onRowHighlighted=function(t,n){e.setState({highlightedRow:{sectionID:t,rowID:n}})},this._onContentSizeChange=function(t,n){var o=e.props.horizontal?t:n;o!==e.scrollProperties.contentLength&&(e.scrollProperties.contentLength=o,e._renderMoreRowsIfNeeded()),e.props.onContentSizeChange&&e.props.onContentSizeChange(t,n)},this._onLayout=function(t){var n=t.nativeEvent.layout,o=n.width,r=n.height,i=e.props.horizontal?o:r;i!==e.scrollProperties.visibleLength&&(e.scrollProperties.visibleLength=i,e._renderMoreRowsIfNeeded()),e.props.onLayout&&e.props.onLayout(t)},this._maybeCallOnEndReached=function(t){return!!(e.props.onEndReached&&e.scrollProperties.contentLength!==e._sentEndForContentLength&&e._getDistanceFromEnd(e.scrollProperties)<e.props.onEndReachedThreshold&&e.state.curRenderedRowsCount===e.props.dataSource.getRowCount())&&(e._sentEndForContentLength=e.scrollProperties.contentLength,e.props.onEndReached(t),!0)},this._renderMoreRowsIfNeeded=function(){if(null===e.scrollProperties.contentLength||null===e.scrollProperties.visibleLength||e.state.curRenderedRowsCount===e.props.dataSource.getRowCount())return void e._maybeCallOnEndReached();e._getDistanceFromEnd(e.scrollProperties)<e.props.scrollRenderAheadDistance&&e._pageInNewRows()},this._pageInNewRows=function(){e.setState(function(t,n){var o=Math.min(t.curRenderedRowsCount+n.pageSize,n.dataSource.getRowCount());return e._prevRenderedRowsCount=t.curRenderedRowsCount,{curRenderedRowsCount:o}},function(){e._prevRenderedRowsCount=e.state.curRenderedRowsCount})},this._getDistanceFromEnd=function(e){return e.contentLength-e.visibleLength-e.offset},this._onScroll=function(t,n){e.ListViewRef&&(e.scrollProperties=n,e._maybeCallOnEndReached(t)||e._renderMoreRowsIfNeeded(),e.props.onEndReached&&e._getDistanceFromEnd(e.scrollProperties)>e.props.onEndReachedThreshold&&(e._sentEndForContentLength=null),e.props.onScroll&&e.props.onScroll(t))}},U=A,Y=n(145),G=n.n(Y),J=function(e){function t(e){g()(this,t);var n=w()(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return $.call(n),n.state={pageSize:e.pageSize,_delay:!1},n}return C()(t,e),y()(t,[{key:"componentDidMount",value:function(){this.dataChange(this.props),this.getQsInfo()}},{key:"componentWillReceiveProps",value:function(e){this.props.dataSource!==e.dataSource&&this.dataChange(e)}},{key:"componentDidUpdate",value:function(){this.getQsInfo()}},{key:"componentWillUnmount",value:function(){this._timer&&clearTimeout(this._timer),this._hCache=null}},{key:"renderQuickSearchBar",value:function(e,t){var n=this,o=this.props,r=o.dataSource,i=o.prefixCls,a=r.sectionIdentities.map(function(e){return{value:e,label:r._getSectionHeaderData(r._dataBlob,e)}});return b.a.createElement("ul",{ref:function(e){return n.quickSearchBarRef=e},className:i+"-quick-search-bar",style:t,onTouchStart:this.onTouchStart,onTouchMove:this.onTouchMove,onTouchEnd:this.onTouchEnd,onTouchCancel:this.onTouchEnd},b.a.createElement("li",{"data-qf-target":e.value,onClick:function(){return n.onQuickSearchTop(void 0,e.value)}},e.label),a.map(function(e){return b.a.createElement("li",{key:e.value,"data-qf-target":e.value,onClick:function(){return n.onQuickSearch(e.value)}},e.label)}))}},{key:"render",value:function(){var e,t=this,n=this.state,o=n._delay,r=n.pageSize,i=this.props,a=i.className,s=i.prefixCls,l=i.children,c=i.quickSearchBarTop,u=i.quickSearchBarStyle,d=i.initialListSize,f=void 0===d?Math.min(20,this.props.dataSource.getRowCount()):d,v=i.showQuickSearchIndicator,g=i.renderSectionHeader,m=i.sectionHeaderClassName,y=p()(i,["className","prefixCls","children","quickSearchBarTop","quickSearchBarStyle","initialListSize","showQuickSearchIndicator","renderSectionHeader","sectionHeaderClassName"]);return b.a.createElement("div",{className:s+"-container"},o&&this.props.delayActivityIndicator,b.a.createElement(U,h()({},y,{ref:function(e){return t.indexedListViewRef=e},className:V()(s,a),initialListSize:f,pageSize:r,renderSectionHeader:function(e,n){return b.a.cloneElement(g(e,n),{ref:function(e){return t.sectionComponents[n]=e},className:m||s+"-section-header"})}}),l),this.renderQuickSearchBar(c,u),v?b.a.createElement("div",{className:V()((e={},G()(e,s+"-qsindicator",!0),G()(e,s+"-qsindicator-hide",!v||!this.state.showQuickSearchIndicator),e)),ref:function(e){return t.qsIndicatorRef=e}}):null)}}]),t}(b.a.Component);J.propTypes=h()({},U.propTypes,{children:k.a.any,prefixCls:k.a.string,className:k.a.string,sectionHeaderClassName:k.a.string,quickSearchBarTop:k.a.object,quickSearchBarStyle:k.a.object,onQuickSearch:k.a.func,showQuickSearchIndicator:k.a.bool}),J.defaultProps={prefixCls:"rmc-indexed-list",quickSearchBarTop:{value:"#",label:"#"},onQuickSearch:function(){},showQuickSearchIndicator:!1,delayTime:100,delayActivityIndicator:""};var $=function(){var e=this;this.onQuickSearchTop=function(t,n){e.props.useBodyScroll?u(0):L.a.findDOMNode(e.indexedListViewRef.ListViewRef).scrollTop=0,e.props.onQuickSearch(t,n)},this.onQuickSearch=function(t){var n=L.a.findDOMNode(e.indexedListViewRef.ListViewRef),o=L.a.findDOMNode(e.sectionComponents[t]);e.props.useBodyScroll?u(o.getBoundingClientRect().top-n.getBoundingClientRect().top+s(n)):n.scrollTop+=o.getBoundingClientRect().top-n.getBoundingClientRect().top,e.props.onQuickSearch(t)},this.onTouchStart=function(t){e._target=t.target,e._basePos=e.quickSearchBarRef.getBoundingClientRect(),document.addEventListener("touchmove",e._disableParent,!1),document.body.className=document.body.className+" "+e.props.prefixCls+"-qsb-moving",e.updateIndicator(e._target)},this.onTouchMove=function(t){if(t.preventDefault(),e._target){var n=l(t),o=e._basePos,r=void 0;if(n.clientY>=o.top&&n.clientY<=o.top+e._qsHeight){r=Math.floor((n.clientY-o.top)/e._avgH);var i=void 0;if(r in e._hCache&&(i=e._hCache[r][0]),i){var a=i.getAttribute("data-qf-target");e._target!==i&&(e.props.quickSearchBarTop.value===a?e.onQuickSearchTop(void 0,a):e.onQuickSearch(a),e.updateIndicator(i)),e._target=i}}}},this.onTouchEnd=function(){e._target&&(document.removeEventListener("touchmove",e._disableParent,!1),document.body.className=document.body.className.replace(new RegExp("\\s*"+e.props.prefixCls+"-qsb-moving","g"),""),e.updateIndicator(e._target,!0),e._target=null)},this.getQsInfo=function(){var t=e.quickSearchBarRef,n=t.offsetHeight,o=[];[].slice.call(t.querySelectorAll("[data-qf-target]")).forEach(function(e){o.push([e])});for(var r=n/o.length,i=0,a=0,s=o.length;a<s;a++)i=a*r,o[a][1]=[i,i+r];e._qsHeight=n,e._avgH=r,e._hCache=o},this.sectionComponents={},this.dataChange=function(t){var n=t.dataSource.getRowCount();n&&(e.setState({_delay:!0}),e._timer&&clearTimeout(e._timer),e._timer=setTimeout(function(){e.setState({pageSize:n,_delay:!1},function(){return e.indexedListViewRef._pageInNewRows()})},t.delayTime))},this.updateIndicator=function(t,n){var o=t;o.getAttribute("data-qf-target")||(o=o.parentNode),e.props.showQuickSearchIndicator&&(e.qsIndicatorRef.innerText=o.innerText.trim(),e.setState({showQuickSearchIndicator:!0}),e._indicatorTimer&&clearTimeout(e._indicatorTimer),e._indicatorTimer=setTimeout(function(){e.setState({showQuickSearchIndicator:!1})},1e3));var r=e.props.prefixCls+"-quick-search-bar-over";e._hCache.forEach(function(e){e[0].className=e[0].className.replace(r,"")}),n||(o.className=o.className+" "+r)},this._disableParent=function(e){e.preventDefault(),e.stopPropagation()}},X=J;n.d(t,"DataSource",function(){return K}),n.d(t,"IndexedList",function(){return X}),U.IndexedList=X;var K=U.DataSource;t.default=U},517:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){var n=e.renderHeader,o=e.renderFooter,r=e.renderSectionHeader,i=e.renderBodyComponent,s=c(e,["renderHeader","renderFooter","renderSectionHeader","renderBodyComponent"]),l=e.listPrefixCls,d={renderHeader:null,renderFooter:null,renderSectionHeader:null,renderBodyComponent:i||function(){return a.default.createElement("div",{className:l+"-body"})}};return n&&(d.renderHeader=function(){return a.default.createElement("div",{className:l+"-header"},n())}),o&&(d.renderFooter=function(){return a.default.createElement("div",{className:l+"-footer"},o())}),r&&(d.renderSectionHeader=t?function(e,t){return a.default.createElement("div",null,a.default.createElement(u,{prefixCls:l},r(e,t)))}:function(e,t){return a.default.createElement(u,{prefixCls:l},r(e,t))}),{restProps:s,extraProps:d}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=r;var i=n(7),a=o(i),s=n(488),l=o(s),c=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var r=0,o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&(n[o[r]]=e[o[r]]);return n},u=l.default.Item;e.exports=t.default},557:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(143),i=o(r),a=n(41),s=o(a),l=n(42),c=o(l),u=n(43),d=o(u),h=n(44),f=o(h),p=n(7),v=o(p),g=n(516),m=o(g),y=n(517),S=o(y),w=n(559),_=o(w),C=function(e){function t(){(0,s.default)(this,t);var e=(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.scrollTo=function(){var t;return(t=e.listviewRef).scrollTo.apply(t,arguments)},e.getInnerViewNode=function(){return e.listviewRef.getInnerViewNode()},e}return(0,f.default)(t,e),(0,c.default)(t,[{key:"render",value:function(){var e=this,t=(0,S.default)(this.props,!1),n=t.restProps,o=t.extraProps;return v.default.createElement(m.default,(0,i.default)({ref:function(t){return e.listviewRef=t}},n,o))}}]),t}(v.default.Component);t.default=C,C.defaultProps={prefixCls:"am-list-view",listPrefixCls:"am-list"},C.DataSource=m.default.DataSource,C.IndexedList=_.default,e.exports=t.default},558:function(e,t,n){"use strict";function o(e){if(Array.isArray(e))return 0===e.length;if("object"==typeof e){if(e){r(e)&&void 0!==e.size&&i(!1);for(var t in e)return!1}return!0}return!e}function r(e){return"undefined"!=typeof Symbol&&e[Symbol.iterator]}var i=n(0);e.exports=o},559:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(143),i=o(r),a=n(41),s=o(a),l=n(42),c=o(l),u=n(43),d=o(u),h=n(44),f=o(h),p=n(7),v=o(p),g=n(516),m=o(g),y=n(517),S=o(y),w=m.default.IndexedList,_=function(e){function t(){return(0,s.default)(this,t),(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,f.default)(t,e),(0,c.default)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.prefixCls,o=t.listPrefixCls,r=(0,S.default)(this.props,!0),a=r.restProps,s=r.extraProps;return v.default.createElement(w,(0,i.default)({ref:function(t){return e.indexedListRef=t},sectionHeaderClassName:n+"-section-header "+o+"-body",sectionBodyClassName:n+"-section-body "+o+"-body"},a,s),this.props.children)}}]),t}(v.default.Component);t.default=_,_.defaultProps={prefixCls:"am-indexed-list",listPrefixCls:"am-list",listViewPrefixCls:"am-list-view"},e.exports=t.default},587:function(e,t,n){"use strict";n(146),n(477),n(588)},588:function(e,t){}});
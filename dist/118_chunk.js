webpackJsonp([118],{323:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e){return _.default.createElement("div",{className:"am-list-body my-body"},_.default.createElement("span",{style:{display:"none"}},"you can custom body wrap element"),e.children)}function i(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=0;t<R;t++){var n=e*R+t,r="Section "+n;k.push(r),T[r]=r,x[n]=[];for(var o=0;o<b;o++){var i="S"+n+", R"+o;x[n].push(i),T[i]=i}}k=[].concat((0,S.default)(k)),x=[].concat((0,S.default)(x))}Object.defineProperty(t,"__esModule",{value:!0});var a=n(565),s=r(a),l=n(145),c=r(l),u=n(41),d=r(u),f=n(42),h=r(f),p=n(43),v=r(p),g=n(44),m=r(g),y=n(696),S=r(y);n(568);var w=n(7),_=r(w),C=[{img:"https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png",title:"Meet hotel",des:"不是所有的兼职汪都需要风吹日晒"},{img:"https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png",title:"McDonald's invites you",des:"不是所有的兼职汪都需要风吹日晒"},{img:"https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png",title:"Eat the week",des:"不是所有的兼职汪都需要风吹日晒"}],R=5,b=5,E=0,T={},k=[],x=[],L=function(e){function t(e){(0,d.default)(this,t);var n=(0,v.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));n.onEndReached=function(e){n.state.isLoading&&!n.state.hasMore||(console.log("reach end",e),n.setState({isLoading:!0}),setTimeout(function(){i(++E),n.setState({dataSource:n.state.dataSource.cloneWithRowsAndSections(T,k,x),isLoading:!1})},1e3))};var r=function(e,t){return e[t]},o=function(e,t,n){return e[n]},a=new s.default.DataSource({getRowData:o,getSectionHeaderData:r,rowHasChanged:function(e,t){return e!==t},sectionHeaderHasChanged:function(e,t){return e!==t}});return n.state={dataSource:a,isLoading:!0,height:3*document.documentElement.clientHeight/4},n}return(0,m.default)(t,e),(0,h.default)(t,[{key:"componentDidMount",value:function(){var e=this,t=document.documentElement.clientHeight-ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;setTimeout(function(){i(),e.setState({dataSource:e.state.dataSource.cloneWithRowsAndSections(T,k,x),isLoading:!1,height:t})},600)}},{key:"render",value:function(){var e=this,t=function(e,t){return _.default.createElement("div",{key:e+"-"+t,style:{backgroundColor:"#F5F5F9",height:8,borderTop:"1px solid #ECECED",borderBottom:"1px solid #ECECED"}})},n=C.length-1,r=function(e,t,r){var o;n<0&&(n=C.length-1);var i=C[n--];return _.default.createElement("div",{key:r,style:{padding:"0 15px"}},_.default.createElement("div",{style:(o={display:"-webkit-box"},(0,c.default)(o,"display","flex"),(0,c.default)(o,"padding","15px 0"),o)},_.default.createElement("img",{style:{height:"64px",marginRight:"15px"},src:i.img,alt:""}),_.default.createElement("div",{style:{lineHeight:1}},_.default.createElement("div",{style:{marginBottom:"8px",fontWeight:"bold"}},i.des),_.default.createElement("div",null,_.default.createElement("span",{style:{fontSize:"30px",color:"#FF6E27"}},"35"),"¥ ",r))))};return _.default.createElement(s.default,{ref:function(t){return e.lv=t},dataSource:this.state.dataSource,renderFooter:function(){return _.default.createElement("div",{style:{padding:30,textAlign:"center"}},e.state.isLoading?"Loading...":"Loaded")},renderBodyComponent:function(){return _.default.createElement(o,null)},renderRow:r,renderSeparator:t,style:{height:this.state.height,overflow:"auto"},pageSize:4,onScroll:function(){console.log("scroll")},scrollRenderAheadDistance:500,onEndReached:this.onEndReached,onEndReachedThreshold:10})}}]),t}(_.default.Component);t.default=L},475:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(143),o=n.n(r),i=n(41),a=n.n(i),s=n(42),l=n.n(s),c=n(43),u=n.n(c),d=n(44),f=n.n(d),h=n(7),p=n.n(h),v=n(144),g=n.n(v),m=("undefined"!=typeof window&&window,function(e){function t(){a()(this,t);var e=u()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.state={active:!1},e.onTouchStart=function(t){e.triggerEvent("TouchStart",!0,t)},e.onTouchMove=function(t){e.triggerEvent("TouchMove",!1,t)},e.onTouchEnd=function(t){e.triggerEvent("TouchEnd",!1,t)},e.onTouchCancel=function(t){e.triggerEvent("TouchCancel",!1,t)},e.onMouseDown=function(t){e.props.onTouchStart&&e.triggerEvent("TouchStart",!0,t),e.triggerEvent("MouseDown",!0,t)},e.onMouseUp=function(t){e.props.onTouchEnd&&e.triggerEvent("TouchEnd",!1,t),e.triggerEvent("MouseUp",!1,t)},e.onMouseLeave=function(t){e.triggerEvent("MouseLeave",!1,t)},e}return f()(t,e),l()(t,[{key:"componentDidUpdate",value:function(){this.props.disabled&&this.state.active&&this.setState({active:!1})}},{key:"triggerEvent",value:function(e,t,n){var r="on"+e;this.props[r]&&this.props[r](n),this.setState({active:t})}},{key:"render",value:function(){var e=this.props,t=e.children,n=e.disabled,r=e.activeClassName,i=e.activeStyle,a=n?void 0:{onTouchStart:this.onTouchStart,onTouchMove:this.onTouchMove,onTouchEnd:this.onTouchEnd,onTouchCancel:this.onTouchCancel,onMouseDown:this.onMouseDown,onMouseUp:this.onMouseUp,onMouseLeave:this.onMouseLeave},s=p.a.Children.only(t);if(!n&&this.state.active){var l=s.props,c=l.style,u=l.className;return!1!==i&&(i&&(c=o()({},c,i)),u=g()(u,r)),p.a.cloneElement(s,o()({className:u,style:c},a))}return p.a.cloneElement(s,a)}}]),t}(p.a.Component)),y=m;m.defaultProps={disabled:!1},n.d(t,"default",function(){return y})},476:function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}},485:function(e,t,n){"use strict";n(146),n(506)},494:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(143),i=r(o),a=n(41),s=r(a),l=n(42),c=r(l),u=n(43),d=r(u),f=n(44),h=r(f),p=n(144),v=r(p),g=n(7),m=r(g),y=n(517),S=r(y),w=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&(n[r[o]]=e[r[o]]);return n},_=function(e){function t(){return(0,s.default)(this,t),(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,h.default)(t,e),(0,c.default)(t,[{key:"render",value:function(){var e=this.props,t=e.prefixCls,n=e.children,r=e.className,o=e.style,a=e.renderHeader,s=e.renderFooter,l=w(e,["prefixCls","children","className","style","renderHeader","renderFooter"]),c=(0,v.default)(t,r);return m.default.createElement("div",(0,i.default)({className:c,style:o},l),a?m.default.createElement("div",{className:t+"-header"},"function"==typeof a?a():a):null,n?m.default.createElement("div",{className:t+"-body"},n):null,s?m.default.createElement("div",{className:t+"-footer"},"function"==typeof s?s():s):null)}}]),t}(m.default.Component);t.default=_,_.Item=S.default,_.defaultProps={prefixCls:"am-list"},e.exports=t.default},506:function(e,t){},517:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.Brief=void 0;var o=n(143),i=r(o),a=n(145),s=r(a),l=n(41),c=r(l),u=n(42),d=r(u),f=n(43),h=r(f),p=n(44),v=r(p),g=n(144),m=r(g),y=n(7),S=r(y),w=n(475),_=r(w),C=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&(n[r[o]]=e[r[o]]);return n},R=t.Brief=function(e){function t(){return(0,c.default)(this,t),(0,h.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,v.default)(t,e),(0,d.default)(t,[{key:"render",value:function(){return S.default.createElement("div",{className:"am-list-brief",style:this.props.style},this.props.children)}}]),t}(S.default.Component),b=function(e){function t(e){(0,c.default)(this,t);var n=(0,h.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.onClick=function(e){var t=n.props,r=t.onClick,o=t.platform,i="android"===o;if(r&&i){n.debounceTimeout&&(clearTimeout(n.debounceTimeout),n.debounceTimeout=null);var a=e.currentTarget,s=Math.max(a.offsetHeight,a.offsetWidth),l=e.currentTarget.getBoundingClientRect(),c=e.clientX-l.left-a.offsetWidth/2,u=e.clientY-l.top-a.offsetWidth/2,d={width:s+"px",height:s+"px",left:c+"px",top:u+"px"};n.setState({coverRippleStyle:d,RippleClicked:!0},function(){n.debounceTimeout=setTimeout(function(){n.setState({coverRippleStyle:{display:"none"},RippleClicked:!1})},1e3)})}r&&r(e)},n.state={coverRippleStyle:{display:"none"},RippleClicked:!1},n}return(0,v.default)(t,e),(0,d.default)(t,[{key:"componentWillUnmount",value:function(){this.debounceTimeout&&(clearTimeout(this.debounceTimeout),this.debounceTimeout=null)}},{key:"render",value:function(){var e,t,n,r=this,o=this.props,a=o.prefixCls,l=o.className,c=o.activeStyle,u=o.error,d=o.align,f=o.wrap,h=o.disabled,p=o.children,v=o.multipleLine,g=o.thumb,y=o.extra,w=o.arrow,R=o.onClick,b=C(o,["prefixCls","className","activeStyle","error","align","wrap","disabled","children","multipleLine","thumb","extra","arrow","onClick"]),E=(b.platform,C(b,["platform"])),T=this.state,k=T.coverRippleStyle,x=T.RippleClicked,L=(0,m.default)(a+"-item",l,(e={},(0,s.default)(e,a+"-item-disabled",h),(0,s.default)(e,a+"-item-error",u),(0,s.default)(e,a+"-item-top","top"===d),(0,s.default)(e,a+"-item-middle","middle"===d),(0,s.default)(e,a+"-item-bottom","bottom"===d),e)),I=(0,m.default)(a+"-ripple",(0,s.default)({},a+"-ripple-animate",x)),H=(0,m.default)(a+"-line",(t={},(0,s.default)(t,a+"-line-multiple",v),(0,s.default)(t,a+"-line-wrap",f),t)),P=(0,m.default)(a+"-arrow",(n={},(0,s.default)(n,a+"-arrow-horizontal","horizontal"===w),(0,s.default)(n,a+"-arrow-vertical","down"===w||"up"===w),(0,s.default)(n,a+"-arrow-vertical-up","up"===w),n)),N=S.default.createElement("div",(0,i.default)({},E,{onClick:function(e){r.onClick(e)},className:L}),g?S.default.createElement("div",{className:a+"-thumb"},"string"==typeof g?S.default.createElement("img",{src:g}):g):null,S.default.createElement("div",{className:H},void 0!==p&&S.default.createElement("div",{className:a+"-content"},p),void 0!==y&&S.default.createElement("div",{className:a+"-extra"},y),w&&S.default.createElement("div",{className:P,"aria-hidden":"true"})),S.default.createElement("div",{style:k,className:I})),O={};return Object.keys(E).forEach(function(e){/onTouch/i.test(e)&&(O[e]=E[e],delete E[e])}),S.default.createElement(_.default,(0,i.default)({},O,{disabled:h||!R,activeStyle:c,activeClassName:a+"-item-active"}),N)}}]),t}(S.default.Component);b.defaultProps={prefixCls:"am-list",align:"middle",error:!1,multipleLine:!1,wrap:!1,platform:"ios"},b.Brief=R,t.default=b},524:function(e,t,n){"use strict";function r(e,t,n){return e[t][n]}function o(e,t){return e[t]}function i(e){for(var t=0,n=0;n<e.length;n++){t+=e[n].length}return t}function a(e){if(P()(e))return{};for(var t={},n=0;n<e.length;n++){var r=e[n];O()(!t[r],"Value appears more than once in array: "+r),t[r]=!0}return t}function s(e){var t=0;do{isNaN(e.offsetTop)||(t+=e.offsetTop)}while(e=e.offsetParent);return t}function l(e){return e.touches&&e.touches.length?e.touches[0]:e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e}function c(e,t){var n=!0,r=!0;return function(o){n&&(n=!1,setTimeout(function(){n=!0,e(o)},t),r&&(e(o),r=!1))}}function u(e){window.document.body.scrollTop=e,window.document.documentElement.scrollTop=e}Object.defineProperty(t,"__esModule",{value:!0});var d=n(143),f=n.n(d),h=n(476),p=n.n(h),v=n(41),g=n.n(v),m=n(42),y=n.n(m),S=n(43),w=n.n(S),_=n(44),C=n.n(_),R=n(7),b=n.n(R),E=n(9),T=n.n(E),k=n(57),x=n.n(k),L=n(0),I=n.n(L),H=n(566),P=n.n(H),N=n(15),O=n.n(N),M=function(){function e(t){g()(this,e),I()(t&&"function"==typeof t.rowHasChanged,"Must provide a rowHasChanged function."),this._rowHasChanged=t.rowHasChanged,this._getRowData=t.getRowData||r,this._sectionHeaderHasChanged=t.sectionHeaderHasChanged,this._getSectionHeaderData=t.getSectionHeaderData||o,this._dataBlob=null,this._dirtyRows=[],this._dirtySections=[],this._cachedRowCount=0,this.rowIdentities=[],this.sectionIdentities=[]}return y()(e,[{key:"cloneWithRows",value:function(e,t){var n=t?[t]:null;return this._sectionHeaderHasChanged||(this._sectionHeaderHasChanged=function(){return!1}),this.cloneWithRowsAndSections({s1:e},["s1"],n)}},{key:"cloneWithRowsAndSections",value:function(t,n,r){I()("function"==typeof this._sectionHeaderHasChanged,"Must provide a sectionHeaderHasChanged function with section data."),I()(!n||!r||n.length===r.length,"row and section ids lengths must be the same");var o=new e({getRowData:this._getRowData,getSectionHeaderData:this._getSectionHeaderData,rowHasChanged:this._rowHasChanged,sectionHeaderHasChanged:this._sectionHeaderHasChanged});return o._dataBlob=t,o.sectionIdentities=n||Object.keys(t),r?o.rowIdentities=r:(o.rowIdentities=[],o.sectionIdentities.forEach(function(e){o.rowIdentities.push(Object.keys(t[e]))})),o._cachedRowCount=i(o.rowIdentities),o._calculateDirtyArrays(this._dataBlob,this.sectionIdentities,this.rowIdentities),o}},{key:"getRowCount",value:function(){return this._cachedRowCount}},{key:"getRowAndSectionCount",value:function(){return this._cachedRowCount+this.sectionIdentities.length}},{key:"rowShouldUpdate",value:function(e,t){var n=this._dirtyRows[e][t];return O()(void 0!==n,"missing dirtyBit for section, row: "+e+", "+t),n}},{key:"getRowData",value:function(e,t){var n=this.sectionIdentities[e],r=this.rowIdentities[e][t];return O()(void 0!==n&&void 0!==r,"rendering invalid section, row: "+e+", "+t),this._getRowData(this._dataBlob,n,r)}},{key:"getRowIDForFlatIndex",value:function(e){for(var t=e,n=0;n<this.sectionIdentities.length;n++){if(!(t>=this.rowIdentities[n].length))return this.rowIdentities[n][t];t-=this.rowIdentities[n].length}return null}},{key:"getSectionIDForFlatIndex",value:function(e){for(var t=e,n=0;n<this.sectionIdentities.length;n++){if(!(t>=this.rowIdentities[n].length))return this.sectionIdentities[n];t-=this.rowIdentities[n].length}return null}},{key:"getSectionLengths",value:function(){for(var e=[],t=0;t<this.sectionIdentities.length;t++)e.push(this.rowIdentities[t].length);return e}},{key:"sectionHeaderShouldUpdate",value:function(e){var t=this._dirtySections[e];return O()(void 0!==t,"missing dirtyBit for section: "+e),t}},{key:"getSectionHeaderData",value:function(e){if(!this._getSectionHeaderData)return null;var t=this.sectionIdentities[e];return O()(void 0!==t,"renderSection called on invalid section: "+e),this._getSectionHeaderData(this._dataBlob,t)}},{key:"_calculateDirtyArrays",value:function(e,t,n){for(var r=a(t),o={},i=0;i<n.length;i++){var s=t[i];O()(!o[s],"SectionID appears more than once: "+s),o[s]=a(n[i])}this._dirtySections=[],this._dirtyRows=[];for(var l,c=0;c<this.sectionIdentities.length;c++){var s=this.sectionIdentities[c];l=!r[s];var u=this._sectionHeaderHasChanged;!l&&u&&(l=u(this._getSectionHeaderData(e,s),this._getSectionHeaderData(this._dataBlob,s))),this._dirtySections.push(!!l),this._dirtyRows[c]=[];for(var d=0;d<this.rowIdentities[c].length;d++){var f=this.rowIdentities[c][d];l=!r[s]||!o[s][f]||this._rowHasChanged(this._getRowData(e,s,f),this._getRowData(this._dataBlob,s,f)),this._dirtyRows[c].push(!!l)}}}}]),e}(),D=M,B=n(144),j=n.n(B),z={className:T.a.string,prefixCls:T.a.string,listPrefixCls:T.a.string,listViewPrefixCls:T.a.string,style:T.a.object,contentContainerStyle:T.a.object,onScroll:T.a.func},V=function(e){function t(){var e,n,r,o;g()(this,t);for(var i=arguments.length,a=Array(i),s=0;s<i;s++)a[s]=arguments[s];return n=r=w()(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(a))),A.call(r),o=n,w()(r,o)}return C()(t,e),y()(t,[{key:"componentWillUpdate",value:function(e){this.props.dataSource===e.dataSource&&this.props.initialListSize===e.initialListSize||!this.handleScroll||(this.props.useBodyScroll?window.removeEventListener("scroll",this.handleScroll):this.ScrollViewRef.removeEventListener("scroll",this.handleScroll))}},{key:"componentDidUpdate",value:function(e){var t=this;this.props.dataSource===e.dataSource&&this.props.initialListSize===e.initialListSize||!this.handleScroll||setTimeout(function(){t.props.useBodyScroll?window.addEventListener("scroll",t.handleScroll):t.ScrollViewRef.addEventListener("scroll",t.handleScroll)},0)}},{key:"componentDidMount",value:function(){var e=this,t=function(t){return e.props.onScroll&&e.props.onScroll(t,e.getMetrics())};this.props.scrollEventThrottle&&(t=c(t,this.props.scrollEventThrottle)),this.handleScroll=t,this.onLayout=function(){return e.props.onLayout({nativeEvent:{layout:{width:window.innerWidth,height:window.innerHeight}}})},this.props.useBodyScroll?(window.addEventListener("scroll",this.handleScroll),window.addEventListener("resize",this.onLayout)):this.ScrollViewRef.addEventListener("scroll",this.handleScroll)}},{key:"componentWillUnmount",value:function(){this.props.useBodyScroll?(window.removeEventListener("scroll",this.handleScroll),window.removeEventListener("resize",this.onLayout)):this.ScrollViewRef.removeEventListener("scroll",this.handleScroll)}},{key:"render",value:function(){var e=this,t=this.props,n=t.children,r=t.className,o=t.prefixCls,i=t.listPrefixCls,a=t.listViewPrefixCls,s=t.style,l=void 0===s?{}:s,c=t.contentContainerStyle,u=void 0===c?{}:c,d=t.useBodyScroll,h=t.pullToRefresh,p={position:"relative",overflow:"auto",WebkitOverflowScrolling:"touch"},v=o||a||"",g={ref:function(t){return e.ScrollViewRef=t||e.ScrollViewRef},style:f()({},d?{}:p,l),className:j()(r,v+"-scrollview")},m={ref:function(t){return e.InnerScrollViewRef=t},style:f()({position:"absolute",minWidth:"100%"},u),className:j()(v+"-scrollview-content",i)},y=function(t){return b.a.cloneElement(h,{getScrollContainer:t?function(){return document.body}:function(){return e.ScrollViewRef}},n)};return d?h?b.a.createElement("div",g,y(!0)):b.a.createElement("div",g,n):h?b.a.createElement("div",g,b.a.createElement("div",m,y())):b.a.createElement("div",g,b.a.createElement("div",m,n))}}]),t}(b.a.Component);V.propTypes=z;var A=function(){var e=this;this.getMetrics=function(){var t=!e.props.horizontal;if(e.props.useBodyScroll){var n=document.scrollingElement?document.scrollingElement:document.body;return{visibleLength:window[t?"innerHeight":"innerWidth"],contentLength:e.ScrollViewRef?e.ScrollViewRef[t?"scrollHeight":"scrollWidth"]:0,offset:n[t?"scrollTop":"scrollLeft"]}}return{visibleLength:e.ScrollViewRef[t?"offsetHeight":"offsetWidth"],contentLength:e.ScrollViewRef[t?"scrollHeight":"scrollWidth"],offset:e.ScrollViewRef[t?"scrollTop":"scrollLeft"]}},this.getInnerViewNode=function(){return e.InnerScrollViewRef},this.scrollTo=function(){if(e.props.useBodyScroll){var t;(t=window).scrollTo.apply(t,arguments)}else e.ScrollViewRef.scrollLeft=arguments.length<=0?void 0:arguments[0],e.ScrollViewRef.scrollTop=arguments.length<=1?void 0:arguments[1]}},q=V,W=function(e){function t(){return g()(this,t),w()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return C()(t,e),y()(t,[{key:"shouldComponentUpdate",value:function(e){return e.shouldUpdate}},{key:"render",value:function(){return this.props.render()}}]),t}(b.a.Component),F=function(e){function t(){var e,n,r,o;g()(this,t);for(var i=arguments.length,a=Array(i),s=0;s<i;s++)a[s]=arguments[s];return n=r=w()(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(a))),Q.call(r),o=n,w()(r,o)}return C()(t,e),y()(t,[{key:"componentWillMount",value:function(){this.scrollProperties={visibleLength:null,contentLength:null,offset:0},this._childFrames=[],this._visibleRows={},this._prevRenderedRowsCount=0,this._sentEndForContentLength=null}},{key:"componentWillReceiveProps",value:function(e){var t=this;this.props.dataSource===e.dataSource&&this.props.initialListSize===e.initialListSize||this.setState(function(n,r){return t._prevRenderedRowsCount=0,{curRenderedRowsCount:Math.min(Math.max(n.curRenderedRowsCount,e.initialListSize),e.dataSource.getRowCount())}},function(){return t._renderMoreRowsIfNeeded()})}},{key:"render",value:function(){for(var e=this,t=this.props.dataSource,n=t.rowIdentities,r=[],o=0,i=0;i<n.length;i++){var a=t.sectionIdentities[i],s=n[i];if(0!==s.length){var l=void 0;if(this.props.renderSectionHeader){var c=o>=this._prevRenderedRowsCount&&t.sectionHeaderShouldUpdate(i);l=b.a.createElement(W,{key:"s_"+a,shouldUpdate:!!c,render:this.props.renderSectionHeader.bind(null,t.getSectionHeaderData(i),a)})}for(var u=[],d=0;d<s.length;d++){var h=s[d],v=a+"_"+h,g=o>=this._prevRenderedRowsCount&&t.rowShouldUpdate(i,d),m=b.a.createElement(W,{key:"r_"+v,shouldUpdate:!!g,render:this.props.renderRow.bind(null,t.getRowData(i,d),a,h,this.onRowHighlighted)});if(u.push(m),this.props.renderSeparator&&(d!==s.length-1||i===n.length-1)){var y=this.state.highlightedRow.sectionID===a&&(this.state.highlightedRow.rowID===h||this.state.highlightedRow.rowID===s[d+1]),S=this.props.renderSeparator(a,h,y);S&&u.push(S)}if(++o===this.state.curRenderedRowsCount)break}var w=b.a.cloneElement(this.props.renderSectionBodyWrapper(a),{className:this.props.sectionBodyClassName},u);if(this.props.renderSectionWrapper?r.push(b.a.cloneElement(this.props.renderSectionWrapper(a),{},l,w)):(r.push(l),r.push(w)),o>=this.state.curRenderedRowsCount)break}}var _=this.props,C=_.renderScrollComponent,R=p()(_,["renderScrollComponent"]);return b.a.cloneElement(C(f()({},R,{onScroll:this._onScroll})),{ref:function(t){return e.ListViewRef=t},onContentSizeChange:this._onContentSizeChange,onLayout:this._onLayout},this.props.renderHeader?this.props.renderHeader():null,b.a.cloneElement(R.renderBodyComponent(),{},r),this.props.renderFooter?this.props.renderFooter():null,R.children)}}]),t}(b.a.Component);F.DataSource=D,F.propTypes=f()({},q.propTypes,{dataSource:T.a.instanceOf(D).isRequired,renderSeparator:T.a.func,renderRow:T.a.func.isRequired,initialListSize:T.a.number,onEndReached:T.a.func,onEndReachedThreshold:T.a.number,pageSize:T.a.number,renderFooter:T.a.func,renderHeader:T.a.func,renderSectionHeader:T.a.func,renderScrollComponent:T.a.func,scrollRenderAheadDistance:T.a.number,onChangeVisibleRows:T.a.func,scrollEventThrottle:T.a.number,renderBodyComponent:T.a.func,renderSectionWrapper:T.a.func,renderSectionBodyWrapper:T.a.func,sectionBodyClassName:T.a.string,listViewPrefixCls:T.a.string,useBodyScroll:T.a.bool}),F.defaultProps={initialListSize:10,pageSize:1,renderScrollComponent:function(e){return b.a.createElement(q,e)},renderBodyComponent:function(){return b.a.createElement("div",null)},renderSectionBodyWrapper:function(e){return b.a.createElement("div",{key:e})},sectionBodyClassName:"list-view-section-body",listViewPrefixCls:"rmc-list-view",scrollRenderAheadDistance:1e3,onEndReachedThreshold:1e3,scrollEventThrottle:50,scrollerOptions:{}};var Q=function(){var e=this;this.state={curRenderedRowsCount:this.props.initialListSize,highlightedRow:{}},this.getMetrics=function(){return{contentLength:e.scrollProperties.contentLength,totalRows:e.props.dataSource.getRowCount(),renderedRows:e.state.curRenderedRowsCount,visibleRows:Object.keys(e._visibleRows).length}},this.getInnerViewNode=function(){return e.ListViewRef.getInnerViewNode()},this.scrollTo=function(){var t;e.ListViewRef&&e.ListViewRef.scrollTo&&(t=e.ListViewRef).scrollTo.apply(t,arguments)},this.onRowHighlighted=function(t,n){e.setState({highlightedRow:{sectionID:t,rowID:n}})},this._onContentSizeChange=function(t,n){var r=e.props.horizontal?t:n;r!==e.scrollProperties.contentLength&&(e.scrollProperties.contentLength=r,e._renderMoreRowsIfNeeded()),e.props.onContentSizeChange&&e.props.onContentSizeChange(t,n)},this._onLayout=function(t){var n=t.nativeEvent.layout,r=n.width,o=n.height,i=e.props.horizontal?r:o;i!==e.scrollProperties.visibleLength&&(e.scrollProperties.visibleLength=i,e._renderMoreRowsIfNeeded()),e.props.onLayout&&e.props.onLayout(t)},this._maybeCallOnEndReached=function(t){return!!(e.props.onEndReached&&e.scrollProperties.contentLength!==e._sentEndForContentLength&&e._getDistanceFromEnd(e.scrollProperties)<e.props.onEndReachedThreshold&&e.state.curRenderedRowsCount===e.props.dataSource.getRowCount())&&(e._sentEndForContentLength=e.scrollProperties.contentLength,e.props.onEndReached(t),!0)},this._renderMoreRowsIfNeeded=function(){if(null===e.scrollProperties.contentLength||null===e.scrollProperties.visibleLength||e.state.curRenderedRowsCount===e.props.dataSource.getRowCount())return void e._maybeCallOnEndReached();e._getDistanceFromEnd(e.scrollProperties)<e.props.scrollRenderAheadDistance&&e._pageInNewRows()},this._pageInNewRows=function(){e.setState(function(t,n){var r=Math.min(t.curRenderedRowsCount+n.pageSize,n.dataSource.getRowCount());return e._prevRenderedRowsCount=t.curRenderedRowsCount,{curRenderedRowsCount:r}},function(){e._prevRenderedRowsCount=e.state.curRenderedRowsCount})},this._getDistanceFromEnd=function(e){return e.contentLength-e.visibleLength-e.offset},this._onScroll=function(t,n){e.ListViewRef&&(e.scrollProperties=n,e._maybeCallOnEndReached(t)||e._renderMoreRowsIfNeeded(),e.props.onEndReached&&e._getDistanceFromEnd(e.scrollProperties)>e.props.onEndReachedThreshold&&(e._sentEndForContentLength=null),e.props.onScroll&&e.props.onScroll(t))}},U=F,Y=n(145),X=n.n(Y),J=function(e){function t(e){g()(this,t);var n=w()(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return K.call(n),n.state={pageSize:e.pageSize,_delay:!1},n}return C()(t,e),y()(t,[{key:"componentDidMount",value:function(){this.dataChange(this.props),this.getQsInfo()}},{key:"componentWillReceiveProps",value:function(e){this.props.dataSource!==e.dataSource&&this.dataChange(e)}},{key:"componentDidUpdate",value:function(){this.getQsInfo()}},{key:"componentWillUnmount",value:function(){this._timer&&clearTimeout(this._timer),this._hCache=null}},{key:"renderQuickSearchBar",value:function(e,t){var n=this,r=this.props,o=r.dataSource,i=r.prefixCls,a=o.sectionIdentities.map(function(e){return{value:e,label:o._getSectionHeaderData(o._dataBlob,e)}});return b.a.createElement("ul",{ref:function(e){return n.quickSearchBarRef=e},className:i+"-quick-search-bar",style:t,onTouchStart:this.onTouchStart,onTouchMove:this.onTouchMove,onTouchEnd:this.onTouchEnd,onTouchCancel:this.onTouchEnd},b.a.createElement("li",{"data-qf-target":e.value,onClick:function(){return n.onQuickSearchTop(void 0,e.value)}},e.label),a.map(function(e){return b.a.createElement("li",{key:e.value,"data-qf-target":e.value,onClick:function(){return n.onQuickSearch(e.value)}},e.label)}))}},{key:"render",value:function(){var e,t=this,n=this.state,r=n._delay,o=n.pageSize,i=this.props,a=i.className,s=i.prefixCls,l=i.children,c=i.quickSearchBarTop,u=i.quickSearchBarStyle,d=i.initialListSize,h=void 0===d?Math.min(20,this.props.dataSource.getRowCount()):d,v=i.showQuickSearchIndicator,g=i.renderSectionHeader,m=i.sectionHeaderClassName,y=p()(i,["className","prefixCls","children","quickSearchBarTop","quickSearchBarStyle","initialListSize","showQuickSearchIndicator","renderSectionHeader","sectionHeaderClassName"]);return b.a.createElement("div",{className:s+"-container"},r&&this.props.delayActivityIndicator,b.a.createElement(U,f()({},y,{ref:function(e){return t.indexedListViewRef=e},className:j()(s,a),initialListSize:h,pageSize:o,renderSectionHeader:function(e,n){return b.a.cloneElement(g(e,n),{ref:function(e){return t.sectionComponents[n]=e},className:m||s+"-section-header"})}}),l),this.renderQuickSearchBar(c,u),v?b.a.createElement("div",{className:j()((e={},X()(e,s+"-qsindicator",!0),X()(e,s+"-qsindicator-hide",!v||!this.state.showQuickSearchIndicator),e)),ref:function(e){return t.qsIndicatorRef=e}}):null)}}]),t}(b.a.Component);J.propTypes=f()({},U.propTypes,{children:T.a.any,prefixCls:T.a.string,className:T.a.string,sectionHeaderClassName:T.a.string,quickSearchBarTop:T.a.object,quickSearchBarStyle:T.a.object,onQuickSearch:T.a.func,showQuickSearchIndicator:T.a.bool}),J.defaultProps={prefixCls:"rmc-indexed-list",quickSearchBarTop:{value:"#",label:"#"},onQuickSearch:function(){},showQuickSearchIndicator:!1,delayTime:100,delayActivityIndicator:""};var K=function(){var e=this;this.onQuickSearchTop=function(t,n){e.props.useBodyScroll?u(0):x.a.findDOMNode(e.indexedListViewRef.ListViewRef).scrollTop=0,e.props.onQuickSearch(t,n)},this.onQuickSearch=function(t){var n=x.a.findDOMNode(e.indexedListViewRef.ListViewRef),r=x.a.findDOMNode(e.sectionComponents[t]);e.props.useBodyScroll?u(r.getBoundingClientRect().top-n.getBoundingClientRect().top+s(n)):n.scrollTop+=r.getBoundingClientRect().top-n.getBoundingClientRect().top,e.props.onQuickSearch(t)},this.onTouchStart=function(t){e._target=t.target,e._basePos=e.quickSearchBarRef.getBoundingClientRect(),document.addEventListener("touchmove",e._disableParent,!1),document.body.className=document.body.className+" "+e.props.prefixCls+"-qsb-moving",e.updateIndicator(e._target)},this.onTouchMove=function(t){if(t.preventDefault(),e._target){var n=l(t),r=e._basePos,o=void 0;if(n.clientY>=r.top&&n.clientY<=r.top+e._qsHeight){o=Math.floor((n.clientY-r.top)/e._avgH);var i=void 0;if(o in e._hCache&&(i=e._hCache[o][0]),i){var a=i.getAttribute("data-qf-target");e._target!==i&&(e.props.quickSearchBarTop.value===a?e.onQuickSearchTop(void 0,a):e.onQuickSearch(a),e.updateIndicator(i)),e._target=i}}}},this.onTouchEnd=function(){e._target&&(document.removeEventListener("touchmove",e._disableParent,!1),document.body.className=document.body.className.replace(new RegExp("\\s*"+e.props.prefixCls+"-qsb-moving","g"),""),e.updateIndicator(e._target,!0),e._target=null)},this.getQsInfo=function(){var t=e.quickSearchBarRef,n=t.offsetHeight,r=[];[].slice.call(t.querySelectorAll("[data-qf-target]")).forEach(function(e){r.push([e])});for(var o=n/r.length,i=0,a=0,s=r.length;a<s;a++)i=a*o,r[a][1]=[i,i+o];e._qsHeight=n,e._avgH=o,e._hCache=r},this.sectionComponents={},this.dataChange=function(t){var n=t.dataSource.getRowCount();n&&(e.setState({_delay:!0}),e._timer&&clearTimeout(e._timer),e._timer=setTimeout(function(){e.setState({pageSize:n,_delay:!1},function(){return e.indexedListViewRef._pageInNewRows()})},t.delayTime))},this.updateIndicator=function(t,n){var r=t;r.getAttribute("data-qf-target")||(r=r.parentNode),e.props.showQuickSearchIndicator&&(e.qsIndicatorRef.innerText=r.innerText.trim(),e.setState({showQuickSearchIndicator:!0}),e._indicatorTimer&&clearTimeout(e._indicatorTimer),e._indicatorTimer=setTimeout(function(){e.setState({showQuickSearchIndicator:!1})},1e3));var o=e.props.prefixCls+"-quick-search-bar-over";e._hCache.forEach(function(e){e[0].className=e[0].className.replace(o,"")}),n||(r.className=r.className+" "+o)},this._disableParent=function(e){e.preventDefault(),e.stopPropagation()}},Z=J;n.d(t,"DataSource",function(){return G}),n.d(t,"IndexedList",function(){return Z}),U.IndexedList=Z;var G=U.DataSource;t.default=U},525:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n=e.renderHeader,r=e.renderFooter,o=e.renderSectionHeader,i=e.renderBodyComponent,s=c(e,["renderHeader","renderFooter","renderSectionHeader","renderBodyComponent"]),l=e.listPrefixCls,d={renderHeader:null,renderFooter:null,renderSectionHeader:null,renderBodyComponent:i||function(){return a.default.createElement("div",{className:l+"-body"})}};return n&&(d.renderHeader=function(){return a.default.createElement("div",{className:l+"-header"},n())}),r&&(d.renderFooter=function(){return a.default.createElement("div",{className:l+"-footer"},r())}),o&&(d.renderSectionHeader=t?function(e,t){return a.default.createElement("div",null,a.default.createElement(u,{prefixCls:l},o(e,t)))}:function(e,t){return a.default.createElement(u,{prefixCls:l},o(e,t))}),{restProps:s,extraProps:d}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o;var i=n(7),a=r(i),s=n(494),l=r(s),c=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&(n[r[o]]=e[r[o]]);return n},u=l.default.Item;e.exports=t.default},565:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(143),i=r(o),a=n(41),s=r(a),l=n(42),c=r(l),u=n(43),d=r(u),f=n(44),h=r(f),p=n(7),v=r(p),g=n(524),m=r(g),y=n(525),S=r(y),w=n(567),_=r(w),C=function(e){function t(){(0,s.default)(this,t);var e=(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.scrollTo=function(){var t;return(t=e.listviewRef).scrollTo.apply(t,arguments)},e.getInnerViewNode=function(){return e.listviewRef.getInnerViewNode()},e}return(0,h.default)(t,e),(0,c.default)(t,[{key:"render",value:function(){var e=this,t=(0,S.default)(this.props,!1),n=t.restProps,r=t.extraProps;return v.default.createElement(m.default,(0,i.default)({ref:function(t){return e.listviewRef=t}},n,r))}}]),t}(v.default.Component);t.default=C,C.defaultProps={prefixCls:"am-list-view",listPrefixCls:"am-list"},C.DataSource=m.default.DataSource,C.IndexedList=_.default,e.exports=t.default},566:function(e,t,n){"use strict";function r(e){if(Array.isArray(e))return 0===e.length;if("object"==typeof e){if(e){o(e)&&void 0!==e.size&&i(!1);for(var t in e)return!1}return!0}return!e}function o(e){return"undefined"!=typeof Symbol&&e[Symbol.iterator]}var i=n(0);e.exports=r},567:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(143),i=r(o),a=n(41),s=r(a),l=n(42),c=r(l),u=n(43),d=r(u),f=n(44),h=r(f),p=n(7),v=r(p),g=n(524),m=r(g),y=n(525),S=r(y),w=m.default.IndexedList,_=function(e){function t(){return(0,s.default)(this,t),(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,h.default)(t,e),(0,c.default)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.prefixCls,r=t.listPrefixCls,o=(0,S.default)(this.props,!0),a=o.restProps,s=o.extraProps;return v.default.createElement(w,(0,i.default)({ref:function(t){return e.indexedListRef=t},sectionHeaderClassName:n+"-section-header "+r+"-body",sectionBodyClassName:n+"-section-body "+r+"-body"},a,s),this.props.children)}}]),t}(v.default.Component);t.default=_,_.defaultProps={prefixCls:"am-indexed-list",listPrefixCls:"am-list",listViewPrefixCls:"am-list-view"},e.exports=t.default},568:function(e,t,n){"use strict";n(146),n(485),n(569)},569:function(e,t){},696:function(e,t,n){"use strict";t.__esModule=!0;var r=n(705),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return(0,o.default)(e)}},705:function(e,t,n){e.exports={default:n(706),__esModule:!0}},706:function(e,t,n){n(147),n(707),e.exports=n(18).Array.from},707:function(e,t,n){"use strict";var r=n(95),o=n(24),i=n(94),a=n(708),s=n(709),l=n(148),c=n(710),u=n(711);o(o.S+o.F*!n(713)(function(e){Array.from(e)}),"Array",{from:function(e){var t,n,o,d,f=i(e),h="function"==typeof this?this:Array,p=arguments.length,v=p>1?arguments[1]:void 0,g=void 0!==v,m=0,y=u(f);if(g&&(v=r(v,p>2?arguments[2]:void 0,2)),void 0==y||h==Array&&s(y))for(t=l(f.length),n=new h(t);t>m;m++)c(n,m,g?v(f[m],m):f[m]);else for(d=y.call(f),n=new h;!(o=d.next()).done;m++)c(n,m,g?a(d,v,[o.value,m],!0):o.value);return n.length=m,n}})},708:function(e,t,n){var r=n(34);e.exports=function(e,t,n,o){try{return o?t(r(n)[0],n[1]):t(n)}catch(t){var i=e.return;throw void 0!==i&&r(i.call(e)),t}}},709:function(e,t,n){var r=n(59),o=n(23)("iterator"),i=Array.prototype;e.exports=function(e){return void 0!==e&&(r.Array===e||i[o]===e)}},710:function(e,t,n){"use strict";var r=n(19),o=n(45);e.exports=function(e,t,n){t in e?r.f(e,t,o(0,n)):e[t]=n}},711:function(e,t,n){var r=n(712),o=n(23)("iterator"),i=n(59);e.exports=n(18).getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[r(e)]}},712:function(e,t,n){var r=n(96),o=n(23)("toStringTag"),i="Arguments"==r(function(){return arguments}()),a=function(e,t){try{return e[t]}catch(e){}};e.exports=function(e){var t,n,s;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=a(t=Object(e),o))?n:i?r(t):"Object"==(s=r(t))&&"function"==typeof t.callee?"Arguments":s}},713:function(e,t,n){var r=n(23)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!o)return!1;var n=!1;try{var i=[7],a=i[r]();a.next=function(){return{done:n=!0}},i[r]=function(){return a},e(i)}catch(e){}return n}}});
webpackJsonp([126],{1176:function(e,t){},447:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(483),r=a(i),o=n(41),l=a(o),c=n(42),s=a(c),u=n(43),d=a(u),f=n(44),h=a(f);n(484);var m=n(7),p=a(m);n(1176);var v=function(e){function t(e){(0,l.default)(this,t);var n=(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.getStructureRoleUserByUserId=function(e){var t=n,a={method:"getStructureRoleUserByUserId",userId:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(a),{onResponse:function(e){if("调用成功"==e.msg||1==e.success){0!==e.response.filter(function(e){return 6==e.type}).length&&t.setState({classTeacher:!0})}},onError:function(e){}})},n.toClient=function(e){var t={method:e,ident:n.state.ident};"openNativePage_Errorbook"==e&&(t.href="http://jiaoxue.maaee.com:8094/#/topicWrongList?userId="),console.log(t,"data"),Bridge.callHandler(t,null,function(e){})},n.toPage=function(e){var t;if("ReviewStatistics"==e)t="http://jiaoxue.maaee.com:8093/#/cloudSchoolClassesStatistical?ident="+n.state.ident+"&judgelag=1";else if("Approval"==e)t="http://www.maaee.com:80/Excoord_PhoneService/flowGroup/getAllFlowGroupBySchoolId/"+n.state.schoolId+"/"+n.state.ident;else if("Attendance"==e)t="https://www.maaee.com/Excoord_PhoneService/attendance/recordCard/"+n.state.ident;else if("HomeworkFaceStatistics"==e)t="http://jiaoxue.maaee.com:8093/#/HomeWorkUnderstandAnalysisGuideByNoom?access_user="+n.state.ident;else if("openNativePage_RingDataStatistics"==e)t="http://jiaoxue.maaee.com:8093/#/analysisHomePage";else{if("honorManage"==e)return void r.default.info("请在浏览器中的小蚂蚁教师端完成该功能",3);if("demeanorManage"==e)return void r.default.info("请在浏览器中的小蚂蚁教师端完成该功能",3);"dutyManage"==e?t="http://jiaoxue.maaee.com:8091/#/clazzDutyList?access_user="+n.state.ident:"notifyManage"==e&&(t="http://jiaoxue.maaee.com:8091/#/notifyBack?access_user="+n.state.ident)}var a={method:"openNewPage",url:t};Bridge.callHandler(a,null,function(e){window.location.href=t})},n.state={phone:"IOS",classTeacher:!1},n}return(0,h.default)(t,e),(0,s.default)(t,[{key:"componentDidMount",value:function(){try{Bridge.setRefreshAble("false")}catch(e){console.log(e)}var e=decodeURI(window.location.href),t=e.substr(e.indexOf("?")+1),n=t.split("&"),a=decodeURI(n[0].split("=")[1]);this.setState({ident:a}),this.getUserById(a),this.getStructureRoleUserByUserId(a);var i=navigator.userAgent;i.indexOf("iPhone")>-1||i.indexOf("iPad")>-1?this.setState({phone:"IOS"}):this.setState({phone:"Android"})}},{key:"getUserById",value:function(e){var t=this,n={method:"getUserById",ident:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(n),{onResponse:function(e){"调用成功"!=e.msg&&1!=e.success||t.setState({schoolId:e.response.schoolId})},onError:function(e){}})}},{key:"render",value:function(){return p.default.createElement("div",{id:"teachingSpaceTeacher"},p.default.createElement("div",{className:"teacher-item"},p.default.createElement("h1",null,"常用"),p.default.createElement("ul",{className:"my_flex teacherUl"},p.default.createElement("li",{onClick:this.toPage.bind(this,"Approval")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-approval"}),p.default.createElement("div",null,"审批")),p.default.createElement("li",{onClick:this.toPage.bind(this,"Attendance")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-attendance"}),p.default.createElement("div",null,"考勤")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_AntPlate")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-antDisk"}),p.default.createElement("div",null,"蚁盘")))),p.default.createElement("div",{className:"teacher-item"},p.default.createElement("h1",null,"开启课堂"),p.default.createElement("ul",{className:"my_flex teacherUl"},p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_OpenClassRoom")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-classroom"}),p.default.createElement("div",null,"开启班级课堂")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_OpenLiveBroadcast")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-live"}),p.default.createElement("div",null,"开启直播")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_OpenCloudClass")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-eSchool"}),p.default.createElement("div",null,"开启云课堂")))),p.default.createElement("div",{className:"teacher-item"},p.default.createElement("h1",null,"课前准备"),p.default.createElement("ul",{className:"my_flex teacherUl"},p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_LessonPlan")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-plan"}),p.default.createElement("div",null,"备课计划")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_ResourceLibrary")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-repository"}),p.default.createElement("div",null,"资源库")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_TopicLibrary")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-questionBank"}),p.default.createElement("div",null,"题库")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_Examine")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-survey"}),p.default.createElement("div",null,"调查")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_BraceletOutdoorHelper")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-bracelet"}),p.default.createElement("div",null,"手环户外助手")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_FamousTeacherSpace"),style:{display:"Android"==this.state.phone?"block":"none"}},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-famousTeacher"}),p.default.createElement("div",null,"名师空间")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_MicroClassRecord"),style:{display:"Android"==this.state.phone?"block":"none"}},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-SmallClass"}),p.default.createElement("div",null,"录制微课")))),p.default.createElement("div",{className:"teacher-item"},p.default.createElement("h1",null,"数据中心"),p.default.createElement("ul",{className:"my_flex teacherUl"},p.default.createElement("li",{onClick:this.toPage.bind(this,"ReviewStatistics")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-ClassReview"}),p.default.createElement("div",null,"课堂回顾统计")),p.default.createElement("li",{onClick:this.toPage.bind(this,"openNativePage_RingDataStatistics")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-braceletData"}),p.default.createElement("div",null,"手环数据统计")))),p.default.createElement("div",{className:"teacher-item"},p.default.createElement("h1",null,"作业"),p.default.createElement("ul",{className:"my_flex teacherUl"},p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_HomeworkAssignment")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-AssignHomework"}),p.default.createElement("div",null,"布置作业")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_HomeworkStatistics")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-homeworkStatistics"}),p.default.createElement("div",null,"作业统计")),p.default.createElement("li",{onClick:this.toPage.bind(this,"HomeworkFaceStatistics")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-expression"}),p.default.createElement("div",null,"作业表情统计")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_HomeworkCorrecting"),style:{display:"Android"==this.state.phone?"block":"none"}},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-homeworkCorrecting"}),p.default.createElement("div",null,"批改作业")),p.default.createElement("li",{style:{display:23836==this.state.ident||54208==this.state.ident||119665==this.state.ident?"":"none"},onClick:this.toClient.bind(this,"openNativePage_Errorbook")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-wrongBook"}),p.default.createElement("div",null,"错题本")))),p.default.createElement("div",{className:"teacher-item",style:{display:"Android"==this.state.phone?"block":"none"}},p.default.createElement("h1",null,"考试系统"),p.default.createElement("ul",{className:"my_flex teacherUl"},p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_TestPaper")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-testPaper"}),p.default.createElement("div",null,"组卷")),p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_Examination")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-examination"}),p.default.createElement("div",null,"考试")))),p.default.createElement("div",{className:"teacher-item"},p.default.createElement("h1",null,"其它"),p.default.createElement("ul",{className:"my_flex teacherUl"},p.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_EducationalAdministration")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-EducationManage"}),p.default.createElement("div",null,"教务管理")),p.default.createElement("li",{style:{display:this.state.classTeacher?"":"none"},onClick:this.toPage.bind(this,"honorManage")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-honorManage"}),p.default.createElement("div",null,"班牌荣誉")),p.default.createElement("li",{style:{display:this.state.classTeacher?"":"none"},onClick:this.toPage.bind(this,"demeanorManage")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-demeanorManage"}),p.default.createElement("div",null,"班牌风采")),p.default.createElement("li",{style:{display:this.state.classTeacher?"":"none"},onClick:this.toPage.bind(this,"notifyManage")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-notifyManage"}),p.default.createElement("div",null,"班牌通知")),p.default.createElement("li",{style:{display:this.state.classTeacher?"":"none"},onClick:this.toPage.bind(this,"dutyManage")},p.default.createElement("i",{className:"Icon-teacher Icon-teacher-dutyManage"}),p.default.createElement("div",null,"班牌值日")))))}}]),t}(p.default.Component);t.default=v},467:function(e,t){e.exports=function(e,t){if(e.indexOf)return e.indexOf(t);for(var n=0;n<e.length;++n)if(e[n]===t)return n;return-1}},468:function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){var n={};for(var a in e)t.indexOf(a)>=0||Object.prototype.hasOwnProperty.call(e,a)&&(n[a]=e[a]);return n}},469:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(143),r=a(i),o=n(41),l=a(o),c=n(42),s=a(c),u=n(43),d=a(u),f=n(44),h=a(f),m=n(144),p=a(m),v=n(7),E=a(v),y=n(479),g=a(y),k=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&(n[a[i]]=e[a[i]]);return n},b=function(e){function t(){return(0,l.default)(this,t),(0,d.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,h.default)(t,e),(0,s.default)(t,[{key:"componentDidMount",value:function(){(0,g.default)()}},{key:"render",value:function(){var e=this.props,t=e.type,n=e.className,a=e.size,i=k(e,["type","className","size"]),o=(0,p.default)(n,"am-icon","am-icon-"+t,"am-icon-"+a);return E.default.createElement("svg",(0,r.default)({className:o},i),E.default.createElement("use",{xlinkHref:"#"+t}))}}]),t}(E.default.Component);t.default=b,b.defaultProps={size:"md"},e.exports=t.default},470:function(e,t,n){"use strict";n(480)},472:function(e,t,n){"use strict";function a(e){var t=[];return C.a.Children.forEach(e,function(e){t.push(e)}),t}function i(e,t){var n=null;return e&&e.forEach(function(e){n||e&&e.key===t&&(n=e)}),n}function r(e,t,n){var a=null;return e&&e.forEach(function(e){if(e&&e.key===t&&e.props[n]){if(a)throw new Error("two child with same key for <rc-animate> children");a=e}}),a}function o(e,t,n){var a=e.length===t.length;return a&&e.forEach(function(e,i){var r=t[i];e&&r&&(e&&!r||!e&&r?a=!1:e.key!==r.key?a=!1:n&&e.props[n]!==r.props[n]&&(a=!1))}),a}function l(e,t){var n=[],a={},r=[];return e.forEach(function(e){e&&i(t,e.key)?r.length&&(a[e.key]=r,r=[]):r.push(e)}),t.forEach(function(e){e&&a.hasOwnProperty(e.key)&&(n=n.concat(a[e.key])),n.push(e)}),n=n.concat(r)}function c(e){var t=e.children;return C.a.isValidElement(t)&&!t.key?C.a.cloneElement(t,{key:B}):t}function s(){}var u=n(143),d=n.n(u),f=n(145),h=n.n(f),m=n(41),p=n.n(m),v=n(42),E=n.n(v),y=n(43),g=n.n(y),k=n(44),b=n.n(k),w=n(7),C=n.n(w),N=n(9),x=n.n(N),_=n(58),A=n.n(_),P=n(57),L=n.n(P),T=n(481),M={isAppearSupported:function(e){return e.transitionName&&e.transitionAppear||e.animation.appear},isEnterSupported:function(e){return e.transitionName&&e.transitionEnter||e.animation.enter},isLeaveSupported:function(e){return e.transitionName&&e.transitionLeave||e.animation.leave},allowAppearCallback:function(e){return e.transitionAppear||e.animation.appear},allowEnterCallback:function(e){return e.transitionEnter||e.animation.enter},allowLeaveCallback:function(e){return e.transitionLeave||e.animation.leave}},I=M,S={enter:"transitionEnter",appear:"transitionAppear",leave:"transitionLeave"},O=function(e){function t(){return p()(this,t),g()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return b()(t,e),E()(t,[{key:"componentWillUnmount",value:function(){this.stop()}},{key:"componentWillEnter",value:function(e){I.isEnterSupported(this.props)?this.transition("enter",e):e()}},{key:"componentWillAppear",value:function(e){I.isAppearSupported(this.props)?this.transition("appear",e):e()}},{key:"componentWillLeave",value:function(e){I.isLeaveSupported(this.props)?this.transition("leave",e):e()}},{key:"transition",value:function(e,t){var n=this,a=L.a.findDOMNode(this),i=this.props,r=i.transitionName,o="object"===(void 0===r?"undefined":A()(r));this.stop();var l=function(){n.stopper=null,t()};if((T.b||!i.animation[e])&&r&&i[S[e]]){var c=o?r[e]:r+"-"+e,s=c+"-active";o&&r[e+"Active"]&&(s=r[e+"Active"]),this.stopper=Object(T.a)(a,{name:c,active:s},l)}else this.stopper=i.animation[e](a,l)}},{key:"stop",value:function(){var e=this.stopper;e&&(this.stopper=null,e.stop())}},{key:"render",value:function(){return this.props.children}}]),t}(C.a.Component);O.propTypes={children:x.a.any};var z=O,B="rc_animate_"+Date.now(),j=function(e){function t(e){p()(this,t);var n=g()(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return R.call(n),n.currentlyAnimatingKeys={},n.keysToEnter=[],n.keysToLeave=[],n.state={children:a(c(e))},n.childrenRefs={},n}return b()(t,e),E()(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.showProp,n=this.state.children;t&&(n=n.filter(function(e){return!!e.props[t]})),n.forEach(function(t){t&&e.performAppear(t.key)})}},{key:"componentWillReceiveProps",value:function(e){var t=this;this.nextProps=e;var n=a(c(e)),o=this.props;o.exclusive&&Object.keys(this.currentlyAnimatingKeys).forEach(function(e){t.stop(e)});var s=o.showProp,u=this.currentlyAnimatingKeys,d=o.exclusive?a(c(o)):this.state.children,f=[];s?(d.forEach(function(e){var t=e&&i(n,e.key),a=void 0;(a=t&&t.props[s]||!e.props[s]?t:C.a.cloneElement(t||e,h()({},s,!0)))&&f.push(a)}),n.forEach(function(e){e&&i(d,e.key)||f.push(e)})):f=l(d,n),this.setState({children:f}),n.forEach(function(e){var n=e&&e.key;if(!e||!u[n]){var a=e&&i(d,n);if(s){var o=e.props[s];if(a){!r(d,n,s)&&o&&t.keysToEnter.push(n)}else o&&t.keysToEnter.push(n)}else a||t.keysToEnter.push(n)}}),d.forEach(function(e){var a=e&&e.key;if(!e||!u[a]){var o=e&&i(n,a);if(s){var l=e.props[s];if(o){!r(n,a,s)&&l&&t.keysToLeave.push(a)}else l&&t.keysToLeave.push(a)}else o||t.keysToLeave.push(a)}})}},{key:"componentDidUpdate",value:function(){var e=this.keysToEnter;this.keysToEnter=[],e.forEach(this.performEnter);var t=this.keysToLeave;this.keysToLeave=[],t.forEach(this.performLeave)}},{key:"isValidChildByKey",value:function(e,t){var n=this.props.showProp;return n?r(e,t,n):i(e,t)}},{key:"stop",value:function(e){delete this.currentlyAnimatingKeys[e];var t=this.childrenRefs[e];t&&t.stop()}},{key:"render",value:function(){var e=this,t=this.props;this.nextProps=t;var n=this.state.children,a=null;n&&(a=n.map(function(n){if(null===n||void 0===n)return n;if(!n.key)throw new Error("must set key for <rc-animate> children");return C.a.createElement(z,{key:n.key,ref:function(t){return e.childrenRefs[n.key]=t},animation:t.animation,transitionName:t.transitionName,transitionEnter:t.transitionEnter,transitionAppear:t.transitionAppear,transitionLeave:t.transitionLeave},n)}));var i=t.component;if(i){var r=t;return"string"==typeof i&&(r=d()({className:t.className,style:t.style},t.componentProps)),C.a.createElement(i,r,a)}return a[0]||null}}]),t}(C.a.Component);j.isAnimate=!0,j.propTypes={component:x.a.any,componentProps:x.a.object,animation:x.a.object,transitionName:x.a.oneOfType([x.a.string,x.a.object]),transitionEnter:x.a.bool,transitionAppear:x.a.bool,exclusive:x.a.bool,transitionLeave:x.a.bool,onEnd:x.a.func,onEnter:x.a.func,onLeave:x.a.func,onAppear:x.a.func,showProp:x.a.string},j.defaultProps={animation:{},component:"span",componentProps:{},transitionEnter:!0,transitionLeave:!0,transitionAppear:!1,onEnd:s,onEnter:s,onLeave:s,onAppear:s};var R=function(){var e=this;this.performEnter=function(t){e.childrenRefs[t]&&(e.currentlyAnimatingKeys[t]=!0,e.childrenRefs[t].componentWillEnter(e.handleDoneAdding.bind(e,t,"enter")))},this.performAppear=function(t){e.childrenRefs[t]&&(e.currentlyAnimatingKeys[t]=!0,e.childrenRefs[t].componentWillAppear(e.handleDoneAdding.bind(e,t,"appear")))},this.handleDoneAdding=function(t,n){var i=e.props;if(delete e.currentlyAnimatingKeys[t],!i.exclusive||i===e.nextProps){var r=a(c(i));e.isValidChildByKey(r,t)?"appear"===n?I.allowAppearCallback(i)&&(i.onAppear(t),i.onEnd(t,!0)):I.allowEnterCallback(i)&&(i.onEnter(t),i.onEnd(t,!0)):e.performLeave(t)}},this.performLeave=function(t){e.childrenRefs[t]&&(e.currentlyAnimatingKeys[t]=!0,e.childrenRefs[t].componentWillLeave(e.handleDoneLeaving.bind(e,t)))},this.handleDoneLeaving=function(t){var n=e.props;if(delete e.currentlyAnimatingKeys[t],!n.exclusive||n===e.nextProps){var i=a(c(n));if(e.isValidChildByKey(i,t))e.performEnter(t);else{var r=function(){I.allowLeaveCallback(n)&&(n.onLeave(t),n.onEnd(t,!1))};o(e.state.children,i,n.showProp)?r():e.setState({children:i},r)}}}};t.a=j},479:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(e){return'\n  <svg\n    xmlns="http://www.w3.org/2000/svg"\n    xmlns:xlink="http://www.w3.org/1999/xlink"\n    id="__ANTD_MOBILE_SVG_SPRITE_NODE__"\n    style="position:absolute;width:0;height:0"\n  >\n    <defs>\n      '+e+"\n    </defs>\n  </svg>\n"},i={check:'<svg viewBox="0 0 44 44"><path fill-rule="evenodd" d="M34.538 8L38 11.518 17.808 32 8 22.033l3.462-3.518 6.346 6.45z"/></svg>',"check-circle":'<svg viewBox="0 0 48 48"><path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24zM13.1 23.2l-2.2 2.1 10 9.9L38.1 15l-2.2-2-15.2 17.8-7.6-7.6z" fill-rule="evenodd"/></svg>',"check-circle-o":'<svg viewBox="0 0 48 48"><g fill-rule="evenodd"><path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24zm0-3c11.598 0 21-9.402 21-21S35.598 3 24 3 3 12.402 3 24s9.402 21 21 21z"/><path d="M12.2 23.2L10 25.3l10 9.9L37.2 15 35 13 19.8 30.8z"/></g></svg>',cross:'<svg viewBox="0 0 44 44"><path fill-rule="evenodd" d="M24.008 21.852l8.97-8.968L31.092 11l-8.97 8.968L13.157 11l-1.884 1.884 8.968 8.968-9.24 9.24 1.884 1.885 9.24-9.24 9.24 9.24 1.885-1.884-9.24-9.24z"/></svg>',"cross-circle":'<svg viewBox="0 0 48 48"><g fill-rule="evenodd"><path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24zm0-3c11.598 0 21-9.402 21-21S35.598 3 24 3 3 12.402 3 24s9.402 21 21 21z"/><path d="M24.34 22.22l-7.775-7.775a1.5 1.5 0 1 0-2.12 2.12l7.773 7.775-7.774 7.775a1.5 1.5 0 1 0 2.12 2.12l7.775-7.773 7.774 7.774a1.5 1.5 0 1 0 2.12-2.12L26.46 24.34l7.774-7.774a1.5 1.5 0 1 0-2.12-2.12l-7.776 7.773z"/></g></svg>',"cross-circle-o":'<svg viewBox="0 0 48 48"><path d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24zm.353-25.77l-7.593-7.593c-.797-.8-1.538-.822-2.263-.207-.724.614-.56 1.617-.124 2.067l7.852 7.847-7.72 7.723c-.727.728-.56 1.646-.066 2.177.493.532 1.553.683 2.31-.174l7.588-7.584 7.644 7.623c.796.798 1.608.724 2.21.145.605-.58.72-1.442-.074-2.24l-7.657-7.67 7.545-7.52c.81-.697.9-1.76.297-2.34-.92-.885-1.85-.338-2.264.078l-7.685 7.667z" fill-rule="evenodd"/></svg>',left:'<svg viewBox="0 0 44 44"><defs><path id="a" d="M-129-845h24v24h-24z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><g clip-path="url(#b)"><defs><path id="c" d="M-903-949H947V996H-903z"/></defs></g><path d="M16.247 21.4L28.48 9.165l2.12 2.12-10.117 10.12L30.6 31.524l-2.12 2.12-12.233-12.232.007-.006z"/></svg>',right:'<svg viewBox="0 0 44 44"><defs><path id="a" d="M-129-845h24v24h-24z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><g clip-path="url(#b)"><defs><path id="c" d="M-903-949H947V996H-903z"/></defs></g><path d="M30.6 21.4L18.37 9.165l-2.12 2.12 10.117 10.12-10.118 10.118 2.12 2.12 12.234-12.232-.005-.006z"/></svg>',down:'<svg viewBox="0 0 44 44"><path d="M22.355 28.237l-11.483-10.9c-.607-.576-1.714-.396-2.48.41l.674-.71c-.763.802-.73 2.07-.282 2.496l11.37 10.793-.04.04 2.088 2.195L23.3 31.52l12.308-11.682c.447-.425.48-1.694-.282-2.496l.674.71c-.766-.806-1.873-.986-2.48-.41L22.355 28.237z" fill-rule="evenodd"/></svg>',up:'<svg viewBox="0 0 44 44"><path fill="none" d="M-1-1h46v46H-1z"/><defs><path id="a" d="M-129-845h24v24h-24z"/></defs><clipPath id="b"><use xlink:href="#a"/></clipPath><g clip-path="url(#b)"><defs><path id="c" d="M-903-949H947V996H-903z"/></defs></g><path d="M23.417 14.23L11.184 26.46l2.12 2.12 10.12-10.117 10.118 10.118 2.12-2.12L23.43 14.228l-.006.005z"/></svg>',loading:'<svg viewBox="0 -2 59.75 60.25"><path fill="#ccc" d="M29.69-.527C14.044-.527 1.36 12.158 1.36 27.806S14.043 56.14 29.69 56.14c15.65 0 28.334-12.686 28.334-28.334S45.34-.527 29.69-.527zm.185 53.75c-14.037 0-25.417-11.38-25.417-25.417S15.838 2.39 29.875 2.39s25.417 11.38 25.417 25.417-11.38 25.416-25.417 25.416z"/><path fill="none" stroke="#108ee9" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10" d="M56.587 29.766c.37-7.438-1.658-14.7-6.393-19.552"/></svg>',search:'<svg viewBox="0 0 44 44"><path d="M32.98 29.255l8.915 8.293L39.603 40l-8.86-8.242a15.952 15.952 0 0 1-10.753 4.147C11.16 35.905 4 28.763 4 19.952 4 11.142 11.16 4 19.99 4s15.99 7.142 15.99 15.952c0 3.472-1.112 6.685-3 9.303zm.05-9.21c0 7.123-5.7 12.918-12.88 12.918-7.176 0-13.015-5.795-13.015-12.918 0-7.12 5.84-12.917 13.017-12.917 7.178 0 12.88 5.797 12.88 12.917z" fill-rule="evenodd"/></svg>',ellipsis:'<svg viewBox="0 0 44 44"><circle cx="21.888" cy="22" r="4.045"/><circle cx="5.913" cy="22" r="4.045"/><circle cx="37.863" cy="22" r="4.045"/></svg>',"ellipsis-circle":'<svg viewBox="0 0 44 44"><g fill-rule="evenodd"><path d="M22.13.11C10.05.11.255 9.902.255 21.983S10.05 43.86 22.13 43.86s21.875-9.795 21.875-21.876S34.21.11 22.13.11zm0 40.7c-10.396 0-18.825-8.43-18.825-18.826S11.735 3.16 22.13 3.16c10.396 0 18.825 8.428 18.825 18.824S32.525 40.81 22.13 40.81z"/><circle cx="21.888" cy="22.701" r="2.445"/><circle cx="12.23" cy="22.701" r="2.445"/><circle cx="31.546" cy="22.701" r="2.445"/></g></svg>',"exclamation-circle":'<svg viewBox="0 0 64 64"><path d="M59.58 40.89L41.193 9.11C39.135 5.382 35.723 3 31.387 3c-3.11 0-6.52 2.382-8.58 6.11L4.42 40.89c-2.788 4.635-3.126 8.81-1.225 12.22C5.015 56.208 7.572 58 13 58h36.773c5.428 0 9.21-1.792 11.03-4.89 1.9-3.41 1.565-7.583-1.224-12.22zm-2.452 11c-.635 1.694-3.802 2.443-7.354 2.443H13c-3.59 0-5.493-.75-6.13-2.444-1.71-2.41-1.374-5.263 0-8.557l18.387-31.777c2.116-3.168 4.394-4.89 6.13-4.89 2.96 0 5.238 1.722 7.354 4.89l18.387 31.777c1.374 3.294 1.713 6.146 0 8.556zm-25.74-33c-.405 0-1.227.835-1.227 2.443v15.89c0 1.608.823 2.444 1.227 2.444 1.628 0 2.452-.836 2.452-2.445v-15.89c0-1.607-.825-2.443-2.453-2.443zm0 23.22c-.405 0-1.227.79-1.227 1.223v2.445c0 .434.823 1.222 1.227 1.222 1.628 0 2.452-.788 2.452-1.222v-2.445c0-.434-.825-1.222-2.453-1.222z" fill-rule="evenodd"/></svg>',"info-circle":'<svg viewBox="0 0 44 44"><circle cx="13.828" cy="19.63" r="1.938"/><circle cx="21.767" cy="19.63" r="1.938"/><circle cx="29.767" cy="19.63" r="1.938"/><path d="M22.102 4.16c-9.918 0-17.958 7.147-17.958 15.962 0 4.935 2.522 9.345 6.48 12.273v5.667l.04.012a2.627 2.627 0 1 0 4.5 1.455h.002l5.026-3.54c.628.06 1.265.094 1.91.094 9.92 0 17.96-7.146 17.96-15.96C40.06 11.306 32.02 4.16 22.1 4.16zm-.04 29.902c-.902 0-1.78-.08-2.642-.207l-5.882 4.234c-.024.024-.055.04-.083.06l-.008.005a.51.51 0 0 1-.284.095.525.525 0 0 1-.525-.525l.005-6.375c-3.91-2.516-6.456-6.544-6.456-11.1 0-7.628 7.107-13.812 15.875-13.812s15.875 6.184 15.875 13.812-7.107 13.812-15.875 13.812z"/></svg>',"question-circle":'<svg viewBox="0 0 44 44"><g fill-rule="evenodd"><path d="M21.186 3c-10.853 0-19.36 8.506-19.36 19.358C1.827 32.494 10.334 41 21.187 41c10.133 0 18.64-8.506 18.64-18.642C39.827 11.506 31.32 3 21.187 3m15.64 19c0 8.823-7.178 16-16 16s-16-7.177-16-16 7.178-16 16-16 16 7.177 16 16z"/><path d="M22.827 31.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4-15.48c0 .957-.203 1.822-.61 2.593-.427.792-1.117 1.612-2.073 2.457-.867.734-1.453 1.435-1.754 2.096-.302.7-.453 1.693-.453 2.98a.828.828 0 0 1-.823.854.828.828 0 0 1-.584-.22.877.877 0 0 1-.24-.635c0-1.305.168-2.38.506-3.227.336-.883.93-1.682 1.78-2.4 1.01-.883 1.71-1.692 2.1-2.428.336-.645.503-1.38.503-2.21-.02-.935-.3-1.7-.85-2.288-.655-.717-1.62-1.075-2.897-1.075-1.506 0-2.596.535-3.27 1.6-.46.754-.688 1.645-.688 2.677a.92.92 0 0 1-.266.66.747.747 0 0 1-.56.25.73.73 0 0 1-.584-.194c-.16-.164-.24-.393-.24-.69 0-1.82.585-3.272 1.755-4.357C18.645 11.486 19.928 11 21.434 11h.293c1.452 0 2.638.414 3.56 1.24 1.028.903 1.54 2.163 1.54 3.78z"/></g></svg>',voice:'<svg viewBox="0 0 38 33"><g fill-rule="evenodd"><path d="M17.838 28.8c-.564-.468-1.192-.983-1.836-1.496-4.244-3.385-5.294-3.67-6.006-3.67-.014 0-.027.005-.04.005-.015 0-.028-.006-.042-.006H3.562c-.734 0-.903-.203-.903-.928v-12.62c0-.49.057-.8.66-.8H9.1c.694 0 1.76-.28 6.4-3.63.83-.596 1.638-1.196 2.337-1.722V28.8zM19.682.19c-.463-.22-1.014-.158-1.417.157-.02.016-1.983 1.552-4.152 3.125C10.34 6.21 9.243 6.664 9.02 6.737H3.676c-.027 0-.053.003-.08.004H1.183c-.608 0-1.1.487-1.1 1.086V25.14c0 .598.492 1.084 1.1 1.084h8.71c.22.08 1.257.55 4.605 3.24 1.947 1.562 3.694 3.088 3.712 3.103.25.22.568.333.89.333.186 0 .373-.038.55-.116.48-.213.79-.684.79-1.204V1.38c0-.506-.294-.968-.758-1.19z" mask="url(#mask-2)"/><path d="M31.42 16.475c0-3.363-1.854-6.297-4.606-7.876-.125-.067-.42-.193-.625-.193-.613 0-1.11.488-1.11 1.09 0 .404.22.764.55.952 2.13 1.19 3.566 3.44 3.566 6.024 0 2.627-1.486 4.913-3.677 6.087-.32.19-.53.54-.53.935 0 .602.495 1.09 1.106 1.09.26.002.568-.15.568-.15 2.835-1.556 4.754-4.538 4.754-7.96" mask="url(#mask-4)"/><path d="M30.14 3.057c-.205-.122-.41-.22-.658-.22-.608 0-1.1.485-1.1 1.084 0 .434.26.78.627.978 4.042 2.323 6.76 6.636 6.76 11.578 0 4.938-2.715 9.248-6.754 11.572-.354.19-.66.55-.66.993 0 .6.494 1.085 1.102 1.085.243 0 .438-.092.65-.213 4.692-2.695 7.848-7.7 7.848-13.435 0-5.723-3.142-10.718-7.817-13.418" mask="url(#mask-6)"/></g></svg>',plus:'<svg viewBox="0 0 30 30"><path d="M14 14H0v2h14v14h2V16h14v-2H16V0h-2v14z" fill-rule="evenodd"/></svg>',minus:'<svg viewBox="0 0 30 2"><path d="M0 0h30v2H0z" fill-rule="evenodd"/></svg>',dislike:'<svg viewBox="0 0 72 72"><g fill="none" fill-rule="evenodd"><path d="M36 72c19.882 0 36-16.118 36-36S55.882 0 36 0 0 16.118 0 36s16.118 36 36 36zm0-2c18.778 0 34-15.222 34-34S54.778 2 36 2 2 17.222 2 36s15.222 34 34 34z" fill="#FFF"/><path fill="#FFF" d="M47 22h2v6h-2zm-24 0h2v6h-2z"/><path d="M21 51s4.6-7 15-7 15 7 15 7" stroke="#FFF" stroke-width="2"/></g></svg>',fail:'<svg viewBox="0 0 72 72"><g fill="none" fill-rule="evenodd"><path d="M36 72c19.882 0 36-16.118 36-36S55.882 0 36 0 0 16.118 0 36s16.118 36 36 36zm0-2c18.778 0 34-15.222 34-34S54.778 2 36 2 2 17.222 2 36s15.222 34 34 34z" fill="#FFF"/><path d="M22 22l28.304 28.304m-28.304 0L50.304 22" stroke="#FFF" stroke-width="2"/></g></svg>',success:'<svg viewBox="0 0 72 72"><g fill="none" fill-rule="evenodd"><path d="M36 72c19.882 0 36-16.118 36-36S55.882 0 36 0 0 16.118 0 36s16.118 36 36 36zm0-2c18.778 0 34-15.222 34-34S54.778 2 36 2 2 17.222 2 36s15.222 34 34 34z" fill="#FFF"/><path stroke="#FFF" stroke-width="2" d="M19 34.54l11.545 11.923L52.815 24"/></g></svg>'},r=function(){var e=Object.keys(i).map(function(e){return"<symbol id="+e+i[e].split("svg")[1]+"symbol>"}).join("");return a(e)},o=function(){if(document){var e=document.getElementById("__ANTD_MOBILE_SVG_SPRITE_NODE__"),t=document.body;e||t.insertAdjacentHTML("afterbegin",r())}};t.default=o,e.exports=t.default},480:function(e,t){},481:function(e,t,n){"use strict";function a(e,t,n){e.addEventListener(t,n,!1)}function i(e,t,n){e.removeEventListener(t,n,!1)}function r(e,t){for(var n=window.getComputedStyle(e,null),a="",i=0;i<y.length&&!(a=n.getPropertyValue(y[i]+t));i++);return a}function o(e){if(v){var t=parseFloat(r(e,"transition-delay"))||0,n=parseFloat(r(e,"transition-duration"))||0,a=parseFloat(r(e,"animation-delay"))||0,i=parseFloat(r(e,"animation-duration"))||0,o=Math.max(n+t,i+a);e.rcEndAnimTimeout=setTimeout(function(){e.rcEndAnimTimeout=null,e.rcEndListener&&e.rcEndListener()},1e3*o+200)}}function l(e){e.rcEndAnimTimeout&&(clearTimeout(e.rcEndAnimTimeout),e.rcEndAnimTimeout=null)}var c=n(58),s=n.n(c),u={transitionend:{transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"mozTransitionEnd",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd"},animationend:{animation:"animationend",WebkitAnimation:"webkitAnimationEnd",MozAnimation:"mozAnimationEnd",OAnimation:"oAnimationEnd",msAnimation:"MSAnimationEnd"}},d=[];"undefined"!=typeof window&&"undefined"!=typeof document&&function(){var e=document.createElement("div"),t=e.style;"AnimationEvent"in window||delete u.animationend.animation,"TransitionEvent"in window||delete u.transitionend.transition;for(var n in u)if(u.hasOwnProperty(n)){var a=u[n];for(var i in a)if(i in t){d.push(a[i]);break}}}();var f={addEndEventListener:function(e,t){if(0===d.length)return void window.setTimeout(t,0);d.forEach(function(n){a(e,n,t)})},endEvents:d,removeEndEventListener:function(e,t){0!==d.length&&d.forEach(function(n){i(e,n,t)})}},h=f,m=n(482),p=n.n(m);n.d(t,"b",function(){return v});var v=0!==h.endEvents.length,E=["Webkit","Moz","O","ms"],y=["-webkit-","-moz-","-o-","ms-",""],g=function(e,t,n){var a="object"===(void 0===t?"undefined":s()(t)),i=a?t.name:t,r=a?t.active:t+"-active",c=n,u=void 0,d=void 0,f=p()(e);return n&&"[object Object]"===Object.prototype.toString.call(n)&&(c=n.end,u=n.start,d=n.active),e.rcEndListener&&e.rcEndListener(),e.rcEndListener=function(t){t&&t.target!==e||(e.rcAnimTimeout&&(clearTimeout(e.rcAnimTimeout),e.rcAnimTimeout=null),l(e),f.remove(i),f.remove(r),h.removeEndEventListener(e,e.rcEndListener),e.rcEndListener=null,c&&c())},h.addEndEventListener(e,e.rcEndListener),u&&u(),f.add(i),e.rcAnimTimeout=setTimeout(function(){e.rcAnimTimeout=null,f.add(r),d&&setTimeout(d,0),o(e)},30),{stop:function(){e.rcEndListener&&e.rcEndListener()}}};g.style=function(e,t,n){e.rcEndListener&&e.rcEndListener(),e.rcEndListener=function(t){t&&t.target!==e||(e.rcAnimTimeout&&(clearTimeout(e.rcAnimTimeout),e.rcAnimTimeout=null),l(e),h.removeEndEventListener(e,e.rcEndListener),e.rcEndListener=null,n&&n())},h.addEndEventListener(e,e.rcEndListener),e.rcAnimTimeout=setTimeout(function(){for(var n in t)t.hasOwnProperty(n)&&(e.style[n]=t[n]);e.rcAnimTimeout=null,o(e)},0)},g.setTransition=function(e,t,n){var a=t,i=n;void 0===n&&(i=a,a=""),a=a||"",E.forEach(function(t){e.style[t+"Transition"+a]=i})},g.isCssAnimationSupported=v;t.a=g},482:function(e,t,n){function a(e){if(!e||!e.nodeType)throw new Error("A DOM element reference is required");this.el=e,this.list=e.classList}try{var i=n(467)}catch(e){var i=n(467)}var r=/\s+/,o=Object.prototype.toString;e.exports=function(e){return new a(e)},a.prototype.add=function(e){if(this.list)return this.list.add(e),this;var t=this.array();return~i(t,e)||t.push(e),this.el.className=t.join(" "),this},a.prototype.remove=function(e){if("[object RegExp]"==o.call(e))return this.removeMatching(e);if(this.list)return this.list.remove(e),this;var t=this.array(),n=i(t,e);return~n&&t.splice(n,1),this.el.className=t.join(" "),this},a.prototype.removeMatching=function(e){for(var t=this.array(),n=0;n<t.length;n++)e.test(t[n])&&this.remove(t[n]);return this},a.prototype.toggle=function(e,t){return this.list?(void 0!==t?t!==this.list.toggle(e,t)&&this.list.toggle(e):this.list.toggle(e),this):(void 0!==t?t?this.add(e):this.remove(e):this.has(e)?this.remove(e):this.add(e),this)},a.prototype.array=function(){var e=this.el.getAttribute("class")||"",t=e.replace(/^\s+|\s+$/g,""),n=t.split(r);return""===n[0]&&n.shift(),n},a.prototype.has=a.prototype.contains=function(e){return this.list?this.list.contains(e):!!~i(this.array(),e)}},483:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function i(e,t){var n;v&&(v.destroy(),v=null),h.default.newInstance({prefixCls:E,style:{},transitionName:"am-fade",className:(0,s.default)((n={},(0,l.default)(n,E+"-mask",e),(0,l.default)(n,E+"-nomask",!e),n))},function(e){return t&&t(e)})}function r(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3,a=arguments[3],r=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],o={info:"",success:"success",fail:"fail",offline:"dislike",loading:"loading"},l=o[t];i(r,function(t){v=t,t.notice({duration:n,style:{},content:l?d.default.createElement("div",{className:E+"-text "+E+"-text-icon",role:"alert","aria-live":"assertive"},d.default.createElement(p.default,{type:l,size:"lg"}),d.default.createElement("div",{className:E+"-text-info"},e)):d.default.createElement("div",{className:E+"-text",role:"alert","aria-live":"assertive"},d.default.createElement("div",null,e)),closable:!0,onClose:function(){a&&a(),t.destroy(),t=null,v=null}})})}Object.defineProperty(t,"__esModule",{value:!0});var o=n(145),l=a(o),c=n(144),s=a(c),u=n(7),d=a(u),f=n(485),h=a(f),m=n(469),p=a(m),v=void 0,E="am-toast";t.default={SHORT:3,LONG:8,show:function(e,t,n){return r(e,"info",t,function(){},n)},info:function(e,t,n,a){return r(e,"info",t,n,a)},success:function(e,t,n,a){return r(e,"success",t,n,a)},fail:function(e,t,n,a){return r(e,"fail",t,n,a)},offline:function(e,t,n,a){return r(e,"offline",t,n,a)},loading:function(e,t,n,a){return r(e,"loading",t,n,a)},hide:function(){v&&(v.destroy(),v=null)}},e.exports=t.default},484:function(e,t,n){"use strict";n(146),n(470),n(486)},485:function(e,t,n){"use strict";function a(){var e=[].slice.call(arguments,0);return 1===e.length?e[0]:function(){for(var t=0;t<e.length;t++)e[t]&&e[t].apply&&e[t].apply(this,arguments)}}function i(){return"rcNotification_"+M+"_"+T++}Object.defineProperty(t,"__esModule",{value:!0});var r=n(468),o=n.n(r),l=n(145),c=n.n(l),s=n(143),u=n.n(s),d=n(41),f=n.n(d),h=n(42),m=n.n(h),p=n(43),v=n.n(p),E=n(44),y=n.n(E),g=n(7),k=n.n(g),b=n(9),w=n.n(b),C=n(57),N=n.n(C),x=n(472),_=n(144),A=n.n(_),P=function(e){function t(){var e,n,a,i;f()(this,t);for(var r=arguments.length,o=Array(r),l=0;l<r;l++)o[l]=arguments[l];return n=a=v()(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(o))),a.close=function(){a.clearCloseTimer(),a.props.onClose()},a.startCloseTimer=function(){a.props.duration&&(a.closeTimer=setTimeout(function(){a.close()},1e3*a.props.duration))},a.clearCloseTimer=function(){a.closeTimer&&(clearTimeout(a.closeTimer),a.closeTimer=null)},i=n,v()(a,i)}return y()(t,e),m()(t,[{key:"componentDidMount",value:function(){this.startCloseTimer()}},{key:"componentWillUnmount",value:function(){this.clearCloseTimer()}},{key:"render",value:function(){var e,t=this.props,n=t.prefixCls+"-notice",a=(e={},c()(e,""+n,1),c()(e,n+"-closable",t.closable),c()(e,t.className,!!t.className),e);return k.a.createElement("div",{className:A()(a),style:t.style},k.a.createElement("div",{className:n+"-content"},t.children),t.closable?k.a.createElement("a",{tabIndex:"0",onClick:this.close,className:n+"-close"},k.a.createElement("span",{className:n+"-close-x"})):null)}}]),t}(g.Component);P.propTypes={duration:w.a.number,onClose:w.a.func,children:w.a.any},P.defaultProps={onEnd:function(){},onClose:function(){},duration:1.5,style:{right:"50%"}};var L=P,T=0,M=Date.now(),I=function(e){function t(){var e,n,a,r;f()(this,t);for(var o=arguments.length,l=Array(o),c=0;c<o;c++)l[c]=arguments[c];return n=a=v()(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),a.state={notices:[]},a.add=function(e){var t=e.key=e.key||i();a.setState(function(n){var a=n.notices;if(!a.filter(function(e){return e.key===t}).length)return{notices:a.concat(e)}})},a.remove=function(e){a.setState(function(t){return{notices:t.notices.filter(function(t){return t.key!==e})}})},r=n,v()(a,r)}return y()(t,e),m()(t,[{key:"getTransitionName",value:function(){var e=this.props,t=e.transitionName;return!t&&e.animation&&(t=e.prefixCls+"-"+e.animation),t}},{key:"render",value:function(){var e,t=this,n=this.props,i=this.state.notices.map(function(e){var i=a(t.remove.bind(t,e.key),e.onClose);return k.a.createElement(L,u()({prefixCls:n.prefixCls},e,{onClose:i}),e.content)}),r=(e={},c()(e,n.prefixCls,1),c()(e,n.className,!!n.className),e);return k.a.createElement("div",{className:A()(r),style:n.style},k.a.createElement(x.a,{transitionName:this.getTransitionName()},i))}}]),t}(g.Component);I.propTypes={prefixCls:w.a.string,transitionName:w.a.string,animation:w.a.oneOfType([w.a.string,w.a.object]),style:w.a.object},I.defaultProps={prefixCls:"rmc-notification",animation:"fade",style:{top:65,left:"50%"}},I.newInstance=function(e,t){function n(e){c||(c=!0,t({notice:function(t){e.add(t)},removeNotice:function(t){e.remove(t)},component:e,destroy:function(){N.a.unmountComponentAtNode(l),i||document.body.removeChild(l)}}))}var a=e||{},i=a.getContainer,r=o()(a,["getContainer"]),l=void 0;i?l=i():(l=document.createElement("div"),document.body.appendChild(l));var c=!1;N.a.render(k.a.createElement(I,u()({},r,{ref:n})),l)};var S=I;t.default=S},486:function(e,t){}});
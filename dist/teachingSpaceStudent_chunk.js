webpackJsonp([140],{1190:function(e,t){},449:function(e,t,a){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=a(41),c=l(n),i=a(42),o=l(i),r=a(43),s=l(r),u=a(44),d=l(u),h=a(7),m=l(h);a(1190);var f=function(e){function t(e){(0,c.default)(this,t);var a=(0,s.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.toClient=function(e){var t={method:e,ident:a.state.ident};"openNativePage_Errorbook_Stu"==e&&(t.href="http://jiaoxue.maaee.com:8094/#/topicWrongList?userId="),console.log(t,"data"),Bridge.callHandler(t,null,function(e){})},a.cloudSchoolClassesStatistical=function(){var e="http://jiaoxue.maaee.com:8093/#/cloudSchoolClassesStatistical?access_user="+a.state.ident,t={method:"openNewPage",url:e};Bridge.callHandler(t,null,function(t){window.location.href=e})},a.liveReview=function(){var e="http://jiaoxue.maaee.com:8093/#/liveReview?access_user="+a.state.ident,t={method:"openNewPage",url:e};Bridge.callHandler(t,null,function(t){window.location.href=e})},a.inAndOutSchool=function(){var e="http://jiaoxue.maaee.com:8093/#/inAndOutSchool?access_user="+a.state.ident,t={method:"openNewPage",url:e};Bridge.callHandler(t,null,function(t){window.location.href=e})},a.state={phone:"IOS"},a}return(0,d.default)(t,e),(0,o.default)(t,[{key:"componentDidMount",value:function(){try{Bridge.setRefreshAble("false")}catch(e){console.log(e,"teachingSpaceStudent")}var e=decodeURI(window.location.href),t=e.substr(e.indexOf("?")+1),a=t.split("&"),l=decodeURI(a[0].split("=")[1]);this.setState({ident:l});var n=navigator.userAgent;n.indexOf("iPhone")>-1||n.indexOf("iPad")>-1?this.setState({phone:"IOS"}):this.setState({phone:"Android"})}},{key:"render",value:function(){return m.default.createElement("div",{id:"teachingSpaceTeacher"},m.default.createElement("div",{className:"teacher-item"},m.default.createElement("h1",null,"课堂"),m.default.createElement("ul",{className:"my_flex teacherUl"},m.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_TheSchoolClassroom_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-classroom"}),m.default.createElement("div",null,"班级课堂")),m.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_LiveClass_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-live"}),m.default.createElement("div",null,"直播课堂")),m.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_AntCloudClass_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-eSchool"}),m.default.createElement("div",null,"小蚂蚁云课堂")),m.default.createElement("li",{onClick:this.cloudSchoolClassesStatistical},m.default.createElement("i",{className:"Icon-teacher Icon-student-ClassReview"}),m.default.createElement("div",null,"课堂回顾")),m.default.createElement("li",{onClick:this.liveReview},m.default.createElement("i",{className:"Icon-teacher Icon-student-live"}),m.default.createElement("div",null,"直播回顾")))),m.default.createElement("div",{className:"teacher-item"},m.default.createElement("h1",null,"作业/考试"),m.default.createElement("ul",{className:"my_flex teacherUl"},m.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_HomeworkToDo_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-homeworkCorrecting"}),m.default.createElement("div",null,"作业")),m.default.createElement("li",{style:{display:"Android"==this.state.phone?"block":"none"},onClick:this.toClient.bind(this,"openNativePage_MyTestPaper_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-testPaper"}),m.default.createElement("div",null,"考试")),m.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_HomeworkStatistics_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-homeworkStatistics"}),m.default.createElement("div",null,"作业统计")),m.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_Errorbook_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-wrongBook"}),m.default.createElement("div",null,"错题本")))),m.default.createElement("div",{className:"teacher-item"},m.default.createElement("h1",null,"学习资源"),m.default.createElement("ul",{className:"my_flex teacherUl"},m.default.createElement("li",{style:{display:"Android"==this.state.phone?"block":"none"},onClick:this.toClient.bind(this,"openNativePage_DoExercises_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-questionBank"}),m.default.createElement("div",null,"玩转习题")),m.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_ResourceLibrary_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-repository"}),m.default.createElement("div",null,"资源库")),m.default.createElement("li",{style:{display:"Android"==this.state.phone?"block":"none"},onClick:this.toClient.bind(this,"openNativePage_FamousTeacherSpace_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-teacher-famousTeacher"}),m.default.createElement("div",null,"名师空间")))),m.default.createElement("div",{className:"teacher-item"},m.default.createElement("h1",null,"更多"),m.default.createElement("ul",{className:"my_flex teacherUl"},m.default.createElement("li",{onClick:this.toClient.bind(this,"openNativePage_QuestionnaireSurvey_Stu")},m.default.createElement("i",{className:"Icon-teacher Icon-student-Survey"}),m.default.createElement("div",null,"问卷调查")),m.default.createElement("li",{style:{display:"none"},onClick:this.inAndOutSchool},m.default.createElement("i",{className:"Icon-teacher Icon-student-turnover"}),m.default.createElement("div",null,"出入校统计")))))}}]),t}(m.default.Component);t.default=f}});
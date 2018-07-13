import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute, Link} from 'react-router';
import App from './components/App';
// import Stage1 from './components/Stage1';
// import Stage3 from './components/Stage3';
// import Stage4 from './components/Stage4';
// import Stage5 from './components/Stage5';

const questionBank = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/questionBank/questionBank').default)
    }, 'questionBank')
};
const questionDetil = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/questionBank/questionDetil').default)
    }, 'questionDetil')
};
const analysisList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/resultAnalysis/analysisList').default)
    }, 'analysisList')
};
const resultAnalysis = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/resultAnalysis/resultAnalysis').default)
    }, 'resultAnalysis')
};
const classReaultAnalysis = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/resultAnalysis/classResultAnalysis').default)
    }, 'classReaultAnalysis')
};
const searchUserLocationInfo = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/userInfo/searchUserLocationInfo').default)
    }, 'searchUserLocationInfo')
};
const studentFaceStatistics = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/charts/studentFaceStatistics').default)
    }, 'studentFaceStatistics')
};
const termitePlateLibrary = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/termitePlateLibrary/js/termitePlateLibrary').default)
    }, 'termitePlateLibrary')
};
const pushSubjectsFromTLibrary = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/termitePlateLibrary/js/pushSubjectsFromTLibrary').default)
    }, 'pushSubjectsFromTLibrary')
};
const arrangementWork = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/termitePlateLibrary/js/arrangementWork').default)
    }, 'arrangementWork')
};
const fileShareLink = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/fileShareLink/js/fileShareLink').default)
    }, 'fileShareLink')
};
const webMiddlePage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/webMiddlePage/js/webMiddlePage').default)
    }, 'webMiddlePage')
};
const previewFile = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/webMiddlePage/js/previewFile').default)
    }, 'previewFile')
};
const ringBinding = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/ringBindInformation/js/ringBinding').default)
    }, 'ringBinding')
};
const bindingBracelet = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/ringBindInformation/js/bindingBracelet').default)
    }, 'bindingBracelet')
};
const boxBracelet = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/ringBindInformation/js/boxBracelet').default)
    }, 'boxBracelet')
};
const personalSettings = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/chatSettings/js/personalSettings').default)
    }, 'personalSettings')
};
const groupSetting = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./components/chatSettings/js/groupSetting').default)
    }, 'groupSetting')
};
const chatMsg = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/chatSettings/js/chatMsg").default)
    }, "chatMsg")
}

const longList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/chatSettings/js/longList").default)
        }
    )
}
// 家庭作业统计 -- 按班级进行统计
const homeWorkUnderstandAnalysisByClass = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/charts/homeWorkAnalysis/HomeWorkUnderstandAnalysisByClass").default)
        }
    )
}

// 家庭作业统计 -- 按学生进行统计
const homeWorkUnderstandAnalysisByStudent = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/charts/homeWorkAnalysis/HomeWorkUnderstandAnalysisByStudent").default)
        }
    )
}

// 家庭作业统计 -- 以班级作业为单位，计算每个题目的每个学生的时长和理解度
const homeWorkUnderstandAnalysisByClassSubject = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/charts/homeWorkAnalysis/HomeWorkUnderstandAnalysisByClassSubject").default)
        }
    )
}

// 家庭作业统计 -- 以班级作业为单位，计算每个题目的每个学生的时长和理解度
const homeWorkUnderstandAnalysisGuide = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/charts/homeWorkAnalysis/HomeWorkUnderstandAnalysisGuide").default)
        }
    )
}

const m3u8Player = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/m3u8Player/js/m3u8Player").default)
        }
    )
}

const HomeWorkUnderstandAnalysisGuideByNoom = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/charts/homeWorkAnalysis/HomeWorkUnderstandAnalysisGuideByNoom").default)
        }
    )
}

const brotherXu = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/charts/homeWorkAnalysis/brotherXu").default)
        }
    )
}

const homeworkModule = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystem/js/homeworkModule").default)
        }
    )
}

const curriculumSchedule = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/curriculumSchedule").default)
        }
    )
}

const workAttendance = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystem/js/workAttendance").default)
        }
    )
}
// 通知查看
const noticeReadMore = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystem/js/noticeReadMore").default)
    })
}
const classroomManage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/classroomManage").default)
    })
}
const addClassroomManage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/addClassroomManage").default)
    })
}
const addTeachBuild = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/addTeachBuild").default)
    })
}

const addCurriculumSchedule = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/addCurriculumSchedule").default)
    })
}

/*修改班牌课程表*/
const updateCurriculumSchedule = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/updateCurriculumSchedule").default)
    })
}

const definedTerm = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/definedTerm").default)
    })
}

const classDemeanor = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/classDemeanor").default)
    })
}

//德育
const moralEducation = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/moralEducation").default)
    })
}

const addMoralEducation = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/addMoralEducation").default)
    })
}
const updateMoralEducation = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/updateMoralEducation").default)
    })
}

const assessMoralEducation = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/assessMoralEducation").default)
    })
}
const classCardHomePage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystem/js/homePage/classCardHomePage").default)
    })
}

/*公共教室的班牌首页*/
const publicClassCardHomePage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystem/js/homePage/publicClassCardHomePage").default)
    })
}

const notifyBack = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/notify").default)
    })
}
const addNotify = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/addNotify").default)
    })
}
const notifyDetail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/notifyDetail").default)
    })
}
const updateClassroom = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/updateClassroom").default)
    })
}

const studentDutyList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/studentDutyList").default)
        }
    )
}

const clazzDutyList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/clazzDutyList").default)
        }
    )
}

const addStudentDuty = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/addStudentDuty").default)
        }
    )
}

const editStudentDuty = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/editStudentDuty").default)
        }
    )
}

const currentAttendanceList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystem/js/homePage/currentAttendanceList").default)
        }
    )
}

const classHonor = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/classHonor").default)
        }
    )
}

const tableItemDetil = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystem/js/tableItemDetil").default)
        }
    )
}

const comments = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/commentsModule/js/comments").default)
        }
    )
}

const classCardHomePageDoor = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/classCardHomePageDoor").default)
        }
    )
}

const fileAnalysis = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/charts/fileAnalysis/js/fileAnalysis").default)
        }
    )
}

/**
 * 公共教室班牌学生选课
 * @param location
 * @param cb
 */
const studentSelectCourse = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/studentSelectCourse").default)
        }
    )
}


const getClassRoomList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/newCurriculumSche/getClassRoomList").default)
    })
}

const classDemeanorList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/classDemeanorList").default)
        }
    )
}

const getClassTableList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/newCurriculumSche/getClassTableList").default)
        }
    )
}

const newCurriculumSchedule = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/newCurriculumSche/curriculumSchedule").default)
        }
    )
}

const newAddCurriculumSchedule = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/newCurriculumSche/addCurriculumSchedule").default)
        }
    )
}

const newUpdateCurriculumSchedule = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/newCurriculumSche/updateCurriculumSchedule").default)
    })
}


const classHonorList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/classHonorList").default)

        }
    )
}

const particlePath = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/particlePath/js/particlePath").default)

        }
    )
}


const dashboard = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/charts/dashboard/dashboard").default)
    })
}

const dashboardByCity = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/charts/dashboard/dashboardByCity").default)
    })
}

const warning = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/warnAndHealthModule/js/warning").default)
        }
    )
}

const healthList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/warnAndHealthModule/js/healthList").default)

        }
    )
}

const health = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/warnAndHealthModule/js/health").default)

        }
    )
}

const warnList = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/warnAndHealthModule/js/warnList").default)
    })
}

const studentMovement = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/charts/heatmap/js/studentMovement").default)
        }
    )
}

const schoolPlan = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/schoolPlan").default)
        }
    )
}

const attendanceTime = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/attendanceTime").default)
        }
    )
}
const newAttendanceTime = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/newAttendanceTime").default)
        }
    )
}
const updateAttendanceTime = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/classCardSystemBackstage/js/updateAttendanceTime").default)
    })
}
const littleAntPolicy = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/littleAntPolicy/littleAntPolicy").default)
        }
    )
}
//微信授权登录
const wxLogin = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/wxLogin/wxLogin").default)
        }
    )
}

const warningAdminList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/warningAdmin/js/warningAdminList").default)
        }
    )
}

const addWarnAdmin = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/warningAdmin/js/addWarnAdmin").default)
        }
    )
}

const answerFormStudent = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/answerManagement/js/answerFormStudent").default)
        //查看作答
    })
}
const LookAtTheAnswer = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/LookAtTheAnswer/js/LookAtTheAnswer").default)
        }
    )
}

const answerListFormTeacher = (location, cb) => {
    require.ensure([], require => {
        cb(null, require("./components/answerManagement/js/answerListFormTeacher").default)

    })
}

const waterWork = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/waterWork/waterWork").default)
        }
    )
}

const attendanceSatisticaForClass = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/attendance/js/attendanceSatisticaForClass").default)
        }
    )
}

const attendanceStatistical = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/attendance/js/attendanceStatistical").default)
        }
    )
}

const inAndOutSchool = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/attendance/js/inAndOutSchool").default)
        }
    )
}

const classAttendance = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/attendance/js/classAttendance").default)
        }
    )
}

//发送模板消息 至 微信
const wxTemplate = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/wxLogin/wxTempalte").default)
        }
    )
}

/**
 * AR教材
 */
const ARTextbookList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/ARTextbook/js/ARTextbookList").default)
        }
    )
}
const addARTextbook = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/ARTextbook/js/addARTextbook").default)
        }
    )
}
const UpdateARTextbook = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/ARTextbook/js/UpdateARTextbook").default)
        }
    )
}
const groupList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/ARTextbook/js/groupList").default)
        }
    )
}
const ArIndex = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/ARTextbook/js/ArIndex").default)
        }
    )
}
//微信绑定页面
const wxBindIndex = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/wxLogin/wxBindIndex").default)
        }
    )
}

//微信绑定页面
const contactsList = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/mobileChat/js/contactsListSimple").default)
        }
    )
}


//微信绑定页面
const chatDetil = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/mobileChat/js/chatDetil").default)
        }
    )
}

//微信绑定页面
const arDoor = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/arDoor/js/arDoor").default)
        }
    )
}


const excellentStu = (location, cb) => {
    require.ensure([], require => {
            cb(null, require("./components/classCardSystemBackstage/js/excellentStu").default)
        }
    )
}

import './index.less';

class Index extends React.Component {

    render() {
        return (
            <div className="body">
                <h1>Stages list</h1>
                <ul role="nav">
                    {/*<li><Link to="/s1">ListView + Carousel</Link></li>*/}
                    {/*<li><Link to="/s3">Form + ...</Link></li>*/}
                    {/*<li><Link to="/s4" style={{fontSize: '24px'}}>蚁巢</Link></li>*/}
                    {/*<li><Link to="/s5" style={{fontSize: '24px'}}>实验</Link></li>*/}
                    {/*<li><Link to="/questionBank?ident=54208&pointId=4339&title=nihao"*/}
                    {/*style={{fontSize: '24px'}}>题库</Link></li>*/}
                    {/*<li><Link to="/analysisList?access_user=23836" style={{fontSize: '24px'}}>成绩分析</Link></li>*/}
                    {/*<li><Link to="/searchUserLocationInfo" style={{fontSize: '24px'}}>搜索查看用户位置信息</Link></li>*/}
                    {/*<li><Link to="/studentFaceStatistics" style={{fontSize: '24px'}}>学生脸部表情分析折线图</Link></li>*/}
                    {/*<li><Link to="/termitePlateLibrary?ident=23836&fileId=-1&title=蚁盘题目&phoneType=0"*/}
                    {/*style={{fontSize: '24px'}}>蚁盘题库</Link>*/}
                    {/*</li>*/}
                    {/*<li><Link to="/pushSubjectsFromTLibrary?ident=23836&fileId=-1"*/}
                    {/*style={{fontSize: '24px'}}>蚁盘推题</Link></li>*/}
                    {/*<li><Link to="/arrangementWork?ident=23836&fileId=-1"*/}
                    {/*style={{fontSize: '24px'}}>布置作业</Link></li>*/}
                    {/*<li><Link to="/fileShareLink?shareId=1971&userId=23836&userType=st"*/}
                    {/*style={{fontSize: '24px'}}>文件分享</Link></li>*/}
                    {/*{<li><Link to="/ringBinding?ident=23836"*/}
                    {/*style={{fontSize: '24px'}}>手环绑定</Link></li>}*/}
                    {/*<li><Link to="/personalSettings?uid=23836&tid=31837&utype=te"*/}
                    {/*style={{fontSize: '24px'}}>个人设置</Link></li>*/}
                    {/*<li><Link to="/groupSetting?chatGroupId=706&ident=23836&utype=te"*/}
                    {/*style={{fontSize: '24px'}}>群设置</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/m3u8Player?path=http://p6ckz6030.bkt.clouddn.com/recordings/z1.maaee.24827/1524474964_1524476205.m3u8&_k=vdcr12"*/}
                    {/*style={{fontSize: '24px'}}>m3u8Player</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/HomeWorkUnderstandAnalysisGuideByNoom?ident=23836"*/}
                    {/*style={{fontSize: '24px'}}>作业表情分析NOOM</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/homeworkModule?classId=819"*/}
                    {/*style={{fontSize: '24px'}}>作业模块</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/curriculumSchedule?ident=23836&curriculumType=1&access=23836"*/}
                    {/*style={{fontSize: '24px'}}>课程表列表</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/curriculumSchedule?ident=23836&curriculumType=2&access=23836"*/}
                    {/*style={{fontSize: '24px'}}>公共教室课程表列表</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/workAttendance"*/}
                    {/*style={{fontSize: '24px'}}>出勤</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/noticeReadMore?classroomId=1"*/}
                    {/*style={{fontSize: '24px'}}>通知查看更多</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/classroomManage?uid=23836"*/}
                    {/*style={{fontSize: '24px'}}>教室管理页面</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/classDemeanor?ident=23836&access=23836"*/}
                    {/*style={{fontSize: '24px'}}>班级风采</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/classHonor?ident=23836&access=23836"*/}
                    {/*style={{fontSize: '24px'}}>班级荣誉</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/moralEducation?ident=23836"*/}
                    {/*style={{fontSize: '24px'}}>德育评价</Link></li>*/}
                    <li><Link
                        to="/classCardHomePage?clazzId=819&roomId=1&mac=14:1f:78:73:1e:c3&schoolId=9"
                        style={{fontSize: '24px'}}>班牌首页</Link></li>
                    {/*<li><Link*/}
                    {/*to="/publicClassCardHomePage?roomId=2&mac=02:00:00:00:00:00"*/}
                    {/*style={{fontSize: '24px'}}>公共教室班牌首页</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/notifyBack?access_user=23836"*/}
                    {/*style={{fontSize: '24px'}}>通知后台</Link></li>*/}
                    {/* <li><Link
                    to="/addNotify?ident=23836"
                    style={{fontSize: '24px'}}>添加通知</Link></li> */}
                    {/*<li><Link*/}
                    {/*to="/notifyDetail"*/}
                    {/*style={{fontSize: '24px'}}>通知详情</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/studentDutyList?access_user=23836"*/}
                    {/*style={{fontSize: '24px'}}>班级值日表</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/tableItemDetil"*/}
                    {/*style={{fontSize: '24px'}}>课程表内页</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/comments?access_user=23836&sid=1021&stype=1&access_user=6075"*/}
                    {/*style={{fontSize: '24px'}}>评论列表</Link></li>*/}
                    <li><Link
                        to="/classCardHomePageDoor?access_user=23836"
                        style={{fontSize: '24px'}}>后台总入口</Link></li>
                    <li><Link
                        to="/dashboard?destId=9&areaType=0"
                        style={{fontSize: '24px'}}>管理驾驶舱</Link></li>
                    <li><Link
                        to="/dashboardByCity?destId=9&areaType=0"
                        style={{fontSize: '24px'}}>宜昌市教育局管理驾驶舱</Link></li>
                    {/*<li><Link*/}
                    {/*to="/fileAnalysis?aid=590961"*/}
                    {/*style={{fontSize: '24px'}}>文件表情分析</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/studentSelectCourse?access_user=23852"*/}
                    {/*style={{fontSize: '24px'}}>学生选课系统</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/particlePath"*/}
                    {/*style={{fontSize: '24px'}}>运动轨迹</Link></li>*/}
                    <li><Link
                        to="/wxLogin?local=wxBindIndex"
                        style={{fontSize: '24px'}}>授权登录至微信绑定页面</Link></li>
                    <li><Link
                        to="/wxBindIndex"
                        style={{fontSize: '24px'}}>微信绑定</Link></li>
                    {/*<li><Link*/}
                    {/*to="/answerListFormTeacher?teacherId=23836&topicId=8888"*/}
                    {/*style={{fontSize: '24px'}}>查看学生作答情况(老师)</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/answerFormStudent?studentId=23991&topicId=8888"*/}
                    {/*style={{fontSize: '24px'}}>查看作答答案(学生)</Link></li>*/}
                    <li><Link
                        to="/lookAtTheAnswer?tpId=1285598&access_user=23836"
                        style={{fontSize: '24px'}}>查看作答</Link></li>
                    <li>
                        <Link
                            to="/waterWork?tid=8888&stuId=23993" style={{fontSize: '24px'}}>水滴作业</Link>
                    </li>
                    <li>
                        <Link
                            to="/attendanceTime?uid=23836" style={{fontSize: '24px'}}>考勤考勤</Link>
                    </li>
                    <li>
                        <Link
                            to="/inAndOutSchool?uid=23836" style={{fontSize: '24px'}}>出入校园考勤</Link>
                    </li>
                    <li>
                        <Link
                            to="/classAttendance?uid=23836" style={{fontSize: '24px'}}>班级考勤</Link>
                    </li>
                    <li>
                        <Link
                            to="/wxTemplate?uid=23836" style={{fontSize: '24px'}}>微信模板消息</Link>
                    </li>
                    <li>
                        <Link
                            to="/ARTextbookList?uid=23836" style={{fontSize: '24px'}}>AR教材</Link>
                    </li>
                    <li>
                        <Link
                            to="/ArIndex?uid=23836" style={{fontSize: '24px'}}>AR首页</Link>
                    </li>

                    {/*<li><Link*/}
                    {/*to="/attendanceStatistical?schoolId=9"*/}
                    {/*style={{fontSize: '24px'}}>出勤率统计(饼图)</Link></li>*/}
                    {/*<li><Link*/}
                    {/*to="/attendanceSatisticaForClass?schoolId=9"*/}
                    {/*style={{fontSize: '24px'}}>班级出勤率统计(柱状图)</Link></li>*/}

                    <li>
                        <Link
                            to="/wxLogin?local=contactsList" style={{fontSize: '24px'}}>聊天</Link>
                    </li>

                    <li>
                        <Link
                            to="/arDoor" style={{fontSize: '24px'}}>arDoor</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Index}/>
            {/*<Route path="s1" component={Stage1}/>*/}
            {/*<Route path="s3" component={Stage3}/>*/}
            {/*<Route path="s4" component={Stage4}/>*/}
            {/*<Route path="s5" component={Stage5}/>*/}
            <Route path="questionBank" getComponent={questionBank}/>
            <Route path="questionDetil" getComponent={questionDetil}/>
            <Route path="analysisList" getComponent={analysisList}/>
            <Route path="resultAnalysis" getComponent={resultAnalysis}/>
            <Route path="classReaultAnalysis" getComponent={classReaultAnalysis}/>
            <Route path="searchUserLocationInfo" getComponent={searchUserLocationInfo}/>
            <Route path="studentFaceStatistics" getComponent={studentFaceStatistics}/>
            <Route path="termitePlateLibrary" getComponent={termitePlateLibrary}/>
            <Route path="pushSubjectsFromTLibrary" getComponent={pushSubjectsFromTLibrary}/>
            <Route path="arrangementWork" getComponent={arrangementWork}/>
            <Route path="fileShareLink" getComponent={fileShareLink}/>
            <Route path="webMiddlePage" getComponent={webMiddlePage}/>
            <Route path="previewFile" getComponent={previewFile}/>
            <Route path="ringBinding" getComponent={ringBinding}/>
            <Route path="bindingBracelet" getComponent={bindingBracelet}/>
            <Route path="boxBracelet" getComponent={boxBracelet}/>
            <Route path="personalSettings" getComponent={personalSettings}/>
            <Route path="groupSetting" getComponent={groupSetting}/>
            <Route path="chatMsg" getComponent={chatMsg}/>
            <Route path="longList" getComponent={longList}/>
            <Route path="homeWorkUnderstandAnalysisByClass" getComponent={homeWorkUnderstandAnalysisByClass}/>
            <Route path="homeWorkUnderstandAnalysisByStudent"
                   getComponent={homeWorkUnderstandAnalysisByStudent}/>
            <Route path="homeWorkUnderstandAnalysisByClassSubject"
                   getComponent={homeWorkUnderstandAnalysisByClassSubject}/>
            <Route path="homeWorkUnderstandAnalysisGuide" getComponent={homeWorkUnderstandAnalysisGuide}/>
            <Route path="m3u8Player" getComponent={m3u8Player}/>
            <Route path="HomeWorkUnderstandAnalysisGuideByNoom"
                   getComponent={HomeWorkUnderstandAnalysisGuideByNoom}/>
            <Route path="brotherXu" getComponent={brotherXu}/>
            <Route path="homeworkModule" getComponent={homeworkModule}/>
            <Route path="curriculumSchedule" getComponent={curriculumSchedule}/>
            <Route path="workAttendance" getComponent={workAttendance}/>
            <Route path="noticeReadMore" getComponent={noticeReadMore}/>
            <Route path="classroomManage" getComponent={classroomManage}/>
            <Route path="addClassroomManage" getComponent={addClassroomManage}/>
            <Route path="addTeachBuild" getComponent={addTeachBuild}/>
            <Route path="workAttendance" getComponent={workAttendance}/>
            <Route path="noticeReadMore" getComponent={noticeReadMore}/>
            <Route path="addCurriculumSchedule" getComponent={addCurriculumSchedule}/>
            <Route path="updateCurriculumSchedule" getComponent={updateCurriculumSchedule}/>
            <Route path="definedTerm" getComponent={definedTerm}/>
            <Route path="classDemeanor" getComponent={classDemeanor}/>
            <Route path="classCardHomePage" getComponent={classCardHomePage}/>
            <Route path="publicClassCardHomePage" getComponent={publicClassCardHomePage}/>
            <Route path="moralEducation" getComponent={moralEducation}/>
            <Route path="addMoralEducation" getComponent={addMoralEducation}/>
            <Route path="updateMoralEducation" getComponent={updateMoralEducation}/>
            <Route path="assessMoralEducation" getComponent={assessMoralEducation}/>
            <Route path="updateClassroom" getComponent={updateClassroom}/>
            <Route path="notifyBack" getComponent={notifyBack}/>
            <Route path="addNotify" getComponent={addNotify}/>
            <Route path="notifyDetail" getComponent={notifyDetail}/>
            <Route path="studentDutyList" getComponent={studentDutyList}/>
            <Route path="addStudentDuty" getComponent={addStudentDuty}/>
            <Route path="editStudentDuty" getComponent={editStudentDuty}/>
            <Route path="currentAttendanceList" getComponent={currentAttendanceList}/>
            <Route path="classHonor" getComponent={classHonor}/>
            <Route path="tableItemDetil" getComponent={tableItemDetil}/>
            <Route path="comments" getComponent={comments}/>
            <Route path="classCardHomePageDoor" getComponent={classCardHomePageDoor}/>
            <Route path="fileAnalysis" getComponent={fileAnalysis}/>
            <Route path="studentSelectCourse" getComponent={studentSelectCourse}/>
            <Route path="getClassRoomList" getComponent={getClassRoomList}/>
            <Route path="getClassTableList" getComponent={getClassTableList}/>
            <Route path="newCurriculumSchedule" getComponent={newCurriculumSchedule}/>
            <Route path="newAddCurriculumSchedule" getComponent={newAddCurriculumSchedule}/>
            <Route path="newUpdateCurriculumSchedule" getComponent={newUpdateCurriculumSchedule}/>
            <Route path="classDemeanorList" getComponent={classDemeanorList}/>
            <Route path="classHonorList" getComponent={classHonorList}/>
            <Route path="clazzDutyList" getComponent={clazzDutyList}/>
            <Route path="particlePath" getComponent={particlePath}/>
            <Route path="dashboard" getComponent={dashboard}/>
            <Route path="dashboardByCity" getComponent={dashboardByCity}/>
            <Route path="healthList" getComponent={healthList}/>
            <Route path="warning" getComponent={warning}/>
            <Route path="health" getComponent={health}/>
            <Route path="warnList" getComponent={warnList}/>
            <Route path="studentMovement" getComponent={studentMovement}/>
            <Route path="schoolPlan" getComponent={schoolPlan}/>
            <Route path="littleAntPolicy" getComponent={littleAntPolicy}/>
            <Route path="wxLogin" getComponent={wxLogin}/>
            <Route path="warningAdminList" getComponent={warningAdminList}/>
            <Route path="addWarnAdmin" getComponent={addWarnAdmin}/>
            <Route path="waterWork" getComponent={waterWork}/>
            <Route path="attendanceTime" getComponent={attendanceTime}/>
            <Route path="newAttendanceTime" getComponent={newAttendanceTime}/>
            <Route path="updateAttendanceTime" getComponent={updateAttendanceTime}/>
            <Route path="answerFormStudent" getComponent={answerFormStudent}/>
            <Route path="answerListFormTeacher" getComponent={answerListFormTeacher}/>
            <Route path="lookAtTheAnswer" getComponent={LookAtTheAnswer}/>
            <Route path="waterWork" getComponent={waterWork}/>
            <Route path="attendanceStatistical" getComponent={attendanceStatistical}/>
            <Route path="attendanceSatisticaForClass" getComponent={attendanceSatisticaForClass}/>
            <Route path="inAndOutSchool" getComponent={inAndOutSchool}/>
            <Route path="classAttendance" getComponent={classAttendance}/>
            <Route path="wxTemplate" getComponent={wxTemplate}/>
            <Route path="ARTextbookList" getComponent={ARTextbookList}/>
            <Route path="addARTextbook" getComponent={addARTextbook}/>
            <Route path="UpdateARTextbook" getComponent={UpdateARTextbook}/>
            <Route path="groupList" getComponent={groupList}/>
            <Route path="ArIndex" getComponent={ArIndex}/>
            <Route path="wxBindIndex" getComponent={wxBindIndex}/>
            <Route path="contactsList" getComponent={contactsList}/>
            <Route path="chatDetil" getComponent={chatDetil}/>
            <Route path="arDoor" getComponent={arDoor}/>
            <Route path="excellentStu" getComponent={excellentStu}/>
        </Route>
    </Router>
    ,
    document.getElementById('example'));


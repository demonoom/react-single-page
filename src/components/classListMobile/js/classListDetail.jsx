import React from "react";
import "../css/classListDetail.less"
var calm;
export default class classListDetail extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            studentListData: [],
            studentPartData: [],
            showAllStu: false
        }
    }
    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var className = locationSearchArray[0].split("=")[1];
        var classId = locationSearchArray[1].split("=")[1];
        console.log(className)
        calm.setState({
            classId
        })
        document.title = className;
        calm.getPart(classId)
    }
    componentDidMount() {

    }


    /**
    *获取实时学生列表
    */
    getPart(classId) {
        var param = {
            "method": 'getBraceletOpeningStudentByClazzId',
            "clazzId": classId,
            "type": 1
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "学生")
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        calm.setState({
                            studentPartData: result.response
                        })
                    }
                }
            },
            onError: function (error) {
                message.error(error)
            }
        });
    }
    /**
    *获取学生列表
    */
    getAll() {
        var param = {
            "method": 'getBraceletOpeningStudentByClazzId',
            "clazzId": calm.state.classId,
            "type": 2
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result, "学生")
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        calm.setState({
                            studentListData: result.response
                        })
                    }
                }
            },
            onError: function (error) {
                message.error(error)
            }
        });
    }
    /**
     * 显示全部学生列表
     */
    getStuList() {
        calm.getAll();
        calm.setState({
            showAllStu: true
        })
    }
    /**
     * 显示范围学生列表
     */
    getPartStu() {
        calm.getPart(calm.state.classId)
        calm.setState({
            showAllStu: false
        })
    }
    /**
     * 跳转学生详情页
     */
    toStudentDetail = (v) => {
        var url = WebServiceUtil.mobileServiceURL + "studentDetail?className=" + v.user.userName + "&uid=" + v.user.colUid+"&heartRate="+v.heartRate+"&step="+v.step;
        var data = {
            method: 'openNewPage',
            url: url,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    render() {
        return (
            <div id="classListDetail">
                <div className='tabCont'>
                    <div style={{ display: calm.state.showAllStu ? "none" : "block" }} >
                        <div className='content'>
                            {
                                calm.state.studentPartData.map((v, i) => {
                                    return (
                                        <div className='line_public' onClick={calm.toStudentDetail.bind(this,v)}>
                                            <span className='text_hidden'>{v.user.userName}</span>
                                            {
                                                v.heartRate > 140 ?
                                                <span>红色爱心</span>
                                                :
                                                v.heartRate > 120 ?
                                                <span>橙色爱心</span>
                                                :
                                                v.heartRate > 100 ?
                                                <span>黄色爱心</span>
                                                :
                                                v.heartRate > 90 ?
                                                <span>蓝色爱心</span>
                                                :
                                                <span>绿色爱心</span>

                                                
                                            }
                                           
                                            <span>{v.heartRate}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
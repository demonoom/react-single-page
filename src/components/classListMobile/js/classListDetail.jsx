import React from "react";
import "../css/classListDetail.less"
var calm;
export default class classListDetail extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            studentListData: [],
            showAllStu:false
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
        // calm.getClazzesByUserId(id)
    }
    componentDidMount() {

    }

    /**
     *获取班级的ID
     */
    // getClazzesByUserId(id) {
    //     var _this = this;
    //     var param = {
    //         "method": 'getClazzesByUserId',
    //         "userId": id
    //     };
    //     WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
    //         onResponse: function (result) {
    //             console.log(result, "班级列表")
    //             if (result.msg == '调用成功' || result.success == true) {
    //                 if (WebServiceUtil.isEmpty(result.response) == false) {
    //                     // var arr = [];
    //                     // result.response.forEach(function (v, i) {
    //                     //     arr.push({
    //                     //         value: v.id, label: v.name
    //                     //     })
    //                     // })
    //                     calm.setState({ classListData: result.response })
    //                 }
    //             }
    //         },
    //         onError: function (error) {
    //             message.error(error)
    //         }
    //     });
    // }


    /**
    *获取学生列表
    */
    getClassStudents() {
        var param = {
            "method": 'getClassStudents',
            "clazzId": calm.state.classId
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
    getStuList(){
        calm.getClassStudents();
        calm.setState({
            showAllStu:true
        })
    }
    /**
     * 显示范围学生列表
     */
    getPartStu(){
        calm.setState({
            showAllStu:false
        })
    }
    /**
     * 跳转学生详情页
     */
    toStudentDetail=(v)=>{
        var url = WebServiceUtil.mobileServiceURL + "studentDetail?className=" +v;
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
                <div className='tabTitle'>
                    <span className={calm.state.showAllStu ? "" : "highLight"} onClick={calm.getPartStu}>范围内实时数据列表</span>
                    <span className={calm.state.showAllStu ? "highLight" : ""} onClick={calm.getStuList}>全部学生列表</span>
                </div>
                
                <div style={{display:calm.state.showAllStu ? "none":"block"}} >
                <div>
                    <span>学生姓名</span>
                    <span>实时心率</span>
                    <span>今日步数</span>
                </div>
                    范围内实时数据
                </div>
                <div style={{display:calm.state.showAllStu ? "block":"none"}}>
                    {
                        calm.state.studentListData.map((v, i) => {
                            return (
                                <div onClick={calm.toStudentDetail.bind(this, v.userName)}>
                                    <span>{v.userName}</span>
                                    <span></span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
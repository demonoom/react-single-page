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
            "type":1
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
            "type":2
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
        calm.getAll();
        calm.setState({
            showAllStu:true
        })
    }
    /**
     * 显示范围学生列表
     */
    getPartStu(){
        calm.getPart(calm.state.classId)
        calm.setState({
            showAllStu:false
        })
    }
    /**
     * 跳转学生详情页
     */
    toStudentDetail=(v)=>{
        var url = WebServiceUtil.mobileServiceURL + "studentDetail?className=" +v.user.userName+"&uid="+v.user.colUid;
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
                <div className='tabTitle my_flex line_public'>
                    <div>
                         <span className={calm.state.showAllStu ? "" : "highLight"} onClick={calm.getPartStu}>范围内实时数据列表</span>
                    </div>
                    <div>
                         <span className={calm.state.showAllStu ? "highLight" : ""} onClick={calm.getStuList}>全部学生列表</span>
                    </div>
                </div>
                <div className='tabCont'>
                    <div style={{display:calm.state.showAllStu ? "none":"block"}} >
                        <div className='title line_public'>
                            <span>学生姓名</span>
                            <span>实时心率</span>
                            <span>今日步数</span>
                        </div>
                        <div className='content'>
                            {
                                calm.state.studentPartData.map((v,i)=>{
                                    return (
                                        <div className='line_public'>
                                            <span className='text_hidden'>{v.user.userName}</span>
                                            <span>{v.heartRate}</span>
                                            {
                                                v.heartRate > 150 ?
                                                    <span>感叹号</span>
                                                    :
                                                    ""

                                            }
                                            <span>{v.step}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div style={{display:calm.state.showAllStu ? "block":"none"}}>
                        {
                            calm.state.studentListData.map((v, i) => {
                                return (
                                    <div className='my_flex line_public studentItem' onClick={calm.toStudentDetail.bind(this, v)}>
                                        <span className='studentTitle text_hidden'>{v.user.userName}</span>
                                        {v.status ? <span className='status'>已监测</span> : <span className='status'>未监测</span> }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        )
    }
}
import React from "react";

var calm;
export default class studentList extends React.Component{
    constructor(props){
        super(props);
        calm = this;
        this.state = {
            studentListData:[]
        }
    }
    componentDidMount(){
        document.title = "手环检测统计列表"
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var locationSearchArray = locationSearch.split("&");
        var clazzId = locationSearchArray[0].split("=")[1];
        calm.getClassStudents(clazzId)
    }

    /**
     *获取班级的ID
     */
    getClassStudents(clazzId) {
        var _this = this;
        var param = {
            "method": 'getClassStudents',
            "clazzId": clazzId
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                console.log(result,"学生")
                if (result.msg == '调用成功' || result.success == true) {
                    if (WebServiceUtil.isEmpty(result.response) == false) {
                        calm.setState({
                            studentListData:result.response
                        })
                        // var arr = [];
                        // result.response.forEach(function (v, i) {
                        //     arr.push({
                        //         value: v.id, label: v.name
                        //     })
                        // })
                    }
                }
            },
            onError: function (error) {
                message.error(error)
            }
        });
    }

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

    getPartStu(){
        
    }
    render (){
        return(
            <div>
                 <div>
                    <span onClick={calm.getPartStu}>范围内实时数据列表</span>
                    <span>全部学生列表</span>
                </div>
                {
                    calm.state.studentListData.map((v,i)=>{
                        return (
                            <div onClick={calm.toStudentDetail.bind(this,v.userName)}>
                                <span>{v.userName}</span>
                                <span></span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
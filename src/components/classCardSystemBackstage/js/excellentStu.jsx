import React from "react";
import {Toast} from "antd-mobile"
var topStu;
export default class excellentStu  extends React.Component{
    constructor(props){
        super(props);
        topStu = this;
        this.state = {
            getExcellentStuData:[]
        }
    }

    componentDidMount(){
        document.title = "早到之星";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var classId = locationSearch.split("&")[0].split('=')[1];
        this.setState({
            classId
        })
        this.getBraceletAttendTopStudentByClazzId(classId)
    }

    /**
     * 根据班级ID获取谁数据
     */
    getBraceletAttendTopStudentByClazzId(classId){
        var param = {
            "method": 'getBraceletAttendTopStudentByClazzId',
            "clazzId": classId
        };
        console.log(param)
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.success) {
                    console.log(result.response)
                    this.setState({
                        getExcellentStuData:result.response
                    })
                } else {
                    Toast.fail('请求出错');
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }
    /**
     * 返回首页
     */
    historyGoBack() {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }
    render(){
        
        return (
            <div>
                <div className="navBar">
                        <span onClick={this.historyGoBack}>首页</span>
                        <span className="icon"></span>
                        <span>早到之星</span>
                    </div>
                {
                    topStu.state.getExcellentStuData.map((v,i)=>{
                        console.log(v);
                        return (
                            <div>
                                <span>{i+1}</span>
                                <img src={v.user.avatar} />
                                <span>{WebServiceUtil.formatHM(v.attendTime)}</span>
                                <span>{v.user.userName}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
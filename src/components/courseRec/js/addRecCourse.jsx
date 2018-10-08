import React from "react";
import { Tabs, WhiteSpace, ListView, Button, List, Radio, TextareaItem, Toast, Modal, } from 'antd-mobile';
import '../css/addRecCourse.less'
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;

var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
export default class addRecCourse extends React.Component {

    constructor(props) {
        super(props);
        calm = this;
        calm.initDataSource = [];
        this.state = {
            initObj: {
                videos:[],
                courseType:{},
                users:[
                    {}
                ]
            }
        }
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var id = locationSearch.split("&")[0].split("=")[1];
        var userId = locationSearch.split("&")[1].split("=")[1];
        var cName = locationSearch.split("&")[2].split("=")[1];
        document.title = decodeURI(cName);

        calm.setState({
            "id": id,
            "userId": userId
        }, () =>
                calm.getCourseByCourseId(id, userId))

        window.addEventListener('resize', calm.onWindowResize);

    }
    /**
     * 详情页
     */
    getCourseByCourseId(id, userId) {
        var param = {
            "method": 'getCourseByCourseId',
            "id": id,
            "publisher_id": userId,
        };
        WebServiceUtil.requestLittleElearningWeb(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "hhhhh");
                calm.setState({
                    initObj: result.response
                }
                )

            },
            onError: function (error) {
            }
        });
    }

    render() {
        var _this = this;
        console.log(calm.state.initObj)
        return (
            <div id="addRecCourse" style={{
                height: document.body.clientHeight
            }}>
                <div className="imgCont">
                    <img src={calm.state.initObj.image} alt="" srcSet=""/>
                </div>
               <div className="topCont bg">

                   <div className='courseTime'>开课时长：
                       {
                           calm.state.initObj.videos.length == 1 ?
                               <span>{WebServiceUtil.formatYMD(calm.state.initObj.createTime)}</span>
                               :
                               <span>
                            {WebServiceUtil.formatMD2(calm.state.initObj.createTime) + '-' + WebServiceUtil.formatMD2(calm.state.initObj.endTime)}
                        </span>

                       }
                       <span className='tag'>{calm.state.initObj.courseType.name}</span>
                   </div>
                   <div>时长:{calm.state.initObj.videos.length}课时</div>
               </div>
                <div className='bg teacherInfo'>
                    <div className="title">老师简介</div>
                   <div>
                       <div className='my_flex item'>
                           <img src={calm.state.initObj.users[0].avatar} alt=""/>
                           <div className='rightText'>
                               <div className='text_hidden'>{calm.state.initObj.users[0].userName}</div>
                               <div>{calm.state.initObj.users[0].userContent == "" ? "暂无简介":calm.state.initObj.users[0].userContent}</div>
                           </div>
                       </div>
                   </div>
                </div>
                <div className='bg'>
                    <div className="title">课程介绍</div>
                    <div className="text">
                        {calm.state.initObj.content == "" ? "暂无内容":calm.state.initObj.content}
                    </div>
                </div>

            </div>
        )
    }
}
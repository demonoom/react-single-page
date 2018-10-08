import React from "react";
import { Tabs, WhiteSpace, ListView, Button, List, Radio, TextareaItem, Toast, Modal, } from 'antd-mobile';
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
            <div id="lookThrough" style={{
                height: document.body.clientHeight
            }}>
                <img src={calm.state.initObj.image} alt="" srcset="" />
                <div>{calm.state.initObj.courseType.name}</div>
                <div>开课时长：
                {
                    calm.state.initObj.videos.length == 1 ?
                        <span>{WebServiceUtil.formatYMD(calm.state.initObj.createTime)}</span>
                        :
                        <span>
                            {WebServiceUtil.formatMD2(calm.state.initObj.createTime) + '-' + WebServiceUtil.formatMD2(calm.state.initObj.endTime)}
                        </span>

                }
                </div>
                <div>时长:{calm.state.initObj.videos.length}课时</div>
                <div>老师简介
                    <div>
                        <img src={calm.state.initObj.users[0].avatar} alt=""/>
                        <span>{calm.state.initObj.users[0].userName}</span>
                        <span>{calm.state.initObj.users[0].userContent}</span>
                    </div>
                </div>
                <div>课程介绍{calm.state.initObj.content}</div>

            </div>
        )
    }
}
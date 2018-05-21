import React from 'react';
import {Toast} from 'antd-mobile';
import '../../css/homePage/course.less'

var demeanor;

export default class course extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {
            data: null,
        };
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.messageUtilObj.command == 'brand_class_open') {
            //查看某个课表项(一接收到开课命令就获取当前开课)
            this.viewCourseTableItem(nextProps.messageUtilObj.data)
        } else if (nextProps.messageUtilObj.command == 'brand_class_close') {
            this.setState({data: null})
        }
    }

    componentDidMount() {
        this.viewCourseTableItem()
    }

    /**
     * 查看某个课表项
     * @param data
     */
    viewCourseTableItem(data) {
        var _this = this;
        var param = {
            "method": 'viewCourseTableItem',
            // "id": data.classTableId,
            "id": 3,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.setState({data: result.response})
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    render() {
        var classData = this.state.data;
        return (
            <div id="course" className="home_card course_height">
                <h3 className="home_title">今日课程</h3>
                {WebServiceUtil.isEmpty(classData) ?
                    <div className='classTableA'>暂未开课</div> :
                    <div className='classTableB'>
                        <div className='index'>第{classData.index}节</div>
                        <div className='timeNode'>当前时段</div>
                        <div className='time'>{classData.openTime + '-' + classData.closeTime}</div>
                        <div><span className='name'>{classData.courseName}</span></div>
                        {/*<img className='terPic' src={classData.teacher.avatar} alt=""/>*/}
                        <img
                            className='terPic'
                            src="http://60.205.86.217/upload6/2018-02-09/19/805eee4a-b707-49a2-9c75-d5b14ed9227b.jpg?size=100x100"
                            alt=""/>
                    </div>}
            </div>
        );
    }
}

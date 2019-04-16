import React from 'react';
import {
    TextareaItem,List
} from 'antd-mobile';
import "./addSchoolInfo.less"
var teacherV;
export default class addSchoolInfo extends React.Component {
    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {
            schoolInfo: ""
        };
    }
    componentDidMount () {
        Bridge.setShareAble("false");
    }
    componentWillMount () {
        document.title = '添加学校简介';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        window.addEventListener('resize', this.onWindwoResize);
        var clazzroomId = locationSearch.split("&")[0].split('=')[1];
        var classTableId = locationSearch.split("&")[1].split('=')[1];
        this.setState({ clazzroomId, classTableId })
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onWindwoResize);
    }

    //监听窗口改变时间
    onWindwoResize () {
        setTimeout(() => {
            teacherV.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }

    /**
     * 简介变化
     */
    textareaOnChange = (value) => {
        this.setState({
            schoolInfo: value
        })
    }

    //保存学校简介
    toSaveSchoolInfo = () => {
        console.log(this.state.schoolInfo, "schoolInfo")
    }

    render () {
        return (
            <div id="addSchoolInfo">
                <div className="school-info">
                    <List renderHeader={() => '学校简介'}>
                        <TextareaItem
                            placeholder="请输入学校简介"
                            autoHeight
                            value={this.state.schoolInfo}
                            labelNumber={5}
                            onChange={this.textareaOnChange.bind(this)}
                        />
                    </List>
                </div>
                <div className="btn-save" onClick={this.toSaveSchoolInfo}>保存</div>
            </div>
        );
    }
}

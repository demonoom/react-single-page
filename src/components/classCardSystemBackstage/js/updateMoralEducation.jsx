import React from 'react';
import {
    List,
    WhiteSpace,
    Button,
    WingBlank,
    InputItem,
    Modal,
    Toast
} from 'antd-mobile';
import '../css/updateMoralEducation.less';

var updateMoralEdu;
const prompt = Modal.prompt;


export default class updateMoralEducation extends React.Component {
    constructor(props) {
        super(props);
        updateMoralEdu = this;
        this.state = {
            cols: 1,
            data: [],
            showData: {}
        };
    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var id = locationSearch.split("&")[0].split("=")[1];
        var name = decodeURI(locationSearch.split("&")[1].split("=")[1]);
        updateMoralEdu.setState({
            "id": id,
            "cName": name
        })
    }
    componentDidMount() {
        document.title = `${decodeURI(updateMoralEdu.state.cName)}`;
        this.findMoralEducationById(updateMoralEdu.state.id)
    }


    /**
   * 查看对应教室ID的德育信息
   */
    findMoralEducationById(id) {
        var _this = this;

        var param = {
            "method": 'findMoralEducationById',
            "id": id,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    _this.setState({
                        "showData": result.response,
                        "health": result.response.health,
                        "politeness": result.response.politeness
                    })
                } else {
                    Toast.fail(result.msg, 1);
                }
            },
            onError: function (error) {
                Toast.info(error);
            }
        });
    }
    /**
     * 提交新增的德育项
     */
    addMoralEducationTableItem = () => {

        if ($(".healthValue input").val().trim() == '' || $(".healthValue input").val().trim().length == 0) {
            Toast.fail('请填写礼貌评分')
            return
        }
        if ($(".politeValue input").val().trim() == '' || $(".healthValue input").val().trim().length == 0) {
            Toast.fail('请填写健康评分')
            return
        }
        const param = {
            "method": "updateMoralEducation",
            "moralEducationJson": {
                "id": updateMoralEdu.state.id,
                "health": updateMoralEdu.state.health,
                "politeness": updateMoralEdu.state.politeness
            }
        }

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('修改成功');
                    setTimeout(function () {
                        var data = {
                            method: 'finishForRefresh',
                        };
                        Bridge.callHandler(data, null, function (error) {
                        });
                    }, 1000)
                }
            },
            onError: function (error) {
                message.error(error)
            }
        });
    }



    render() {
        const CustomChildren = ({ extra, onClick, children }) => (
            <div className="am-list-item am-list-item-middle"
                onClick={onClick}
            >
                <div className="am-list-line">
                    <div className="am-list-content">{children}<i className="redStar">*</i></div>
                    <span className="choiceData am-list-extra" style={{ float: 'right', color: '#888' }}>{extra}</span><div className="am-list-arrow am-list-arrow-horizontal"></div>
                </div>
            </div>

        );
        return (
            <div id="updateMoralEducation" style={{ height: document.body.clientHeight }}>
                <WhiteSpace size="lg" />

                <div className='CourseTableArea'>
                    <div className="classSearchResultInfo">
                        <List>
                            <InputItem
                                className="politeValue"
                                clear
                                placeholder="请输入分数"
                                value={updateMoralEdu.state.politeness}
                                onChange={v => { updateMoralEdu.setState({ "politeness": v }) }}
                                ref={el => this.autoFocusInst = el}
                            >班级礼貌评分</InputItem>
                            <InputItem
                                className="healthValue"
                                clear
                                placeholder="请输入分数"
                                value={updateMoralEdu.state.health}
                                onChange={v => { updateMoralEdu.setState({ "health": v }) }}
                                ref={el => this.autoFocusInst = el}
                            >班级健康评分</InputItem>
                        </List>
                    </div>
                </div>
                <div className='addCourseButton'>
                    <WhiteSpace size="lg" />
                    <WingBlank>
                        <Button type="warning" onClick={this.addMoralEducationTableItem}>提交</Button>
                    </WingBlank>
                </div>
            </div>
        );
    }
}
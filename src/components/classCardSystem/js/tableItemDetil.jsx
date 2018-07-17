import React from "react";
import '../css/tableItemDetil.less';

export default class tableItemDetil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tbody: []
        }

    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var defaultId = searchArray[0].split('=')[1];
        this.setState({defaultId})
    }

    componentDidMount() {
        this.viewCourseTable()
    }

    /**
     * 获取教室课程表
     * rid教室id
     */
    viewCourseTable = () => {
        var _this = this;
        var param = {
            "method": 'viewRoomCourseTable',
            "rid": localStorage.getItem('roomId'),
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    _this.buileTable(result.response)
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 构建课程表
     * @param data
     */
    buileTable = (data) => {
        var tbody = [];
        for (var k in data) {
            var trs = [<td>{k}</td>];
            data[k].forEach(function (v, i) {
                if (WebServiceUtil.isEmpty(v.courseName) == false) {
                    var td = <td>
                        <span className="class_name" style={{display: 'block'}}>{v.courseName}</span>
                        <span style={{display: 'block'}}>{v.classRoom.name}</span>
                        <span style={{display: 'block'}}>{"(" + v.openTime + '-' + v.closeTime + ")"}</span>
                    </td>
                } else {
                    var td = <td></td>
                }
                trs.push(td);
            })
            var tr = <tr>{trs}</tr>
            tbody.push(tr);
        }
        this.setState({tbody});
    };

    historyGoBack() {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
        // history.back()
    }

    render() {
        return (
            <div id={this.state.defaultId}>
                <div id="tableItemDetil" className="home_content" style={{height: document.body.clientHeight}}>
                    <div className="inner_bg">
                        <div className="navBar">
                            <span onClick={this.historyGoBack}>首页</span>
                            <span className="icon"></span>
                            <span>课程表</span>
                        </div>
                        <div className="black_bg">
                            <table className='tableItem'>
                                <thead>
                                <tr>
                                    <td>节次</td>
                                    <td>星期一</td>
                                    <td>星期二</td>
                                    <td>星期三</td>
                                    <td>星期四</td>
                                    <td>星期五</td>
                                    <td>星期六</td>
                                    <td>星期日</td>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.tbody}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
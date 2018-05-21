import React from "react";
import '../css/tableItemDetil.less'

export default class tableItemDetil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tbody: []
        }

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
            "method": 'viewCourseTable',
            "rid": 1,
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
                        <span style={{display: 'block'}}>{v.courseName}</span>
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
    }

    render() {
        return (
            <div id="tableItemDetil" style={{height: document.body.clientHeight}}>
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
        )
    }
}
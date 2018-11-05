import React from 'react';
import {
    Picker,
    Button,
    Checkbox,
    Toast
} from 'antd-mobile';
import '../css/updateClassTimingItem.less'

var classBinding;

export default class updateClassTimingItem extends React.Component {

    constructor(props) {
        super(props);
        classBinding = this;
        this.state = {
            openTime: '09:30',
            closeTime: '18:30',
            data: [
                {value: 1, label: '周一', checked: false, disabled: false},
                {value: 2, label: '周二', checked: false, disabled: false},
                {value: 3, label: '周三', checked: false, disabled: false},
                {value: 4, label: '周四', checked: false, disabled: false},
                {value: 5, label: '周五', checked: false, disabled: false},
                {value: 6, label: '周六', checked: false, disabled: false},
                {value: 0, label: '周日', checked: false, disabled: false},
            ]
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '班牌定时';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var pid = locationSearch.split("&")[0].split("=")[1];
        var tid = locationSearch.split("&")[1].split("=")[1];
        var regular = locationSearch.split("&")[2].split("=")[1];
        var openTime = locationSearch.split("&")[3].split("=")[1];
        var closeTime = locationSearch.split("&")[4].split("=")[1];
        this.setState({pid, tid, regular, openTime, closeTime}, () => {
            this.getUpdateRemainingTime(pid, tid)
        })
    }

    /**
     * 返回剩余日期
     * @param pid
     */
    getUpdateRemainingTime = (pid, tid) => {
        var _this = this;
        var param = {
            "method": 'getUpdateRemainingTime',
            "pid": pid,
            "tid": tid,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    _this.setState({
                        data: _this.state.data.map((v) => {
                            v.checked = !result.response.includes(v.label) || _this.state.regular.split(',').includes(String(v.value))
                            v.disabled = !result.response.includes(v.label)
                            return v
                        })
                    })
                } else {
                    Toast.fail(result.msg, 2)
                }
            },
            onError: function (error) {
            }
        });
    }

    /**
     * 星期改变的回调
     * @param data
     */
    dataOnChange = (data) => {
        this.setState({
            data: this.state.data.map((v) => {
                if (v.value === data.value) {
                    v.checked = !v.checked
                }
                return v
            })
        })
    }

    /**
     * 添加定时规则
     *  updateClazzPlanTime(String tid,String pid,String regular,String upTime,String offTime)
     */
    saveClazzPlanTime = () => {
        var regular = ''
        this.state.data.forEach((e) => {
            if (!e.disabled) {
                if (e.checked) {
                    regular += e.value + ','
                }
            }
        })
        if (regular === '') {
            Toast.fail('请选择每周重复周期', 2)
            return
        }
        if (this.state.openTime === this.state.closeTime) {
            Toast.fail('开启时间关闭时间不能相同', 2)
            return
        }
        var param = {
            "method": 'updateClazzPlanTime',
            "pid": this.state.pid,
            "tid": this.state.tid,
            "regular": regular.substr(0, regular.length - 1),
            "upTime": this.state.openTime + ':00',
            "offTime": this.state.closeTime + ':00',
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('更新成功', 2)
                    setTimeout(function () {
                        var data = {
                            method: 'finishForRefresh',
                        };
                        Bridge.callHandler(data, null, function (error) {
                        });
                    }, 2000)
                } else {
                    Toast.fail(result.msg, 2)
                }
            },
            onError: function (error) {
            }
        });
    }

    render() {
        const seasons = [
            [
                {
                    label: '00',
                    value: '00',
                },
                {
                    label: '01',
                    value: '01',
                },
                {
                    label: '02',
                    value: '02',
                }
                ,
                {
                    label: '03',
                    value: '03',
                },
                {
                    label: '04',
                    value: '04',
                },
                {
                    label: '05',
                    value: '05',
                },
                {
                    label: '06',
                    value: '06',
                },
                {
                    label: '07',
                    value: '07',
                },
                {
                    label: '08',
                    value: '08',
                },
                {
                    label: '09',
                    value: '09',
                },
                {
                    label: '10',
                    value: '10',
                },
                {
                    label: '11',
                    value: '11',
                },
                {
                    label: '12',
                    value: '12',
                },
                {
                    label: '13',
                    value: '13',
                },
                {
                    label: '14',
                    value: '14',
                },
                {
                    label: '15',
                    value: '15',
                },
                {
                    label: '16',
                    value: '16',
                },
                {
                    label: '17',
                    value: '17',
                },
                {
                    label: '18',
                    value: '18',
                },
                {
                    label: '19',
                    value: '19',
                },
                {
                    label: '20',
                    value: '20',
                },
                {
                    label: '21',
                    value: '21',
                },
                {
                    label: '22',
                    value: '22',
                },
                {
                    label: '23',
                    value: '23',
                }
            ],
            [
                {
                    label: '00',
                    value: '00',
                },
                {
                    label: '30',
                    value: '30',
                },
            ],
        ];

        return (
            <div id="updateClassTimingItem">
                <div className='mainCont'>
                    <div>
                        <div className='title positionDiv'>每周重复日期<i className="redStar">*</i></div>
                        <div>
                            {this.state.data.map(i => (
                                <Checkbox key={i.value} checked={i.checked}
                                          disabled={i.disabled}
                                          onChange={this.dataOnChange.bind(this, i)}>
                                    {i.label}
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                    <div className="timeCont my_flex">
                        <span className='positionDiv'>开启时间<i className="redStar">*</i></span>
                        <Picker
                            data={seasons}
                            title="开启时间"
                            cascade={false}
                            extra="请选择"
                            onOk={v => {
                                var openTime = v[0] + ':' + v[1]
                                this.setState({openTime})
                            }}
                        >
                            <div className="am-list-item am-list-item-middle">
                                <span>{this.state.openTime}</span>
                                <div className="am-list-line">
                                    <div className="am-list-arrow am-list-arrow-horizontal"></div>
                                </div>
                            </div>
                        </Picker>
                    </div>
                    <div className="timeCont my_flex">
                        <span className='positionDiv'>关闭时间<i className="redStar">*</i></span>
                        <Picker
                            data={seasons}
                            title="关闭时间"
                            cascade={false}
                            onOk={v => {
                                var closeTime = v[0] + ':' + v[1]
                                this.setState({closeTime})
                            }}
                        >
                            <div className="am-list-item am-list-item-middle">
                                <span>{this.state.closeTime}</span>
                                <div className="am-list-line">
                                    <div className="am-list-arrow am-list-arrow-horizontal"></div>
                                </div>
                            </div>
                        </Picker>
                    </div>
                </div>
                <Button type="primary" size='small' onClick={this.saveClazzPlanTime}>保存</Button>
            </div>
        );
    }
}

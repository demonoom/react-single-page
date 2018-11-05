import React from 'react';
import {
    Picker,
    Button,
    Checkbox
} from 'antd-mobile';

var classBinding;

export default class addClassTimingItem extends React.Component {

    constructor(props) {
        super(props);
        classBinding = this;
        this.state = {
            openTime: '09:30',
            closeTime: '18:30',
        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '班牌定时';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var uid = locationSearch.split("&")[0].split("=")[1];
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

        const data = [
            {value: 1, label: '周一'},
            {value: 2, label: '周二'},
            {value: 3, label: '周三'},
            {value: 4, label: '周四'},
            {value: 5, label: '周五'},
            {value: 6, label: '周六'},
            {value: 7, label: '周日'},
        ];

        return (
            <div id="addClassTimingItem">
                <div>
                    <span>每周重复日期</span>
                    <div>
                        {data.map(i => (
                            <Checkbox key={i.value} onChange={() => console.log(i.value)}>
                                {i.label}
                            </Checkbox>
                        ))}
                    </div>
                </div>
                <div>
                    <span>开启时间:</span>
                    <Picker
                        data={seasons}
                        title="开启时间"
                        cascade={false}
                        onOk={v => {
                            var openTime = v[0] + ':' + v[1]
                            this.setState({openTime})
                        }}
                    >
                        <span>{this.state.openTime}</span>
                    </Picker>
                </div>
                <div>
                    <span>关闭时间:</span>
                    <Picker
                        data={seasons}
                        title="关闭时间"
                        cascade={false}
                        onOk={v => {
                            var closeTime = v[0] + ':' + v[1]
                            this.setState({closeTime})
                        }}
                    >
                        <span>{this.state.closeTime}</span>
                    </Picker>
                </div>
                <Button type="primary" size='small'>保存</Button>
            </div>
        );
    }
}

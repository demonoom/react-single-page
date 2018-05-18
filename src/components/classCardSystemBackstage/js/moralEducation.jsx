import React from 'react';
import { Picker, List, WhiteSpace,DatePicker } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import '../css/moralEducation.less'
const mEducation = this;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// GMT is not currently observed in the UK. So use UTC now.
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));

// Make sure that in `time` mode, the maxDate and minDate are within one day.
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
// const CustomChildren = ({ extra, onClick, children }) => (
//     <div
//         onClick={onClick}
//         style={{ backgroundColor: '#fff', height: '45px', lineHeight: '45px', padding: '0 15px' }}
//     >
//         {children}
//         <span style={{ float: 'right', color: '#888' }}>{extra}</span>
//     </div>
// );
function formatDate(date) {
    /* eslint no-confusing-arrow: 0 */
    const pad = n => n < 10 ? `0${n}` : n;
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${dateStr} ${timeStr}`;
}

const seasons = [
    [
        {
            label: '请选择',
            value: '0',
        },
        {
            label: '二年级一班',
            value: '2013',
        },
        {
            label: '二年级二班',
            value: '2014',
        },
    ],
    [
        {
            label: '请选择',
            value: '0',
        },
        {
            label: '春',
            value: '春',
        },
        {
            label: '夏',
            value: '夏',
        },
    ],
];

export default class curriculumSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cols: 1,
            asyncValue: [],
            sValue: ['0', '0'],
            visible: false,
            date: now,
            time: now,
            utcDate: utcNow,
            dpValue: null,
            customChildValue: null,
            visible: false,
        };
    }
    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                console.log(this.props.form.getFieldsValue());
            } else {
                console.log(error);
                alert('Validation failed');
            }
        });
    }
    onReset = () => {
        this.props.form.resetFields();
        setTimeout(() => console.log(this.state), 0);
    }
    validateIdp = (rule, date, callback) => {
        if (isNaN(Date.parse(date))) {
            callback(new Error('Invalid Date'));
        } else {
            const cDate = new Date(date);
            const newDate = new Date(+this.state.dpValue);
            newDate.setFullYear(cDate.getFullYear());
            newDate.setMonth(cDate.getMonth());
            newDate.setDate(cDate.getDate());
            // this.setState({ dpValue: newDate });
            setTimeout(() => this.props.form.setFieldsValue({ dp: newDate }), 10);
            callback();
        }
    }
    validateDatePicker = (rule, date, callback) => {
        if (date && date.getMinutes() !== 15) {
            callback();
        } else {
            callback(new Error('15 is invalid'));
        }
    }
    componentDidMount() {
        document.title = '班级课程表';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var ident = locationSearch.split("=")[1];
        var loginUser = {
            "colUid": ident,
        };
        localStorage.setItem("loginUserSchedule", JSON.stringify(loginUser));
    }

 
    getSelectData(){
       console.log("123");
    }
    /**
     * 增加课程表的回调
     */
    addSchedule() {
        var url = WebServiceUtil.mobileServiceURL + "addMoralEducation";
        var data = {
            method: 'openNewPage',
            url: url
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    /**
     * 查看课表项管理页
     * @param v
     */
    viewCourseTableItemPage(v) {
        console.log(v);
        //String uid, String sid, String w, String cid, String ri
    }

    render() {

        return (
            <div id="moralEducation" style={{ height: document.body.clientHeight }}>
                <WhiteSpace size="lg" />
                {/*班级,学期*/}
                <Picker
                    data={seasons}
                    cascade={false}
                    value={this.state.sValue}
                    onChange={v => this.setState({ sValue: v })}
                    onOk={v => this.setState({ sValue: v })}
                >
                    <List.Item arrow="horizontal">班级,学期</List.Item>
                </Picker>
                <WhiteSpace size="lg" />
                {/*日期*/}
                <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="Optional"
                    value={this.state.date}
                    onOk={this.getSelectData}
                    onChange={date => this.setState({ date })
                    
                }
                >
                    <List.Item arrow="horizontal">日期</List.Item>
                </DatePicker>
                <WhiteSpace size="lg" />
                <div className='classSearchResult'>
                    <div className="classSearchResultInfo">
                        <span className="resultName">班级礼貌评分</span>
                        <span className="resultGrade">89分</span>
                    </div>
                  
                </div>
                <div className='addBunton' onClick={this.addSchedule}>
                    <img src={require("../../ringBindInformation/imgs/addBtn.png")} />
                </div>
            </div>
        );
    }
}

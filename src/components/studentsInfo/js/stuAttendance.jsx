import React from 'react';
import '../css/stuAttendance.less'
import {List, Menu, ListView, NavBar, ActivityIndicator, Toast, WhiteSpace, Modal} from 'antd-mobile';

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const Item = List.Item;
const Brief = Item.Brief;
const data = [];
export default class stuAttendance extends React.Component {

    constructor(props) {
        super(props);
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            isLoading: true,
            hasMore: true,
            initData: '',
            show: false,
            className: '请选择班级'
        };

    }

    componentDidMount() {
        document.title = "孩子考勤";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var userId = locationSearch.split("&")[0].split('=')[1];
        var type = locationSearch.split("&")[1].split('=')[1];
        this.setState({
            userId: userId,
            type: type
        }, () => {
            if (type == 'PARENT') {
                this.getBraceletStudentInfoAttendByParentId();
            } else if (type == 'TEAC') {
                console.log('教师');
                // 根据教师id获取clazzid
                this.getClazzesByUserId(() => {
                    this.getBraceletStudentInfoAttendByClazzId();
                });
            }
        });

    }


    getBraceletStudentInfoAttendByClazzId() {
        var param = {
            "method": 'getBraceletStudentInfoAttendByClazzId',
            "clazzId": this.state.clazzId.join(','),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (res) => {
                console.log(res, 'res');
                if (res.success == true && res.msg == '调用成功') {
                    this.initData = [{
                        value: -1,
                    }]
                    this.initData = this.initData.concat(res.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initData),
                        isLoading: false,
                        hasMore: false,

                    })
                    // if(this.initData.length >= res.pager.rsCount){
                    //     this.setState({
                    //     })
                    // }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    //根据教师id获取clazzid
    getClazzesByUserId(callback) {
        var param = {
            "method": 'getClazzesByUserId',
            "userId": this.state.userId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (res) => {
                console.log(res, 'res');
                if (res.success == true && res.msg == '调用成功') {
                    var changeData = res.response;
                    changeData.forEach((value, index) => {
                        data.push({
                            value: value.id,
                            label: value.grade.name + value.name
                        })
                    })
                    this.setState({
                        clazzId: [res.response[0].id],
                        className: [res.response[0].grade.name + res.response[0].name]
                    }, () => {
                        if (callback) {
                            callback();
                        }
                    })

                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    //根据家长id获取孩子列表
    getBraceletStudentInfoAttendByParentId() {
        var param = {
            "method": 'getBraceletStudentInfoAttendByParentId',
            "userId": this.state.userId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (res) => {
                console.log(res, 'res');
                if (res.success == true && res.msg == '调用成功') {
                    this.initData = this.initData.concat(res.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initData),
                        isLoading: false,
                        hasMore: false,

                    })
                    // if(this.initData.length >= res.pager.rsCount){
                    //     this.setState({
                    //     })
                    // }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    onOk = (value,label) => {
        // console.log(label)
        if (value.length <= 0) {
            Toast.info('未选中任何班级!', 1);
            return;
        }
        this.setState({
            clazzId: value,
            className: ['是是是','ssss'],
        }, () => {
            this.getBraceletStudentInfoAttendByClazzId();
            this.onCancel();
        })
    }

    onCancel = () => {
        this.setState({show: false});
    }

    handleClick = (e) => {
        e.preventDefault();
        this.setState({
            show: !this.state.show,
        });

        if (!this.state.initData) {
            setTimeout(() => {
                this.setState({
                    initData: data,
                });
            }, 500);
        }
    }


    render() {

        const row = (rowData, sectionID, rowID) => {
            var dom = '';
            if(rowData.value == -1){
                const {initData, show} = this.state;
                const menuEl = (
                    <Menu
                        className="single-multi-foo-menu stuModal"
                        data={initData}
                        value={this.state.clazzId}
                        level={1}
                        onChange={this.onChange}
                        onOk={this.onOk}
                        onCancel={this.onCancel}
                        height={document.documentElement.clientHeight * 0.6}
                        multiSelect
                    />
                );
                const loadingEl = (
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: document.documentElement.clientHeight * 0.6,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <ActivityIndicator size="large"/>
                    </div>
                );
                dom = <div style={
                    this.state.type == 'TEAC' ? {display: 'block'} : {display: 'none'}
                } className={show ? 'single-multi-menu-active' : ''}>
                    <div>
                        <NavBar
                            leftContent="选择绑定的班级"
                            mode="light"
                            onClick={this.handleClick}
                            className="single-multi-top-nav-bar"
                            rightContent={this.state.className.map((value,index)=>{
                                return <span>{value}</span>
                            })}
                        >
                            {/*请选择班级*/}
                        </NavBar>
                    </div>
                    {show ? initData ? menuEl : loadingEl : null}
                    {show ? <div className="menu-mask" onClick={this.onCancel}/> : null}
                </div>
            }else{
                dom = <Item align="top" thumb="http://i2.hdslb.com/bfs/face/91e4fa4006e6af4801da253640128d59bcebe1e6.jpg"
                            multipleLine>
                    {rowData.user.userName} <Brief>本周迟到{rowData.attend.weekCount}次&nbsp;
                    本月迟到<span className="blueText">{rowData.attend.monthCount}</span>次</Brief>
                </Item>
            }
            return (
                dom
            )
        };

        return (
            <div id="stuAttendance">

                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    // renderFooter={() => (
                    //     <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                    //         {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                    //     </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list stuAttendanceList"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={{
                        height: document.body.clientHeight,
                    }}
                />
            </div>
        );
    }
}

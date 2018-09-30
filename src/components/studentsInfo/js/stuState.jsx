import React from 'react';
import '../css/stuAttendance.less'
import {List, Menu, ListView, NavBar, ActivityIndicator, Toast, WhiteSpace, Modal} from 'antd-mobile';

const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const Item = List.Item;
const Brief = Item.Brief;
var data = [];

export default class stuState extends React.Component {

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
            className: []
        };

    }

    componentDidMount() {
        document.title = "孩子状态";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var userId = locationSearch.split("&")[0].split('=')[1];
        var type = locationSearch.split("&")[1].split('=')[1];
        this.setState({
            userId: userId,
            type: type,
        }, () => {
            if (type == 'PARENT') {
                this.getBraceletStudentInfoByParentId();
            } else if (type == 'TEAC') {
                console.log('教师');
                // 根据教师id获取clazzid
                this.getClazzesByUserId(() => {
                    this.getBraceletStudentInfoByClazzId();
                });
            }
        });

    }


    getBraceletStudentInfoByClazzId() {
        this.setState({
            // load: true,
        },()=>{
            var param = {
                "method": 'getBraceletStudentInfoByClazzId',
                "clazzId": this.state.clazzId.join(','),
                "pageNo": this.state.defaultPageNo
            };

            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: (res) => {
                    console.log(res, 'res');
                    if (res.success == true && res.msg == '调用成功') {
                        // this.initData = this.initData.concat(res.response);
                        // this.initData = [{
                        //     value: -1,
                        // }]
                        // this.initData = res.response;
                        this.initData = this.initData.concat(res.response);
                        this.setState({
                            dataSource: dataSource.cloneWithRows(this.initData),
                            isLoading: false,
                            load:false,
                        })
                        if(this.initData.length >= res.pager.rsCount){
                            this.setState({
                                hasMore: false,
                            })
                        }
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });
        })

    }

    //根据教师id获取clazzid
    getClazzesByUserId(callback) {
        var param = {
            "method": 'getClazzesByUserId',
            "userId": this.state.userId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: (res) => {
                console.log(res, 'getClazzesByUserId');
                if (res.success == true && res.msg == '调用成功') {
                    var changeData = res.response;
                    data = [];
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
    getBraceletStudentInfoByParentId() {
        var param = {
            "method": 'getBraceletStudentInfoByParentId',
            "userId": this.state.userId,
            // "pageNo": this.state.defaultPageNo
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
                    //         hasMore: false,
                    //     })
                    // }
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }


    onOk = (value) => {
        if (value.length <= 0) {
            Toast.info('未选中任何班级!', 1);
            return;
        }
        var classNameArray = [];
        this.initData = [];
        for(var k in value){
            for(var i in data){
                if(value[k] == data[i].value){
                    classNameArray.push(data[i].label)
                }
            }
        }
        this.setState({
            clazzId: value,
            className: classNameArray,
            defaultPageNo: 1,
            isLoading: true,
            hasMore: true,
            show: false,
            load: true,
        }, () => {
            this.getBraceletStudentInfoByClazzId();
        })
        // this.onCancel();
    }

    onCancel = () => {
        this.setState({show: false});
        if (this.state.clazzId.length <= 0) {
            this.setState({
                clazzId: this.state.initClazzId
            })
        }
    }

    handleClick = (e) => {
        e.preventDefault();
        var arr = [];
        for (var k in this.state.clazzId) {
            arr.push(this.state.clazzId[k]);
        }
        this.setState({
            show: !this.state.show,
            initClazzId: arr
        });

        if (!this.state.initData) {
            setTimeout(() => {
                this.setState({
                    initData: data,
                });
            }, 500);
        }
    }

    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({isLoading: true, defaultPageNo: currentPageNo});
        if (type == 'PARENT') {
            this.getBraceletStudentInfoByParentId();
        } else if (type == 'TEAC') {
                this.getBraceletStudentInfoByClazzId();
        }
    };


    render() {
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
        const row = (rowData, sectionID, rowID) => {
            return (
                <Item
                    extra={typeof(rowData.courseTableItem) == 'object' ? "正在上" + rowData.courseTableItem.courseName + "课" : rowData.courseTableItem}
                    align="top" thumb={rowData.user.avatar}
                    multipleLine>
                    {rowData.user.userName} <Brief><span
                    className="icon-address"></span>{rowData.braceletLocation == "" ? '暂无位置' : rowData.braceletLocation.room.name}
                </Brief>
                </Item>
            )
        };
        return (
            <div id="stuAttendance">
                <div style={
                    this.state.load?{display:'block'}:{display:'none'}
                }>
                    <div className="mask" style={
                        {height: document.body.clientHeight}
                    }></div>
                    {loadingEl}
                </div>
                <ListView
                    // ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderHeader={()=>{
                        return <div style={
                            this.state.type == 'TEAC' ? {display: 'block'} : {display: 'none'}
                        } className={show ? 'single-multi-menu-active' : ''}>
                            <div>
                                <NavBar
                                    leftContent="选择绑定的班级"
                                    mode="light"
                                    onClick={this.handleClick}
                                    className="single-multi-top-nav-bar"
                                    rightContent={this.state.className.map((value, index) => {
                                        return <span>{value}</span>
                                    })}
                                >
                                    {/*请选择班级*/}
                                </NavBar>
                            </div>
                            {show ? initData ? menuEl : loadingEl : null}
                            {show ? <div className="menu-mask" onClick={this.onCancel}/> : null}
                        </div>
                    }}
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                            {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list stuAttendanceList"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached.bind(this)}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={
                        this.state.show ? {
                            height: document.body.clientHeight,
                            overflow: 'hidden'
                        } : {height: document.body.clientHeight, overflow: 'auto'}
                    }
                />
            </div>
        );
    }
}

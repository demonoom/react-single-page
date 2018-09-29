import React from 'react';
import '../css/stuState.less'
import {List, Toast, ListView, Button, InputItem, Radio, WhiteSpace, Modal} from 'antd-mobile';
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const Item = List.Item;
const Brief = Item.Brief;
export default class stuState extends React.Component {

    constructor(props) {
        super(props);
        this.initData = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            isLoading: true,
            hasMore:true,
        };

    }

    componentDidMount() {
        document.title= "孩子状态";
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var userId = locationSearch.split("&")[0].split('=')[1];
        var type = locationSearch.split("&")[1].split('=')[1];
        this.setState({
            userId:userId
        }, () => {
            if(type == 'PARENT'){
                this.getBraceletStudentInfoByParentId();
            }else if(type == 'TEAC'){
                console.log('教师');
                // 根据教师id获取clazzid
                this.getClazzesByUserId(()=>{
                    this.getBraceletStudentInfoByClazzId();
                });
            }
        });

    }


    getBraceletStudentInfoByClazzId(){
        var param = {
            "method": 'getBraceletStudentInfoByClazzId',
            "clazzId": this.state.clazzId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (res) => {
                console.log(res,'res');
                if (res.success == true && res.msg == '调用成功') {
                    this.initData = this.initData.concat(res.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initData),
                        isLoading:false,
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
    getClazzesByUserId(callback){
        var param = {
            "method": 'getClazzesByUserId',
            "userId": this.state.userId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (res) => {
                console.log(res,'res');
                if (res.success == true && res.msg == '调用成功') {
                    this.setState({
                        clazzId: res.response[0].id
                    },()=>{
                        if(callback){
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
    getBraceletStudentInfoByParentId(){
        var param = {
            "method": 'getBraceletStudentInfoByParentId',
            "userId": this.state.userId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse:  (res) => {
                console.log(res,'res');
                if (res.success == true && res.msg == '调用成功') {
                    this.initData = this.initData.concat(res.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initData),
                        isLoading:false,
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
        _this.getBraceletStudentInfoByParentId(_this.state.ident);
    };


    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <Item extra={rowData.courseTableItem} align="top" thumb="http://i2.hdslb.com/bfs/face/91e4fa4006e6af4801da253640128d59bcebe1e6.jpg" multipleLine>
                    {rowData.user.userName} <Brief><span>图片</span>曲江拿铁城b座</Brief>
                </Item>
            )
        };
        return (
            <div id="stuState">
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    // renderFooter={() => (
                    //     <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                    //         {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                    //     </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list"
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

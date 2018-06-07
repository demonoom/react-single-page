import React from 'react';
import '../css/health.less';
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;


var _this;

export default class health extends React.Component {

    constructor(props) {
        super(props);
        _this = this;
        // this.initData = [];
        // const dataSource = new ListView.DataSource({
        //     rowHasChanged: (row1, row2) => row1 !== row2,
        // });
        this.state = {
            // dataSource: dataSource.cloneWithRows(this.initData),   //listView数据类型
            clientHeight: document.body.clientHeight,   //总高
            // isLoadingLeft: true,  //加载提示文字
            // defaultPageNo: 1,  //页码
            // hasMore:true,     //加载更多flag
        }

    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var classId = locationSearch.split("&")[0].split('=')[1];
        var type = locationSearch.split("&")[1].split('=')[1];
        this.setState({
            classId: classId,
            type: type,
        }, () => {
            this.getBraceletSportStepByClazzId(classId);
        })
    }

    componentDidMount() {
        document.title = "健康数据";

    }

    componentWillUnmount() {

    }

    //根据班级获取卡路里和步数
    getBraceletSportStepByClazzId(clazzId) {
        var _this = this;
        var param = {
            "method": 'getBraceletSportStepByClazzId',
            "clazzId": clazzId,
            "pageNo": -1,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result);
                if (result.msg == '调用成功' || result.success) {
                    // let arr = result.response;
                    this.setState({
                        listData: result.response,
                    })
                    // if (arr.length > 0) {
                    //     this.initData = this.initData.concat(arr);
                    //     this.setState({
                    //         dataSource: this.state.dataSource.cloneWithRows(this.initData),
                    //         isLoadingLeft: false,
                    //     })
                    // } else {
                    //     this.setState({
                    //         isLoadingLeft: false,
                    //         hasMore:false,  //无数据 关闭加载更多
                    //     })
                    // }
                }
            },
            onError: function (error) {
                Toast.info('获取列表失败', error);
            }
        });
    }


    // /**
    //  *  ListView数据全部渲染完毕的回调
    //  */
    //
    // onEndReached = () => {
    //     console.log('触发触底事件')
    //     var _this = this;
    //     var currentPageNo = _this.state.defaultPageNo;
    //     if (!_this.state.isLoadingLeft && !_this.state.hasMore) {
    //         return;
    //     }
    //     currentPageNo += 1;
    //     this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo},()=>{
    //         this.getBraceletSportStepByClazzId(this.state.classId,this.state.defaultPageNo)
    //     });
    //     // _this.setState({
    //     //     dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
    //     //     isLoadingLeft: true,
    //     // });
    // };
    historyGoBack() {
        var data = {
            method: 'finish',
        };

        Bridge.callHandler(data, null, function (error) {
            console.log(error);
        });
    }


    render() {
        let data = this.state.listData;
        let array = [];
        for (var k in data) {
            let item = <div className="photoItem">
                <div className="imgDiv">
                    <img className="noomImg" src={data[k].users.avatar} alt=""/>
                    <div
                        className={k == 0 ? 'firstClass' : k == 1 ? 'secondClass' : k == 2 ? 'thirdClass' : 'otherClass'}></div>
                    <div className="border_img"></div>
                </div>
                <div className="studentName">{data[k].users.userName}</div>
                <div
                    className="step_number textOver">{this.state.type == 'step' ? data[k].sportStep : data[k].calorie}<span
                    className="step_number_s">{this.state.type == 'step' ? '步' : '卡路里'}</span></div>
            </div>;
            array.push(item);
        }
        // const row = (item) => {
        //     return (
        //         <Item extra={WebServiceUtil.formatYMD(item.sportDate)} align="top" thumb={item.users.avatar} multipleLine>
        //             {item.users.userName} <Brief>{this.state.type == 'step'?item.sportStep:item.calorie} {this.state.type == 'step'?'步':'卡路里'}</Brief>
        //         </Item>
        //     )
        // };
        return (
            <div id="health" className="home_content" style={{height: this.state.clientHeight}}>
                <div className="inner_bg">
                    <div className="navBar">
                        <span onClick={this.historyGoBack}>首页</span>
                        <span className="icon">></span>
                        <span>步数排行榜</span>
                    </div>

                    <div className="health_cont">{array}</div>

                    {/*<List className="my-list">*/}
                    {/*<ListView*/}
                    {/*ref={el => this.lv = el}*/}
                    {/*dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource*/}
                    {/*renderFooter={() => (*/}
                    {/*<div style={{paddingTop: 5, paddingBottom: 5, textAlign: 'center'}}>*/}
                    {/*{this.state.isLoadingLeft ? '正在加载...' : '已经全部加载完毕'}*/}
                    {/*</div>)}*/}
                    {/*renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable*/}
                    {/*className="am-list"*/}
                    {/*pageSize={30}    //每次事件循环（每帧）渲染的行数*/}
                    {/*//useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新*/}
                    {/*scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行*/}
                    {/*onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用*/}
                    {/*onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型*/}
                    {/*initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据*/}
                    {/*scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率*/}
                    {/*style={{*/}
                    {/*height: _this.state.clientHeight,*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*</ListView>*/}
                    {/*</List>*/}
                </div>
            </div>
        );
    }
}

import React from 'react';
import {List, Toast, ListView, Tabs, InputItem} from 'antd-mobile';
import '../css/comments.less'

const Item = List.Item;
const Brief = Item.Brief;
var classBinding;

export default class comments extends React.Component {

    constructor(props) {
        super(props);
        classBinding = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        const dataSourceOther = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        this.initDataOther = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            dataSourceOther: dataSourceOther.cloneWithRows(this.initDataOther),
            clientHeight: document.body.clientHeight,
            defaultPageNo: 1,   // 点赞列表页码
            tabIndex: 0,    //tab栏下标
            defaultPageNoOther: 1,    // 评论列表页码
            likeStatus: false,   //是否已点赞
            anonymous: false,    //是否匿名
            praiseNum: 0,  //赞总数,
            commentNum: 0, // 评论总数
            likeStatusAnimate: false,
            tabs: [
                {title: '赞'},
                {title: '评论'}
            ],
            // paraiseStatus: false,
        };
    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        this.setState({
            userId: searchArray[0].split('=')[1],
            sid: searchArray[1].split('=')[1]
        })
    }

    componentDidMount() {
        document.title = "通知列表";
        this.getListCommentOrPraise(1);   //获取点赞列表
        this.getListCommentOrPraise(0);   //获取评论列表
    }


    //通过云盘或资料文件获取点赞或评论列表
    getListCommentOrPraise(cmType) { //cmType 1 点赞 0 评论
        var _this = this;
        // _this.state.dataSource = [];
        // _this.state.dataSource = new ListView.DataSource({
        //     rowHasChanged: (row1, row2) => row1 !== row2,
        // });
        const dataBlob = {};
        var PageNo = cmType == 1 ? this.state.defaultPageNo : this.state.defaultPageNoOther;
        var param = {
            "method": 'listCommentOrPraise',
            "sid": '1021',
            "cmType": cmType, //1 点赞 0  评论
            "pn": PageNo
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result);
                if (result.msg == '调用成功' || result.success) {
                    classBinding.state.selectData = result.response
                    var arr = result.response;
                    var pager = result.pager;
                    for (let i = 0; i < arr.length; i++) {
                        var topic = arr[i];
                        dataBlob[`${i}`] = topic;
                        if (arr[i].user.colUid == this.state.userId) {
                            this.setState({
                                likeStatus: true,
                                likeStatusAnimate: true
                            })
                        }
                    }
                    var isLoading = false;
                    if (arr.length > 0) {
                        if (pager.pageCount == 1 && pager.rsCount < 30) {
                            isLoading = false;
                        } else {
                            isLoading = true;
                        }
                    } else {
                        isLoading = false;
                    }

                    if (cmType == 1) {  //为点赞时
                        _this.initData = _this.initData.concat(arr);
                        _this.setState({
                            dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                            praiseNum: pager.rsCount  //赞总数

                        })
                    } else {   //为评论时
                        _this.initDataOther = _this.initDataOther.concat(arr);
                        _this.setState({
                            dataSourceOther: _this.state.dataSourceOther.cloneWithRows(_this.initDataOther),
                            commentNum: pager.rsCount //  评论总数
                        })
                    }

                    this.setState({
                        tabs: [
                            {title: '赞 (' + this.state.praiseNum + ')'},
                            {title: '评论 (' + this.state.commentNum + ')'}
                        ],
                        isLoadingLeft: isLoading,
                        refreshing: false,
                    })
                }
            },
            onError: function (error) {
                Toast.info('获取列表失败', error);
            }
        });
    }


    //点赞或者评论增加
    AddCommentOrPraise(stype, callback) {
        var param = {
            "method": 'addCommentOrPraise',
            "sid": '1021',
            "stype": stype, //1 评论云盘文件 3  评论资料
            "uid": this.state.userId,
            "cmType": Math.abs(this.state.tabIndex - 1), //0 评论  1 点赞
            "isAnonymous": this.state.anonymous,
            "content": this.state.content,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result);
                if (result.msg == '调用成功' || result.success) {
                    if (callback) {
                        callback();
                    }
                }
            },
            onError: function (error) {
                Toast.info('添加失败', error);
            }
        });
    }


    /**
     *  ListView数据全部渲染完毕的回调
     */

    onEndReached = (event) => {
        var _this = this;
        if (Math.abs(this.state.tabIndex - 1) == 1) {
            var currentPageNo = this.state.defaultPageNo;
            if (!this.state.isLoadingLeft && !this.state.hasMore) {
                return;
            }
            currentPageNo += 1;
            this.setState({isLoadingLeft: true, defaultPageNo: currentPageNo});
            // _this.getListCommentOrPraise(Math.abs(this.state.tabIndex -1));
            _this.getListCommentOrPraise(1);  //点赞
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.initData),
                isLoadingLeft: true,
            });
        } else {
            var currentPageNo = this.state.defaultPageNoOther;
            if (!this.state.isLoadingLeft && !this.state.hasMore) {
                return;
            }
            currentPageNo += 1;
            this.setState({isLoadingLeft: true, defaultPageNoOther: currentPageNo});
            _this.getListCommentOrPraise(0);  //评论
            this.setState({
                dataSourceOther: this.state.dataSourceOther.cloneWithRows(this.initDataOther),
                isLoadingLeft: true,
            });
        }


    };


    tabClick(event, index) {
        if (this.state.tabIndex !== index) {
            this.setState({
                tabIndex: index,
                isLoadingLeft: true,
                hasMore: true,
            });
        }


    }


    //点赞事件
    likeClick() {
        if (!this.state.likeStatus) {

            this.setState({
                likeStatus: true
            });
            setTimeout(() => {
                this.setState({
                    likeStatusAnimate: true
                })
            }, 2000)
            this.AddCommentOrPraise(1, function () {
                Toast.success("点赞成功", 1);
                this.initData = [];
                const dataSource = new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2,
                });
                this.setState({
                    dataSource: dataSource.cloneWithRows(this.initData),
                    defaultPageNo: 1,
                })
                this.getListCommentOrPraise(1);
            }.bind(this));

        } else {
            Toast.info("已赞过~", 1);
        }
        // var _this = this;
        // if(!this.state.likeStatus){
        //     this.AddCommentOrPraise(function () {
        //         Toast.success("点赞成功", 1);
        //     });
        // }else{
        //     Toast.success("已取消", 1);
        // }
        //
        // this.setState({
        //     likeStatus: !this.state.likeStatus
        // });
    }

    //改为匿名状态
    anonymous() {
        this.setState({
            anonymous: !this.state.anonymous,
        })
        //获取焦点
        document.getElementsByTagName('input')[0].focus();
    }

    // 输入框完成事件
    confirm() {
        // console.log(this.state.defaultPageNo,'赞的页码');
        // console.log(this.state.defaultPageNoOther,'评论的页码');
        if (this.state.content == '' || !this.state.content) {
            Toast.fail('评论内容不能为空')
        } else {
            console.log(this.state.content);
            this.AddCommentOrPraise(1, function () {
                Toast.success('评论成功', 1);
                this.initDataOther = [];
                const dataSourceOther = new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2,
                });
                this.setState({
                    dataSourceOther: dataSourceOther.cloneWithRows(this.initDataOther),
                    defaultPageNoOther: 1,
                    content: ''
                })
                this.getListCommentOrPraise(0);
            }.bind(this))

        }
    }

    inputChange(event) {
        // console.log(event)
        this.setState({
            content: event,
        })
    }

    inputItemOnKeyUp(e) {
        if (e.keyCode == 13) {
            classBinding.confirm();
        }
    }


    render() {
        //点赞
        const row = (item) => {
            return (
                <div style={{paddingLeft: 50 + 'px', position: 'relative', borderBottom: '1px solid #ccc'}}>
                    <Item align="top"
                          multipleLine>
                        {item.user.userName}
                    </Item>
                    <img src={item.user.avatar} alt="头像" className="headPic"/>
                </div>
            )
        };
        //评论
        const rowOther = (item) => {
            return (
                <div style={{paddingLeft: 50 + 'px', position: 'relative'}}>
                    <Item align="top"
                          extra={WebServiceUtil.formatYMD(item.commentTime) + ' ' + WebServiceUtil.formatHM(item.commentTime)}
                          multipleLine>
                        {item.user.userName} <Brief>{item.content}</Brief>
                    </Item>
                    <img src={item.user.avatar} alt="头像"
                         className="headPic"/>
                </div>
            )
        }
        return (
            <div id="comments" style={{height: document.body.clientHeight}}>
                <Tabs onTabClick={this.tabClick.bind(this)} tabs={this.state.tabs} initialPage={0} animated={false}
                      useOnPan={false}>
                    {/*//点赞*/}
                    <List className="my-list">
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                                    {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                                </div>)}
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
                                height: classBinding.state.clientHeight,
                            }}
                        >
                            <div hidden={this.state.tabIndex == 1} className="bottom_box">
                                <img hidden={this.state.likeStatusAnimate} className="likeImage"
                                     onClick={this.likeClick.bind(this)}
                                     src={this.state.likeStatus ? require('../imgs/like_after.jpg') : require('../imgs/like_before.jpg')}
                                     alt=""/>
                            </div>
                        </ListView>
                    </List>
                    {/*//评论*/}
                    <List className="my-list" style={{paddingBottom: '50px'}}>
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSourceOther}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{paddingTop: 5, paddingBottom: 40, textAlign: 'center'}}>
                                    {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={rowOther}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中,scroll事件被调用的频率
                            style={{
                                height: classBinding.state.clientHeight,
                                // boxSizing:'border-box',
                                // paddingBottom:'83.5px'
                            }}
                        >
                            <div hidden={this.state.tabIndex == 0} className="bottom_input_box">
                                <div className="input_box">
                                    <div className="headBox">
                                        <InputItem
                                            clear
                                            placeholder="请输入评论信息"
                                            ref={el => this.autoFocusInst = el}
                                            className="comment_input"
                                            onVirtualKeyboardConfirm={this.confirm.bind(this)} // 未得知是否起作用
                                            onChange={this.inputChange.bind(this)}
                                            value={this.state.content}
                                            onKeyUp={this.inputItemOnKeyUp}
                                            // focus={this.inputItemFocus}
                                        ></InputItem>
                                        {/*<button onClick={this.confirm.bind(this)}>发送</button>*/}
                                    </div>
                                    <div className="bottomBox">
                                        <div className="bottomBox_left">
                                            <input onClick={this.anonymous.bind(this)} type="checkBox"/>匿名
                                        </div>
                                        <div className="bottomBox_right">
                                            您写的评论会以匿名的形式展现
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ListView>
                    </List>
                </Tabs>

            </div>
        );
    }
}

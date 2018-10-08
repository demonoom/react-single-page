import React from "react";
import { Tabs, WhiteSpace, ListView, Button, List, Radio, TextareaItem, Toast, Modal, } from 'antd-mobile';
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;

var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
export default class addRecCourse extends React.Component {

    constructor(props) {
        super(props);
        calm = this;
        calm.initDataSource = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            isLoading: true,
            hasMore: true,
            waitLookThroughData: [],
            alreadyLookThroudhData: [],
            data: {},
            clientHeight: document.body.clientHeight,
            textareaValue: "",
            showMark: true
        }
    }

    componentDidMount() {
        document.title = "课程推荐列表"
        calm.getRecommendCourseList();
        window.addEventListener('resize', calm.onWindowResize);
        $(".tagAddPanel_bg").hide();

    }
    /**
     * 列表
     */
    getRecommendCourseList() {
        var param = {
            "method": 'getRecommendCourseList',
            "pageNo": calm.state.defaultPageNo,
            "courseName":"",
        };
        WebServiceUtil.requestLittleElearningWeb(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "hhhhh");
                if (result.success) {
                    calm.state.rsCount = result.pager.rsCount;
                    calm.initDataSource = calm.initDataSource.concat(result.response);
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource),
                        isLoading: false
                    })
                    if (calm.initDataSource.length == result.pager.rsCount) {
                        calm.setState({
                            hasMore: false,
                            isLoading: false
                        })
                    }
                    calm.setState({
                        waitLookThroughData: result.response
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }
    /**
     *  带审核的ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        console.log('触底事件')
        var _this = this;
        var currentPageNo = _this.state.defaultPageNo;
        if (!_this.state.isLoading && !_this.state.hasMore) {
            console.log('阻止请求')
            return;
        }
        currentPageNo += 1;
        _this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            _this.getRecommendCourseList();
        });
    };

    /**
    * 跳转未审核页面
    */
    toWaitLookThrough(id, type, index) {
        setTimeout(() => {
            $(".content").scrollTop(0)
        },100)
        calm.setState({
            textareaValue: "",
            index: index
        }, () => {
            $(".updateModel").slideDown()
            $(".tagAddPanel_bg").show();
            console.log(calm.state.textareaValue, "calm.state.textareaValue")
        })
        calm.setState({
            isShow: false
        })
        calm.setState({
            id, type
        })
        if (type == 0) {
            calm.getArticleInfoById(id)

        } else if (type == 1) {
            calm.getLittleVideoById(id)
        } else if (type == 2) {
            calm.getDiscussInfoById(id)
        }
    }
   
    /**
     * 点击取消
     */
    cancle() {
        $(".updateModel").slideUp()
        if (calm.state.type == 1) {
            $(".updateModel video")[0].pause()
            $(".updateModel video")[0].currentTime = 0;
        }
        $(".tagAddPanel_bg").hide();

    }


    //--------//
    //监听窗口改变时间
    onWindwoResize() {
        // this
        setTimeout(() => {
            calm.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }
    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData,"rowData")
            rowData = rowData || {}
            return (
                <div>
                    {
                        rowData.littleVideoInfo ?
                            <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, rowData.littleVideoInfoID, rowData.type, rowID)}>
                                <img className='photo' src={rowData.littleVideoInfo.userInfo ? rowData.littleVideoInfo.userInfo.avatar : ""} alt="" />
                                <div className='right'>
                                    <div className="topMsg my_flex">
                                        <span className='author text_hidden'>{rowData.littleVideoInfo.userInfo ? rowData.littleVideoInfo.userInfo.userName : ""}</span>
                                    </div>
                                    <div className='title'>{rowData.littleVideoInfo.videoContent}</div>
                                    <div className='time'>{WebServiceUtil.formatYMD(rowData.littleVideoInfo.createTime)}</div>
                                </div>
                            </div>
                            :
                            rowData.articleInfo ?
                                <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, rowData.articleInfoId, rowData.type,rowID)}>
                                    <img className='photo' src={rowData.articleInfo.userInfo ? rowData.articleInfo.userInfo.avatar : ""} alt="" />
                                    <div className='right'>
                                        <div className="topMsg my_flex">
                                            <span className='author text_hidden'>{rowData.articleInfo.userInfo ? rowData.articleInfo.userInfo.userName : ""}</span>
                                        </div>
                                        <div className='title'>{rowData.articleInfo.articleTitle}</div>
                                        <div className='time'>{WebServiceUtil.formatYMD(rowData.articleInfo.createTime)}</div>

                                    </div>

                                </div>
                                :
                                rowData.discussInfo ?
                                    <div className="item my_flex" onClick={_this.toWaitLookThrough.bind(this, rowData.discussInfoId, rowData.type,rowID)}>
                                        <img className='photo' src={rowData.discussInfo.discussUser ? rowData.discussInfo.discussUser.avatar : ""} alt="" />
                                        <div className='right'>
                                            <div className="topMsg my_flex">
                                                <span className='author text_hidden'>{rowData.discussInfo.discussUser ? rowData.discussInfo.discussUser.userName : ""}</span>
                                            </div>
                                            <div className='title'>{rowData.discussInfo.discussContent}</div>
                                            <div className='time'>{WebServiceUtil.formatYMD(rowData.discussInfo.createTime)}</div>
                                        </div>
                                    </div> :
                                    ""
                    }
                </div>
            )
        }


        const data2 = [
            { value: 1, label: '通过' },
            { value: 0, label: '不通过' },
        ];
        const isRecData = [
            { value: 1, label: '是' },
            { value: 0, label: '否' },
        ];
        const isTopData = [
            { value: 1, label: '是' },
            { value: 0, label: '否' },
        ];
        const { isPass, isRec, isTop } = this.state;
        return (
            <div id="lookThrough" style={{
                height: document.body.clientHeight
            }}>
                <div className='emptyDiv' style={{ display: calm.initDataSource.length == 0 ? "block" : 'none' }}>
                    <div className='emptyIcon'></div>
                </div>
              
                    <div style={{
                        height: document.documentElement.clientHeight - 46,
                        backgroundColor: '#f4f4f4'
                    }}>
                        {/* 未审核 */}
                        <ListView
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                            renderFooter={() => (
                                <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                    {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                                </div>)}
                            renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                            className="am-list noReviewed"
                            pageSize={30}    //每次事件循环（每帧）渲染的行数
                            //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                            scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                            onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                            onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                            initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                            scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                            onScroll={this.scroll}
                            style={{
                                height: document.body.clientHeight - 46,
                            }}
                        />
                    </div>
                <div className="updateModel" style={{ display: 'none', width: "100%", height: "500px", position: "absolute", left: "0", padding: "10px 0 0 0", bottom: "0" }}>
                    <div id="waitLookThrough">
                        {/* <div className="goBack line_public"><Icon type="left" onClick={calm.goBack}/></div> */}
                        <div className="content" ref="contentDOM">
                            {
                                calm.state.type == 0 ?
                                    <div className="sameBack sameBackNew">
                                        <div className='title'>{calm.state.data.articleTitle}</div>
                                        <div className='topMsg'>
                                            <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                            <span className='author'>{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</span>
                                            <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                        </div>
                                        <div className='textCont' dangerouslySetInnerHTML={{ __html: calm.state.data.articleContent }}></div>
                                    </div>
                                    :
                                    calm.state.type == 1 ?
                                        <div className="sameBack sameBackTop sameBackBottom">
                                            <div className='topMsg'>
                                                <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                                <span className='author'>{calm.state.data.userInfo ? calm.state.data.userInfo.userName : ""}</span>
                                                <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                            </div>
                                            <div className="textCont">
                                                <div className='video_title textOver2'>{calm.state.data.videoContent}</div>
                                                <video
                                                    controls="controls"
                                                    preload="auto"
                                                    className="tag-vedio"
                                                    controlslist="nodownload nofullscreen"
                                                    x5-video-player-type="h5"
                                                    playsinline="true"
                                                    webkit-playsinline="true"
                                                    poster={calm.state.data.coverPath}
                                                    style={{ objectFit: "contain", width: "100%" }}
                                                    src={calm.state.data.videoPath}>
                                                </video>
                                            </div>
                                        </div>
                                        :
                                        calm.state.type == 2 ?
                                            <div className="sameBack sameBackTop">
                                                <div className='topMsg'>
                                                    <img className="photo" src={calm.state.data.userInfo ? calm.state.data.userInfo.avatar : ""} alt="" />
                                                    <span className='author'>{calm.state.data.discussUser ? calm.state.data.discussUser.userName : ""}</span>
                                                    <span className='time'>{WebServiceUtil.formatYMD(calm.state.data.createTime)}</span>
                                                </div>
                                                <div className="textCont">
                                                    {calm.state.data.discussContent}
                                                </div>
                                            </div>
                                            : ""
                            }
                            {
                                calm.state.type == 0 ?
                                    <div className="calm">
                                        <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                            <div className='line_public'>
                                                <span className='title'>审核人：</span>{calm.state.auditUser}
                                                <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                            </div>
                                            <div className='line_public'>
                                                <span className='title'>审核说明：</span>
                                                <div className='reCont'>
                                                    {calm.state.auditMark ? calm.state.auditMark : "无"}
                                                </div>
                                            </div>
                                            <div className='result'>
                                                <span className='title'>审核结果：</span>
                                                {calm.state.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                {calm.state.isTop == 1 ? <span className="pass">已置顶</span> : <span>未置顶</span>}
                                                <div className="reBtn" onClick={calm.showAlert}>
                                                    重新审核
                                        </div>
                                            </div>
                                        </div>
                                        <div style={{ display: calm.state.showMark ? "block" : "none" }}>
                                            <div className="isDangerArea">
                                                <List className="line_public" renderHeader={() => '审核：'}>
                                                    {data2.map(i => (
                                                        <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                            {i.label}
                                                            {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                        </RadioItem>
                                                    ))}
                                                </List>
                                                <div style={{ display: calm.state.isShow ? "block" : "none" }}>
                                                    {/* <List renderHeader={() => '推荐：'}>
                                            {isRecData.map(i => (
                                                <RadioItem key={i.value} checked={isRec === i.value} onChange={() => this.recChange(i.value)}>
                                                    {i.label}
                                                </RadioItem>
                                            ))}
                                        </List> */}
                                                    <List className='toFirst' renderHeader={() => '置顶：'}>
                                                        {isTopData.map(i => (
                                                            <RadioItem key={i.value} checked={isTop === i.value} onChange={() => this.topChange(i.value)}>
                                                                {i.label}
                                                                {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                            </RadioItem>
                                                        ))}
                                                    </List>
                                                </div>
                                            </div>
                                            <div className="sameBack description sameBackTop">审核说明:
                                            <List>
                                                    <TextareaItem
                                                        rows={3}
                                                        placeholder="请在此处输入审核的说明／不通过的原因"
                                                        onChange={v => _this.setState({
                                                            textareaValue: v
                                                        })}
                                                        value={calm.state.textareaValue}

                                                        count={30}
                                                    />
                                                </List>
                                            </div>
                                        </div>

                                    </div>

                                    :
                                    calm.state.type == 1 ?
                                        <div className="calm">
                                            <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                                <div className='line_public'>
                                                    <span className='title'>审核人：</span>{calm.state.auditUser}
                                                    <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                                </div>
                                                <div className='line_public'>
                                                    <span className='title'>审核说明：</span>
                                                    <div className='reCont'>
                                                        {calm.state.auditMark ? calm.state.auditMark : "无"}
                                                    </div>
                                                </div>
                                                <div className='result'>
                                                    <span className='title'>审核结果：</span>
                                                    {calm.state.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                    {calm.state.isRec == 1 ? <span className="pass">已优先</span> : <span>未优先</span>}
                                                    <div className="reBtn" onClick={calm.showAlert}>
                                                        重新审核
                                            </div>
                                                    <div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div style={{ display: calm.state.showMark ? "block" : "none" }}>
                                                <div className="isDangerArea priority">
                                                    <List className="line_public"  renderHeader={() => '审核：'}>
                                                        {data2.map(i => (
                                                            <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                                {i.label}
                                                                {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                            </RadioItem>
                                                        ))}
                                                    </List>
                                                    <List className='toPriority' style={{ display: calm.state.isShow ? "block" : "none" }} renderHeader={() => '优先展示：'}>
                                                        {isRecData.map(i => (
                                                            <RadioItem key={i.value} checked={isRec === i.value} onChange={() => this.recChange(i.value)}>
                                                                {i.label}
                                                                {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                            </RadioItem>
                                                        ))}
                                                    </List>

                                                </div>
                                                <div className="sameBack description sameBackTop">审核说明:
                                            <List>
                                                        <TextareaItem
                                                            rows={3}
                                                            placeholder="请在此处输入审核的说明／不通过的原因"
                                                            onChange={v => _this.setState({
                                                                textareaValue: v
                                                            })}
                                                            value={calm.state.textareaValue}

                                                            count={30}
                                                        />
                                                    </List>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        calm.state.type == 2 ?
                                            <div className="calm">
                                                <div style={{ display: calm.state.showStatus ? "block" : "none" }} className="review">
                                                    <div className='line_public'>
                                                        <span className='title'>审核人：</span>{calm.state.auditUser}
                                                        <span className='time'>{WebServiceUtil.formatYMD(calm.state.auditingTime)}</span>

                                                    </div>
                                                    <div className='line_public'>
                                                        <span className='title'>审核说明：</span>
                                                        <div className='reCont'>
                                                            {calm.state.auditMark ? calm.state.auditMark : "无"}
                                                        </div>
                                                    </div>
                                                    <div className='result'>
                                                        <span className='title'>审核结果：</span>
                                                        {calm.state.data.auditInfo.isPass == 1 ? <span className="pass">已通过</span> : <span>未通过</span>}
                                                        <div className="reBtn" onClick={calm.showAlert}>
                                                            重新审核
                                                </div>
                                                        <div>

                                                        </div>
                                                        <div style={{ display: calm.state.showMark ? "block" : "none" }}>
                                                            <div className="isDangerArea">
                                                                <List className="line_public"  renderHeader={() => '审核：'}>
                                                                    {data2.map(i => (
                                                                        <RadioItem key={i.value} checked={isPass === i.value} onChange={() => this.redioChange(i.value)}>
                                                                            {i.label}
                                                                            {/*<List.Item.Brief>{i.extra}</List.Item.Brief>*/}
                                                                        </RadioItem>
                                                                    ))}
                                                                </List>
                                                            </div>
                                                            <div className="sameBack description sameBackTop">审核说明:
                                                        <List>
                                                                    <TextareaItem
                                                                        rows={3}
                                                                        placeholder="请在此处输入审核的说明／不通过的原因"
                                                                        onChange={v => _this.setState({
                                                                            textareaValue: v
                                                                        })}
                                                                        value={calm.state.textareaValue}
                                                                        count={30}
                                                                    />
                                                                </List>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                            }
                        </div>
                    </div>
                    <div className="bottomBox">
                        <span className="close" onClick={calm.cancle}>取消</span>
                        <span className="bind" onClick={_this.submit}>确定</span>
                    </div>
                </div>
                <div className="tagAddPanel_bg"></div>
            </div>
        )
    }
}
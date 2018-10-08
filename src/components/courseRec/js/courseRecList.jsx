import React from "react";
import { Switch, SearchBar, ListView, Button, List, Radio, TextareaItem, Toast, Modal, } from 'antd-mobile';
import { createForm } from 'rc-form';
import '../css/courseRecListst.less'
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;

var calm;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const dataSource2 = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
export default class courseRecList extends React.Component {

    constructor(props) {
        super(props);
        calm = this;
        calm.initDataSource = [];
        calm.initDataSource2 = [];
        this.state = {
            showCancelButton: true,
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            dataSource2: dataSource2.cloneWithRows(this.initDataSource2),
            defaultPageNo: 1,
            defaultPageNo2: 1,
            isLoading: true,
            hasMore: true,
            isLoading2: false,
            hasMore2: true,
            recData: [],
            data: {},
            clientHeight: document.body.clientHeight,
            textareaValue: "",
            showMark: true,
        }
    }

    componentDidMount() {
        document.title = "课程推荐列表"
        calm.getRecommendCourseList();
        window.addEventListener('resize', calm.onWindowResize);
        $(".tagAddPanel_bg").hide();

    }
    /**
     * 推荐列表
     */
    getRecommendCourseList() {
        var param = {
            "method": 'getRecommendCourseList',
            "pageNo": calm.state.defaultPageNo,
            "courseName": "",
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
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }
    /**
     * 课程列表
     */
    getCourseListV3() {
        var param = {
            "method": 'getCourseListV3',
            "pageNo": calm.state.defaultPageNo2,
            "searchKeyWords": calm.state.searchValue,
        };
        WebServiceUtil.requestLittleElearningWeb(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, "kekekeke");
                if (result.success) {
                    calm.state.rsCount2 = result.pager.rsCount;
                    calm.initDataSource2 = calm.initDataSource2.concat(result.response);
                    calm.setState({
                        dataSource2: dataSource2.cloneWithRows(calm.initDataSource2),
                        isLoading2: false
                    })
                    if (calm.initDataSource2.length == result.pager.rsCount) {
                        calm.setState({
                            hasMore2: false,
                            isLoading2: false
                        })
                    }
                    calm.setState({
                        recData: result.response
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
    onEndReached2 = (event) => {
        console.log('触底事件')
        var _this = this;
        var currentPageNo2 = _this.state.defaultPageNo2;
        if (!_this.state.isLoading2 && !_this.state.hasMore2) {
            console.log('阻止请求')
            return;
        }
        currentPageNo2 += 1;
        _this.setState({
            isLoading2: true,
            defaultPageNo2: currentPageNo2,
        }, () => {
            _this.getCourseListV3();
        });
    };

    /**
     * 弹出半框
     */
    toAdd = () => {
        $(".updateModel").slideDown()
        $(".tagAddPanel_bg").show();
    }

    /**
     * 点击取消
     */
    cancle() {
        $(".updateModel").slideUp()
        $(".tagAddPanel_bg").hide();
        calm.setState({
            searchValue:""
        })

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

    /**
    * 输入框改变的时候
    */
    onChange = (value) => {
        this.initDataSource2 = [];
        this.setState({
            searchValue: value,
            dataSource2: dataSource2.cloneWithRows(this.initDataSource2)
        }, () => {
            calm.getCourseListV3()
        });
        console.log(calm.state.searchValue, "searchValue")
    };


    /**
     * 推荐
     */
    addRecommendCourse(rowData, checked) {
        var param = {
            "method": 'addRecommendCourse',
            "courseIds": rowData.id,
        };
        WebServiceUtil.requestLittleElearningWeb(JSON.stringify(param), {
            onResponse: result => {
                if (result.response) {
                    calm.initDataSource.push(rowData)
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource)
                    })
                    calm.initDataSource2.forEach((v, i) => {
                        if (v.id == rowData.id) {
                            calm.initDataSource2[i].recommend = checked
                        }
                    })
                    calm.setState({
                        dataSource2: dataSource2.cloneWithRows(calm.initDataSource2)
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }
    /**
     * 取消推荐
     */
    cancelRecommendCourse(rowData, checked) {
        var param = {
            "method": 'cancelRecommendCourse',
            "courseId": rowData.id,
        };
        WebServiceUtil.requestLittleElearningWeb(JSON.stringify(param), {
            onResponse: result => {
                if (result.response) {
                    calm.initDataSource.forEach((v, i) => {
                        if (v.id == rowData.id) {
                            calm.initDataSource.splice(i, 1)
                        }
                    })
                    calm.setState({
                        dataSource: dataSource.cloneWithRows(calm.initDataSource)
                    })
                    calm.initDataSource2.forEach((v, i) => {
                        if (v.id == rowData.id) {
                            calm.initDataSource2[i].recommend = checked
                        }
                    })
                    calm.setState({
                        dataSource2: dataSource2.cloneWithRows(calm.initDataSource2)
                    })
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }

    /**
    *  点击获取checked值
    */
    saveChecked = (checked, rowData) => {
        if (checked == true) {
            calm.addRecommendCourse(rowData, checked)
        }
        if (checked == false) {
            calm.cancelRecommendCourse(rowData, checked)

        }
    }
    /**
     * 重新审核弹出框
     */
    showAlert = (id, index, event) => {
        event.stopPropagation()
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定删除吗?', '', [
            { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
            { text: '确定', onPress: () => _this.deleteCourse(id, index, event) },

        ], phone);
    }
    /**
     * 删除
     */
    deleteCourse = (id, index, event) => {
        event.stopPropagation();
        console.log(id, '要刪除的id');
        console.log(index, '要刪除的id');
        calm.initDataSource.splice(index, 1);
        calm.setState({
            dataSource: dataSource.cloneWithRows(calm.initDataSource)
        })
        var param = {
            "method": 'cancelRecommendCourse',
            "courseId": id,
        };
        WebServiceUtil.requestLittleElearningWeb(JSON.stringify(param), {
            onResponse: result => {
                if (result.response) {
                    if (result.success) {
                        Toast.info('刪除成功');
                    }
                }
            },
            onError: function (error) {
                // Toast.fail(error, 1); 
            }
        });
    }
    /**
     * 跳转详情页
     */
    toDetail=(id,userId,courseName)=>{
        console.log(id)
        var url = WebServiceUtil.mobileServiceURL + "addRecCourse?id=" + id+ "&userId=" + userId+"&cName="+courseName;
        var data = {
            method: 'openNewPage',
            url: url,
        };

        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    render() {
        var _this = this;
        const row = (rowData, sectionID, rowID) => {
            console.log(rowData, "rowData")
            rowData = rowData || {}
            return (
                <div className="list_item my_flex" onClick={calm.toDetail.bind(this,rowData.id,rowData.publisher_id,rowData.courseName)}>
                    <img src={rowData.image} alt="" />
                    <div className="textCont my_flex">
                        <div className="text_hidden courseName">{rowData.courseName}</div>
                        <div>
                            <span className="tag">{rowData.courseType.name}</span>
                        </div>
                        <div className="teacherName">
                            <span className='text_hidden'>{rowData.publisher}</span>
                            <div className="deleteBtn_common" onClick={calm.showAlert.bind(this, rowData.id, rowID)}></div>
                        </div>

                    </div>
                </div>
            )
        }
        const row2 = (rowData, sectionID, rowID) => {
            console.log(rowData, "rowData")
            rowData = rowData || {}
            let SwitchExample = (props) => {
                const { getFieldProps } = props.form;
                return (
                    <List.Item
                        extra={<Switch
                            {...getFieldProps('Switch8', {
                                initialValue: rowData.recommend,
                                valuePropName: 'checked',
                            })}
                            platform="ios"
                            onClick={(checked) => {
                                calm.saveChecked(checked, rowData)
                            }}
                        />}
                    >设为推荐</List.Item>
                );
            };
            SwitchExample = createForm()(SwitchExample);
            return (
                <div className="item">
                    <div className="bg">
                        <img src={rowData.image} alt="" />
                       <div className="content">
                           <div className="courseName text_hidden marginTop">{rowData.courseName}</div>
                           <div className='marginTop'><span className="tag">{rowData.courseType.name}</span></div>
                           {
                               rowData.videos.length == 1 ?
                                   <div className="time marginTop">{WebServiceUtil.formatYMD(rowData.createTime)}</div>
                                   :
                                   <div className="time marginTop">
                                       {WebServiceUtil.formatMD2(rowData.createTime) + '-' + WebServiceUtil.formatMD2(rowData.endTime)}<span>{rowData.videos.length}课时</span>
                                   </div>

                           }
                           <div className="teacherName text_hidden marginTop">{rowData.publisher}</div>
                           <SwitchExample />
                       </div>
                    </div>
                </div>
            )
        }



        return (
            <div id="courseRecListst" style={{
                height: document.body.clientHeight
            }}>
                <div className='emptyDiv' style={{ display: calm.initDataSource.length == 0 ? "block" : 'none' }}>
                    <div className='emptyIcon'></div>
                </div>

                <div style={{
                    height: document.documentElement.clientHeight,
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
                            height: document.body.clientHeight,
                        }}
                    />
                </div>
                <div className="addBunton" onClick={calm.toAdd}><img src={require("../../classCardSystemBackstage/imgs/addBtn.png")} /></div>
                <div id="courseRecListst" className="updateModel noPadding">
                    <div className="modalCont">
                        {/* <div className="goBack line_public"><Icon type="left" onClick={calm.goBack}/></div> */}
                        <SearchBar id="search"
                            onSubmit={value => console.log(value, 'onSubmit')}
                            onClear={value => console.log(value, 'onClear')}
                            onFocus={() => console.log('onFocus')}
                            onBlur={() => console.log('onBlur')}
                            onCancel={this.cancle}
                            onChange={this.onChange}
                            showCancelButton={calm.state.showCancelButton}
                            placeholder="请输入搜索内容"
                            maxLength={8} />
                        <div className="content" ref="contentDOM">
                            {/* 搜素结果 */}
                            <ListView
                                ref={el => this.lv = el}
                                dataSource={this.state.dataSource2}    //数据类型是 ListViewDataSource
                                renderFooter={() => (
                                    <div style={{ paddingTop: 5, paddingBottom: 0, textAlign: 'center' }}>
                                        {this.state.isLoading2 ? '正在加载...' : '已经全部加载完毕'}
                                    </div>)}
                                renderRow={row2}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                                className="am-list searchList"
                                pageSize={30}    //每次事件循环（每帧）渲染的行数
                                //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                                scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                                onEndReached={this.onEndReached2}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                                onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                                initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                                scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                                onScroll={this.scroll}
                                style={{
                                    height: document.body.clientHeight*0.7 - 49,
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="tagAddPanel_bg"></div>
            </div>
        )
    }
}
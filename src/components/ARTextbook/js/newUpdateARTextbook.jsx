import React from 'react';
import {
    Toast,
    Button,
    InputItem,
    Tabs, WhiteSpace, Modal, Icon, Tag
} from 'antd-mobile';
import "../css/UpdateARTextbook.less"

var teacherV;
const alert = Modal.alert;
const prompt = Modal.prompt;

/**
 * 排序
 * @param prop
 * @returns {Function}
 */
var compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}

export default class newUpdateARTextbook extends React.Component {

    constructor(props) {
        super(props);
        teacherV = this;
        this.state = {
            search_bg: false,
            clientHeight: document.body.clientHeight,
            picNewObj: {},  //存储照片
            videoNewObj: [], //存储视频
            initData: {},
            itemList: [],
            ARTextbookValue: '',  //教材名称
            attachment: '',  //附件地址
            tagArr: [],
            searchTagValue: '',
            tagsBefore: [],
        };
    }

    componentWillMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var bId = locationSearch.split("&")[0].split("=")[1];
        var uId = locationSearch.split("&")[1].split("=")[1];
        var ArName = locationSearch.split("&")[2].split("=")[1];
        this.setState({"bId": bId, "uId": uId, "ArName": ArName});
        this.viewARBook(bId);
        window.addEventListener('resize', this.onWindwoResize);
    }

    componentDidMount() {
        document.title = '编辑教材';
        Bridge.setShareAble("false");
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindwoResize);
    }

    //监听窗口改变时间
    onWindwoResize() {
        // this
        setTimeout(() => {
            teacherV.setState({
                clientHeight: document.body.clientHeight,
            })
        }, 100)
    }

    /**
     * 更新AR教材
     */
    updateARBook = () => {
        var arr = teacherV.state.initData.itemList;
        for (var i = 0; i < arr.length; i++) {
            var array = []
            for (var j = 0; j < arr[i].tagList.length; j++) {
                array.push(arr[i].tagList[j].id)
            }
            arr[i].tagList = array
        }
        var param = {
            "method": 'updateARBook',
            "bookData": {
                "creatorId": teacherV.state.uId,
                "id": teacherV.state.bId,
                "name": teacherV.state.ARTextbookValue,
                "attachment": teacherV.state.attachment,
                "status": teacherV.state.status,
                "itemList": arr
            }
        }
        console.log(param);
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    Toast.success('成功');
                    //关闭当前窗口，并刷新上一个页面
                    var data = {
                        method: 'finishForRefresh',
                    };
                    Bridge.callHandler(data, null, function (error) {
                        console.log(error);
                    });
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    /**
     * 页码数据框动态绑定内容的方法
     * @param index
     * @param value
     */
    inputOnChange = (value) => {
        this.setState({
            pageNoValue: value
        })
    }

    /**
     * 查看单独的AR教材
     */
    viewARBook(bId) {
        var param = {
            "method": 'viewARBook',
            "bId": bId
        }
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.msg == '调用成功' || result.success == true) {
                    teacherV.state.initData = result.response;

                    var tagArr = []
                    result.response.itemList.forEach(function (v, i) {
                        // {title: '1st Tab'}
                        tagArr.push({
                            title: '第' + v.page + '页',
                            index: v.page,
                            page: v.page,
                            tagClick: false
                        })
                    });

                    //去重
                    teacherV.makeArr(tagArr);

                    teacherV.setState({
                        ARTextbookValue: teacherV.state.initData.name,
                        tagArr,
                        attachment: teacherV.state.initData.attachment,
                        status: teacherV.state.initData.status,
                        // index: teacherV.state.initData.itemList[index].index,
                        // videoNewObj: teacherV.state.initData.itemList[0].video.split(","),
                        // picNewObj: teacherV.state.initData.itemList[index].pic,
                        // itemList: teacherV.state.initData.itemList
                    }, () => {
                        /**
                         * 初始化点击
                         */
                        teacherV.tabsOnChange(tagArr[0])
                        teacherV.setState({clickTab: tagArr[0]})
                    })
                } else {
                    Toast.fail(result.msg, 5);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });

    }

    /**
     * 去重
     * @param arr
     * @returns {*}
     */
    makeArr(arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i].index == arr[j].index) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr
    }

    /**
     *上传附件
     *
     * @memberof addARTextbook
     */
    uploadFile(event) {
        event.stopPropagation()
        var data = {
            method: 'selectAttech',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到附件地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.filePath = item[0],
                newArr.fileName = item[1].split("=")[1],
                newArr.fileExtra = (item[1].split("=")[1]).split(".")[1],
                teacherV.setState({attachment: newArr.filePath});
            teacherV.tabsOnChange(teacherV.state.clickTab)
        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传照片
     */
    uploadImage(index, event) {
        event.stopPropagation()
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
                newArr.picName = item[1].split("=")[1]

            teacherV.state.initData.itemList.forEach(function (v, i) {
                if (v.index == index) {
                    v.pic = newArr.picPath
                }
            })
            teacherV.tabsOnChange(teacherV.state.clickTab)

        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 上传视频
     */
    uploadVideo(src, index, event) {
        event.stopPropagation()
        var data = {
            method: 'selectVideo',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到视频地址,显示在页面等待上传
            var arr = res.split(',');

            let item = arr[0].split("?")[0];

            teacherV.state.initData.itemList.forEach(function (v, i) {
                if (v.index == index) {
                    v.video = v.video.replace(src, item);
                }
            })
            teacherV.tabsOnChange(teacherV.state.clickTab)

        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 请输入页码model
     */
    showAddPage() {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }

        prompt('请输入页码', '', [
            {text: '取消'},
            {text: '确定', onPress: value => teacherV.addPage(value)},
        ], 'default', '', [], phone)
        if (phone == 'ios') {
            document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        }
    }

    /**
     * 增加页
     */
    addPage(value) {
        if (value.length != 0) {

            var flag = true

            for (var i = 0; i < teacherV.state.initData.itemList.length; i++) {
                if (value == teacherV.state.initData.itemList[i].page) {
                    //页码存在,直接指向
                    teacherV.state.tagArr.forEach(function (item, index) {
                        if (item.page == value) {
                            teacherV.tabsOnChange(item)
                        }
                    })
                    flag = false
                    break
                }
            }

            var arr = []
            teacherV.state.initData.itemList.forEach(function (v, i) {
                arr.push(v.index)
            })
            var max = Math.max.apply(null, arr);

            if (flag) {
                teacherV.state.initData.itemList.push({
                    index: max + 1,
                    page: value,
                    pic: '',
                    video: '',
                    tagList: []
                })

                teacherV.state.tagArr.push({
                    index: value,
                    page: value,
                    title: '第' + value + "页"
                })

                /**
                 * 页码排序
                 */
                teacherV.state.tagArr.sort(compare("page"))

                teacherV.tabsOnChange({
                    index: value,
                    page: value,
                    title: '第' + value + "页"
                })
            }
        }
    }

    /**
     * 增加组
     */
    addList() {
        var arr = []
        teacherV.state.initData.itemList.forEach(function (v, i) {
            arr.push(v.index)
        })
        var max = Math.max.apply(null, arr);

        teacherV.state.initData.itemList.push(
            {
                pic: '',
                video: '',
                page: teacherV.state.clickTab.page,
                index: max + 1,
                tagList: []
            }
        )

        teacherV.tabsOnChange(teacherV.state.clickTab)
    }

    /**
     * 删除组model
     * @param src
     * @param id
     * @param event
     */
    showListAlert = (v, event) => {
        event.stopPropagation()

        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定移除吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.delList(v)},

        ], phone);
    }

    /**
     * 删除组
     * @param v
     */
    delList(v) {
        teacherV.state.initData.itemList.forEach(function (item, index) {
            if (item.index == v.index) {
                teacherV.state.initData.itemList.splice(index, 1)
            }
        })
        teacherV.tabsOnChange(teacherV.state.clickTab)
    }

    /**
     * 增加视频
     */
    addUploadVideo(index) {
        var data = {
            method: 'selectVideo',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到视频地址,显示在页面等待上传
            var arr = res.split(',');

            let item = ',' + arr[0].split("?")[0];

            teacherV.state.initData.itemList.forEach(function (v, i) {
                if (v.index == index) {
                    v.video += item
                }
            })
            teacherV.tabsOnChange(teacherV.state.clickTab)

        }, function (error) {
            console.log(error);
        });
    }

    /**
     * 删除文件model
     * @param src
     * @param id
     * @param event
     */
    showAlert = (src, id, event) => {
        event.stopPropagation()

        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定移除吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.delVideoFile(src, id)},

        ], phone);
    }

    /**
     * 删除文件确定
     * @param src
     */
    delVideoFile(src, id) {

        teacherV.state.initData.itemList.forEach(function (v, i) {
            if (v.id == id) {
                if (v.video.split(',').length == 1) {
                    Toast.fail('请至少保留一个视频或文件', 2)
                    return
                } else {
                    var arr = v.video.split(',')
                    arr.forEach(function (item, index) {
                        if (src == item) {
                            arr.splice(index, 1)
                        }
                    })

                    v.video = arr.join(',')
                }
            }
        })
        teacherV.tabsOnChange(teacherV.state.clickTab)
    }

    /**
     * 增加标签
     * @param index
     */
    addTags(index) {
        $('.tagAddPanel').slideDown()
        teacherV.setState({tagsIndex: index})
    }

    /**
     * 取消标签搜索面板
     */
    exitAddTags() {
        $('.tagAddPanel').slideUp()
        teacherV.setState({tagsLi: []})
        teacherV.setState({searchTagValue: ''})
    }

    /**
     * 确定增加标签
     */
    addTagsForSure() {
        //去重
        $('.tagAddPanel').slideUp()

        for (var i = 0; i < teacherV.state.initData.itemList.length; i++) {
            if (teacherV.state.initData.itemList[i].index == teacherV.state.tagsIndex) {
                teacherV.state.initData.itemList[i].tagList = teacherV.state.initData.itemList[i].tagList.concat(teacherV.state.tagsBefore)
            }
        }

        teacherV.tabsOnChange(teacherV.state.clickTab)

        teacherV.setState({tagsLi: [], tagsBefore: []})
        teacherV.setState({searchTagValue: ''})
    }

    /**
     * 删除tags model
     * @param src
     * @param id
     * @param event
     */
    showDelTagsAlert = (src, index, event) => {
        event.stopPropagation()

        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定移除吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.delTags(src, index)},

        ], phone);
    }

    /**
     *删除标签
     */
    delTags(v, index) {

        for (var i = 0; i < teacherV.state.initData.itemList.length; i++) {
            if (teacherV.state.initData.itemList[i].index == index) {
                for (var j = 0; j < teacherV.state.initData.itemList[i].tagList.length; j++) {
                    if (teacherV.state.initData.itemList[i].tagList[j].id == v.id) {
                        teacherV.state.initData.itemList[i].tagList.splice(j, 1)
                    }
                }
            }
        }
        teacherV.tabsOnChange(teacherV.state.clickTab)
    }

    searchOnChange(e) {
        teacherV.setState({searchTagValue: e})
    }

    tagOnChange(data, v) {
        if (v) {
            teacherV.state.tagsBefore.push(data)
        } else {
            teacherV.state.tagsBefore.forEach(function (v, i) {
                if (v.id == data.id) {
                    teacherV.state.tagsBefore.splice(i, 1)
                }
            })
        }
    }

    searchTagByWords() {
        teacherV.setState({tagsLi: []}, () => {
            var param = {
                "method": 'searchARBookTag',
                "adminId": teacherV.state.uId,
                "keyword": teacherV.state.searchTagValue,
                "pn": -1
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        if (!WebServiceUtil.isEmpty(result.response)) {
                            var arr = []
                            result.response.forEach(function (v, i) {
                                arr.push(<Tag
                                    selected={false}
                                    onChange={teacherV.tagOnChange.bind(this, v)}
                                >{v.content}</Tag>)
                            })
                            teacherV.setState({tagsLi: arr})
                        }
                    } else {
                        Toast.fail(result.msg, 5);
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });
        })
    }

    /**
     *播放视频
     */
    theVideoPlay(i) {
        // var videoDiv = $(".videoDiv")
        // videoDiv[i].play();
    }

    tabsOnChange(index, event) {

        //加点击类名字,只需要改变tagClick为true即可
        teacherV.state.tagArr.forEach(function (v, i) {
            v.tagClick = false
            if (v.index == index.index) {
                v.tagClick = true
            }
        })

        var arr = []
        teacherV.state.initData.itemList.forEach(function (v, i) {
            if (index.index == v.page) {
                arr.push(v)
            }
        })

        var tabItem = []

        arr.forEach(function (v, i) {

            //新加的图片,样式是加号
            var imgDivSon = <div className="div68" onClick={teacherV.imgPreview.bind(this, v.pic)}>
                <div className="uploadBtn icon_pointer" onClick={teacherV.uploadImage.bind(this, v.index)}></div>
            </div>;

            if (WebServiceUtil.isEmpty(v.pic) == false) {
                imgDivSon = <div className="div68" onClick={teacherV.imgPreview.bind(this, v.pic)}>
                    <button className="uploadAttech i_uploadAttech">{
                        <img className="imgDiv" src={v.pic}/>
                    }
                        <div className="icon_pointer" onClick={teacherV.uploadImage.bind(this, v.index)}>修改</div>
                    </button>
                </div>
            }

            var imgDiv = <div className="tabItem_list">
                <span className="del_group icon_pointer" onClick={teacherV.showListAlert.bind(this, v)}>删除</span>
                <div className="am-list-item item_list20">
                    <div className="am-input-label am-input-label-5">教材图片</div>
                    {imgDivSon}
                </div>
                <div className="line_public flex_container"></div>
                <div className="am-list-item item_list20">
                    {
                        v.video.substr(v.video.length - 3, 3) !== "mp4" ?
                            <div className="am-input-label am-input-label-5">相关文件</div>
                            :
                            <div className="am-input-label am-input-label-5">相关视频</div>

                    }

                    <div className="div68">
                        {
                            v.video.split(',').map((vtem, index) => {
                                var item = vtem.split(".");
                                if (item[item.length - 1] == "pdf") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech pdfDiv"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <div className="icon_pointer"
                                                 onClick={teacherV.uploadVideo.bind(this, vtem, v.index)}>修改
                                            </div>
                                            <span className="del_ar icon_pointer"
                                                  onClick={teacherV.showAlert.bind(this, vtem, v.id)}></span>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "pptx" || item[item.length - 1] == "ppt") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech pptDiv"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <div className="icon_pointer"
                                                 onClick={teacherV.uploadVideo.bind(this, vtem, v.index)}>修改
                                            </div>
                                            <span className="del_ar icon_pointer"
                                                  onClick={teacherV.showAlert.bind(this, vtem, v.id)}></span>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "xls" || item[item.length - 1] == "xlsx") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech xlsDiv"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <div className="icon_pointer"
                                                 onClick={teacherV.uploadVideo.bind(this, vtem, v.index)}>修改
                                            </div>
                                            <span className="del_ar icon_pointer"
                                                  onClick={teacherV.showAlert.bind(this, vtem, v.id)}></span>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "docx" || item[item.length - 1] == "doc") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech docDiv"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            {/* <div>{v.fileName}</div> */}
                                            <div className="icon_pointer"
                                                 onClick={teacherV.uploadVideo.bind(this, vtem, v.index)}>修改
                                            </div>
                                            <span className="del_ar icon_pointer"
                                                  onClick={teacherV.showAlert.bind(this, vtem, v.id)}></span>
                                        </div>
                                    )
                                } else if (item[item.length - 1] == "mp4") {
                                    return (
                                        <div className="uploadAttech i_uploadAttech"
                                             onClick={teacherV.videoPreview.bind(this, vtem, v.id)}>
                                            <span className="del_ar icon_pointer"
                                                  onClick={teacherV.showAlert.bind(this, vtem, v.id)}></span>
                                            <video onClick={teacherV.theVideoPlay.bind(this, i)} className="videoDiv"
                                                   src={vtem}></video>
                                            <div className="icon_pointer"
                                                 onClick={teacherV.uploadVideo.bind(this, vtem, v.index)}>修改
                                            </div>
                                        </div>
                                    )
                                }

                            })
                        }

                        <div className="uploadBtn icon_pointer"
                             onClick={teacherV.addUploadVideo.bind(this, v.index)}>
                            增加
                        </div>

                    </div>
                </div>
                <div className="line_public flex_container"></div>
                <div className="am-list-item item_list20">
                    <div className="am-input-label am-input-label-5">相关标签</div>
                    <div className="div68">
                        {
                            v.tagList.map(function (item, index) {
                                return <li className="spanTag">
                                    <span className="textOver">{item.content}</span>
                                    <span className="del_ar icon_pointer"
                                          onClick={teacherV.showDelTagsAlert.bind(this, item, v.index)}></span>
                                </li>
                            })
                        }

                        <span className="tagBtn icon_pointer" onClick={teacherV.addTags.bind(this, v.index)}></span>
                    </div>
                </div>

            </div>
            tabItem.push(imgDiv)

        })
        teacherV.setState({tabItem, clickTab: index})
    }

    /**
     * 附件预览
     * @param data
     */
    pdfPreview() {

        var content2 = teacherV.state.attachment.replace("60.205.111.227", "www.maaee.com");
        var content3 = content2.replace("60.205.86.217", "www.maaee.com");
        var data = {};
        data.method = 'openNewPage';
        data.url = "http://www.maaee.com/Excoord_For_Education/js/pdfjs/web/viewer.html?file=" + content3;
        Bridge.callHandler(data, null, function (error) {

        });
    }

    /**
     * 图片预览
     */
    imgPreview(src) {
        var dataObj = {};
        dataObj.method = 'showImage';
        dataObj.url = src;
        dataObj.currentUrl = src;
        Bridge.callHandler(dataObj, null, function (error) {
            console.log(error);
        })
    }

    /**
     * 视频,文件预览
     */
    videoPreview(src, id, event) {
        event.stopPropagation()

        if (src.substr(src.length - 3, 3) != 'mp4') {

            var param = {
                "method": 'getOfficeHadleFileBySourcePath',
                "sourcePath": src
            }
            WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
                onResponse: function (result) {
                    if (result.msg == '调用成功' || result.success == true) {
                        var src = result.response.pdfPath || result.response.htmlPath || result.response.path;

                        var pdfURL = src.replace("60.205.111.227", "www.maaee.com");
                        pdfURL = pdfURL.replace("60.205.86.217", "www.maaee.com");
                        if (pdfURL.indexOf("https") == -1 && pdfURL.indexOf("http") != -1) {
                            pdfURL = pdfURL.replace("http", "https");
                        }
                        var data = {};
                        data.method = 'openNewPage';
                        data.url = pdfURL;
                        Bridge.callHandler(data, null, function (error) {
                            window.location.href = url;
                        });

                    } else {
                        Toast.fail(result.msg, 5);
                    }
                },
                onError: function (error) {
                    // message.error(error);
                }
            });
        } else {
            //视频预览

            var data = {
                method: 'playVideo',
                url: src
            };
            Bridge.callHandler(data, null, function (error) {

            });
        }

    }

    render() {

        var _this = this;

        return (
            <div id="UpdateARTextbook" style={{height: this.state.clientHeight}}>
                {/*教材名*/}
                <InputItem
                    placeholder="请输入教材名称"
                    ref={el => this.labelFocusInst = el}
                    onChange={v => teacherV.setState({
                        ARTextbookValue: v
                    })}
                    value={_this.state.ARTextbookValue}
                >
                    <div onClick={() => this.labelFocusInst.focus()}>AR教材</div>
                </InputItem>
                <div className="line_public flex_container"></div>
                {/*附件*/}
                <div className="am-list-item item_list20"
                >
                    <div className="am-input-label am-input-label-5">教材附件</div>
                    <div className="div68" onClick={teacherV.pdfPreview}>
                        <button className="uploadAttech i_uploadAttech upload_file">
                            <div className="icon_pointer" onClick={teacherV.uploadFile}>修改</div>
                        </button>
                    </div>
                </div>

                <WhiteSpace size="lg"/>

                <div className="tabCont">
                    <ul>
                        {
                            this.state.tagArr.map(function (v, i) {
                                return <li
                                    className={v.tagClick ? 'icon_pointer pageNumber active' : 'icon_pointer pageNumber'}
                                    onClick={teacherV.tabsOnChange.bind(this, v)}
                                    ref={v.index}
                                >{v.title}</li>
                            })
                        }
                    </ul>
                    <div className="add_page" onClick={this.showAddPage}><Icon className="icon_pointer" type="plus"/>
                    </div>
                </div>

                <div className="tabItem_cont">
                    {this.state.tabItem}
                    <WhiteSpace size="lg"/>
                    <div onClick={this.addList} className='addARTextbookTable'>
                        <div className="addBtn icon_pointer">
                            <Icon type="plus"/>
                            <span>添加扫描的图片</span></div>
                    </div>
                </div>

                <div className='submitBtn icon_pointer'>
                    <Button type="warning" onClick={this.updateARBook}>提交</Button>
                </div>

                <div className='tagAddPanel' style={{height: document.body.clientHeight / 2, display: 'none'}}>
                    <div className="tagInput">
                        <InputItem
                            placeholder="请输入关键字"
                            value={this.state.searchTagValue}
                            onChange={this.searchOnChange}
                        >
                            <div>标签名称</div>
                        </InputItem>


                        {/*<input type="text" value={this.state.searchTagValue} onChange={this.searchOnChange}/>*/}
                        {/*<button onClick={this.searchTagByWords}>搜索</button>*/}


                        <div className="searchIcon" onClick={this.searchTagByWords}></div>
                    </div>


                    <ul className="classTags">
                        {this.state.tagsLi}
                    </ul>


                    <div className="bottomBox">
                        <span className="close" onClick={this.exitAddTags}>取消</span>
                        <span className="bind" onClick={this.addTagsForSure}>确定</span>
                    </div>
                </div>

            </div>
        );
    }
}

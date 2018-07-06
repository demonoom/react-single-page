import React from 'react';
import '../css/contactsList.less'
import {PullToRefresh, List, TextareaItem, Toast} from 'antd-mobile';

var chatDetil;

function genData() {
    const dataArr = [];
    for (let i = 0; i < 60; i++) {
        dataArr.push(i);
    }
    return dataArr;
}

function isToday(str) {
    var isToday = false;
    if (new Date(parseInt(str)).toDateString() === new Date().toDateString()) {
        //今天
        isToday = true;
    } else if (new Date(parseInt(str)) < new Date()) {
        //之前
        isToday = false;
    }
    return isToday;
}


export default class chat_Detil extends React.Component {

    constructor(props) {
        super(props);

        chatDetil = this;
        this.state = {
            refreshing: false,
            height: document.documentElement.clientHeight,
            data: [],
        };
    }

    componentWillMount() {
        document.title = "小蚂蚁聊天窗口";   //设置title
        // http://192.168.0.105:8091/#/chatDetil
    }

    componentDidMount() {
        var _this = this;
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei,
            data: genData(),
        }), 0)

        var param = {
            "method": 'getUser2UserMessages',
            "user1Id": 6075,
            "user2Id": 24491,
            "timeNode": (new Date()).valueOf()
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {
                    console.log(result.response);
                    // _this.buildChatContent(result.response)
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    buildChatContent(data) {
        var _this = this;
        if (WebServiceUtil.isEmpty(data) == false) {


            var i = 0;
            var messageList = [];
            var timeSign = 0;   //起始时间标记
            data.forEach(function (e) {

                if (e.command == "message") {
                    var messageOfSinge = e;
                    if (i == data.length - 1) {
                        chatDetil.setState({"firstMessageCreateTime": messageOfSinge.createTime});
                    }
                    i++;
                    var uuidsArray = [];
                    if (WebServiceUtil.isEmpty(messageOfSinge.attachment) == false) {
                        var attachment = messageOfSinge.attachment.address;
                        var attachmentType = messageOfSinge.attachment.type;
                    }
                    if (WebServiceUtil.isEmpty(messageOfSinge.expressionItem) == false) {
                        var expressionItem = messageOfSinge.expressionItem.address;
                    }
                    if (WebServiceUtil.isEmpty(messageOfSinge.cloudFile) == false) {
                        //文件名
                        var fileName = messageOfSinge.cloudFile.name;
                        //路径
                        var filePath = messageOfSinge.cloudFile.path;
                        //大小
                        var fileLength = messageOfSinge.cloudFile.length;
                        //uuid
                        var fileUid = messageOfSinge.cloudFile.uuid;
                        //文件CreateUid
                        var fileCreateUid = messageOfSinge.cloudFile.createUid;
                    }
                    var biumes = null;
                    if (e.biuId != 0) {
                        //这是biumessage
                        biumes = true;
                    } else {
                        biumes = false;
                    }
                    var fromUser = messageOfSinge.fromUser;
                    var toId = messageOfSinge.toId;
                    var toName = messageOfSinge.toUser.userName;
                    var isCurrentDay = isToday(messageOfSinge.createTime);
                    var mesTime;
                    var timeSignForTime;
                    // if (isCurrentDay) {
                    //     //如果是当天的消息，只显示时间
                    //     mesTime = WebServiceUtil.formatHM(messageOfSinge.createTime);
                    //     timeSignForTime = WebServiceUtil.formatHM(timeSign);
                    // } else {
                    //     //非当天时间，显示的是月-日
                    //     mesTime = WebServiceUtil.formatMD(messageOfSinge.createTime) + ' ' + WebServiceUtil.formatHM(messageOfSinge.createTime);
                    //     timeSignForTime = WebServiceUtil.formatMD(timeSign) + ' ' + WebServiceUtil.formatHM(timeSign);
                    // }
                    var colUtype = fromUser.colUtype;
                    var loginUser = _this.state.userId;
                    // if (messageOfSinge.createTime - timeSign != messageOfSinge.createTime && timeSign - messageOfSinge.createTime > 300000) {
                    //     var messageShow = {
                    //         'fromUser': {
                    //             "avatar": "http://www.maaee.com:80/Excoord_For_Education/userPhoto/default_avatar.png",
                    //             "colUid": 120024,
                    //             "userName": "群通知者",
                    //         },
                    //         'content': timeSignForTime,
                    //         "messageType": "getMessage",
                    //         "showType": 1,
                    //         "messageReturnJson": {
                    //             messageType: "text",
                    //         },
                    //     };
                    //     messageList.push(messageShow);
                    // }
                    // ;
                    timeSign = messageOfSinge.createTime;
                    if (messageOfSinge.toType == 1) {
                        var uuid = messageOfSinge.uuid;
                        var showType = messageOfSinge.showType;
                        uuidsArray.push(uuid);
                        var content = messageOfSinge.content;
                        if (messageOfSinge.readUserCount == 0) {
                            var readStateStr = '未读',
                                readState = 0;
                        } else {
                            var readStateStr = '已读',
                                readState = messageOfSinge.readUserCount;
                        }
                        var imgTagArrayReturn = [];
                        var messageReturnJson = _this.getImgTag(messageOfSinge);
                        if (WebServiceUtil.isEmpty(messageReturnJson) == false && WebServiceUtil.isEmpty(messageReturnJson.messageType) == false) {
                            if (messageReturnJson.messageType == "text") {
                                content = messageReturnJson.textMessage;
                            } else if (messageReturnJson.messageType == "imgTag") {
                                imgTagArrayReturn = messageReturnJson.imgMessage;
                            }
                        }
                        var messageShow = {
                            'fromUser': fromUser,
                            'content': content,
                            "messageType": "getMessage",
                            "imgTagArray": imgTagArrayReturn,
                            "messageReturnJson": messageReturnJson,
                            "attachment": attachment,
                            "attachmentType": attachmentType,
                            "expressionItem": expressionItem,
                            "fileName": fileName,
                            "filePath": filePath,
                            "fileLength": fileLength,
                            "fileUid": fileUid,
                            "fileCreateUid": fileCreateUid,
                            "biumes": biumes,
                            "uuid": uuid,
                            "showType": showType,
                            "readState": readState,
                            "readStateStr": readStateStr,
                            "mesTime": mesTime,
                            "mesTimeForDetil": messageOfSinge.createTime,
                            "toId": toId,
                            "toName": toName,
                        };
                        messageList.push(messageShow);
                    }
                }

            })
        }
    }

    /**
     * 判断来的消息是什么消息
     * @param messageOfSingle
     * @returns {{}}
     */
    getImgTag(messageOfSingle) {
        if (WebServiceUtil.isEmpty(messageOfSingle.content.trim()) == false) {

            if (WebServiceUtil.isEmpty(messageOfSingle.attachment) == false) {
                if (messageOfSingle.attachment.type == 1) {
                    //图片
                    var address = messageOfSingle.attachment.address;
                    messageReturnJson = {messageType: "bigImgTag", address: address};
                } else if (messageOfSingle.attachment.type == 2) {
                    //语音
                    var address = messageOfSingle.attachment.address;
                    messageReturnJson = {messageType: "videoTag", address: address};
                } else if (messageOfSingle.attachment.type == 3) {
                    var address = messageOfSingle.attachment.address;
                    var addressCover = messageOfSingle.attachment.cover;
                    messageReturnJson = {messageType: "littleAudio", address: address, addressCover: addressCover};
                } else if (messageOfSingle.attachment.type == 4) {
                    //链接
                    var address = messageOfSingle.attachment.address;
                    var content = messageOfSingle.attachment.content;
                    messageReturnJson = {messageType: "linkTag", address: address, content: content};
                }
            }
        } else {
            if (WebServiceUtil.isEmpty(messageOfSingle.expressionItem) == false) {
                //动态表情（ios的动态表情本来就是没有content的）
                var expressionItem = messageOfSingle.expressionItem;
                messageReturnJson = {messageType: "audioTag", expressionItem: expressionItem};
            } else if (WebServiceUtil.isEmpty(messageOfSingle.attachment) == false) {
                if (messageOfSingle.attachment.type == 4) {
                    //没有内容链接
                    var address = messageOfSingle.attachment.address;
                    var content = messageOfSingle.attachment.content;
                    messageReturnJson = {messageType: "linkTag", address: address, content: content};
                } else if (messageOfSingle.attachment.type == 1) {
                    //图片
                    var address = messageOfSingle.attachment.address;
                    messageReturnJson = {messageType: "bigImgTag", address: address};
                } else if (messageOfSingle.attachment.type == 2) {
                    //语音
                    var address = messageOfSingle.attachment.address;
                    messageReturnJson = {messageType: "videoTag", address: address};
                }
            } else if (WebServiceUtil.isEmpty(messageOfSingle.cloudFile) == false) {
                //上传的文件

                //文件名
                var name = messageOfSingle.cloudFile.name;
                //文件大小
                var length = messageOfSingle.cloudFile.length;
                //文件路径
                var path = messageOfSingle.cloudFile.path;
                messageReturnJson = {messageType: "fileUpload", name: name, length: length, path: path};
            }
        }
        return messageReturnJson;
    }


    render() {

        return (<div id='chatDetil'>
            <PullToRefresh
                damping={60}   //拉动距离限制, 建议小于 200
                ref={el => this.ptr = el}
                style={{
                    height: this.state.height,
                    overflow: 'auto',
                }}
                direction='down'
                refreshing={this.state.refreshing}  //是否显示刷新状态
                onRefresh={() => {
                    this.setState({refreshing: true});
                    setTimeout(() => {
                        this.setState({refreshing: false});
                    }, 1000);
                }}
            >
                {this.state.data.map(i => (
                    <div key={i} style={{textAlign: 'center', padding: 20}}>
                        {'pull up'} {i}
                    </div>
                ))}
            </PullToRefresh>

            <List
                style={{
                    position: 'absolute',
                    bottom: '0px',
                    width: document.body.clientWidth
                }}>
                <TextareaItem
                    autoHeight
                    labelNumber={3}
                />
            </List>
        </div>);
    }
}
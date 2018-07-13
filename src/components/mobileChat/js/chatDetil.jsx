import React from 'react';
import '../css/chatDetil.less'
import {MsgConnection} from '../../../helpers/chat_websocket_connection';
import {PullToRefresh, List, TextareaItem, Toast, Button} from 'antd-mobile';

var chatDetil;
var scrollNum = 0;

//消息通信js
window.ms = null;

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
            mesConList: [],
            messageList: [],
            TextareaValue: ''
        };
    }

    componentWillMount() {
        Toast.loading('正在读取', 0);
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var fromId = searchArray[0].split('=')[1];
        var toId = searchArray[1].split('=')[1];
        var choosePos = searchArray[2].split('=')[1];
        var unionid = searchArray[3].split('=')[1];
        var colPasswd = searchArray[4].split('=')[1];
        var toName = searchArray[5].split('=')[1];
        this.setState({fromId, toId})

        document.title = toName;   //设置title

        /**
         * 根据unionid获取绑定的小蚂蚁用户信息
         * @type {{method: string, openId: (string|string)}}
         */
        var param = {
            "method": 'getUsersByOpenId',
            "openId": unionid,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {
                    if (choosePos == 'te') {
                        chatDetil.setState({loginUser: result.response[0]})
                    } else {
                        chatDetil.setState({loginUser: result.response[1]})
                    }
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });

        var pro = {
            "command": "messagerConnect",
            "data": {
                "machineType": "mobile-web",
                "userId": Number(fromId),
                "machine": WebServiceUtil.createUUID(),
                "password": colPasswd,
                "version": 0.1
            }
        };
        if (WebServiceUtil.isEmpty(ms)) {
            ms = new MsgConnection();
            ms.connect(pro);
        }
    }

    componentDidMount() {
        const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
        setTimeout(() => this.setState({
            height: hei,
            data: genData(),
        }), 0)

        this.getUser2UserMessages(false, true)
        this.msListener()
    }

    msListener() {
        ms.msgWsListener = {
            onError: function (errorMsg) {
                console.log(errorMsg);
            }, onWarn: function (warnMsg) {
                console.log(warnMsg);
            }, onMessage: function (info) {
                chatDetil.onMessageListener(info)
            }
        }
    }

    onMessageListener(info) {
        var command = info.command;

        if (command == "message") {

            var data = info.data;
            if (data.message.command == "biu_message") {

            } else if (data.message.command == "message") {
                if (data.message.fromUser.colUid !== chatDetil.state.fromId && data.message.showType == 0) {
                    //收到普通消息
                    // console.log('收到消息', info)
                } else {
                    //普通消息是我发出的
                    // console.log('发出消息', info)
                }
            } else if (data.message.command == "retractMessage") {

            } else if (data.message.command == "message_read") {
                //消息已读之后来自蚂蚁君的message_read,没用直接return
                return false
            } else if (data.message.command == "dissolutionChatGroup") {
                //组织架构删除子部门后来自群通知着的消息
                return false
            } else if (data.message.command == "COMMAND_DELETE_RECORD_MESSAGE") {
                //删除消息的commend,没用直接return
                return false
            } else if (data.message.command == "COMMAND_DELETE_RECENT_MESSAGE") {
                return false
            }


            var mesArr = [];
            var messageOfSinge = data.message;
            var fromUser = messageOfSinge.fromUser;
            var colUtype = fromUser.colUtype;
            // var loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
            var content = messageOfSinge.content;

            var isSend = false;

            // if (colUtype == 'SGZH_WEB' && loginUser.colUid == 119665) {
            //     content = JSON.parse(messageOfSinge.content).messageTip;
            //     var flowTypeObj = JSON.parse(messageOfSinge.content);
            //     delete flowTypeObj.messageTip;
            //     antGroup.setState({FlowType: flowTypeObj});
            // }

            // var uuidsArray = [];
            var uuid = messageOfSinge.uuid;
            var toId = messageOfSinge.toId;

            if (WebServiceUtil.isEmpty(messageOfSinge.toUser) == false) {
                var toName = messageOfSinge.toUser.userName;
            }
            var showType = messageOfSinge.showType;  //showType为0正常显示 1通知形式
            var readState = messageOfSinge.readState;  //0为未读，1为已读
            // //判断是否是叮消息
            //判断这条消息是我发出的，处理别的手机发送消息不同步的问题
            if (messageOfSinge.fromUser.colUid == chatDetil.state.fromId) {
                isSend = true;
            }

            var biumes = null;
            if (messageOfSinge.command == 'message') {
                biumes = false;
            }
            if (messageOfSinge.command == 'biu_message') {
                biumes = true;
            }

            //附件，图片路径或者音频路径
            if (WebServiceUtil.isEmpty(messageOfSinge.attachment) == false) {
                var attachment = messageOfSinge.attachment.address;
                var attachmentType = messageOfSinge.attachment.type;
            }
            //动态表情
            if (WebServiceUtil.isEmpty(messageOfSinge.expressionItem) == false) {
                var expressionItem = messageOfSinge.expressionItem.address;
            }
            //文件
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

            // uuidsArray.push(uuid);
            // var isExist = antGroup.checkSameMessageIsExist(uuid);
            // if (isExist) {
            //     return;
            // } else {
            //     receiveMessageArray.push(uuid);
            // }

            // if (uuidsArray.length != 0) {
            //     var receivedCommand = {
            //         "command": "messageRecievedResponse",
            //         "data": {"uuids": uuidsArray}
            //     };
            //     ms.send(receivedCommand);
            // }

            // var isCurrentDay = isToday(messageOfSinge.createTime);
            // var createTime;
            // var mesTime;
            // if (isCurrentDay) {
            //     //如果是当天的消息，只显示时间
            //     createTime = formatHM(messageOfSinge.createTime);
            //     mesTime = formatHM(messageOfSinge.createTime);
            // } else {
            //     //非当天时间，显示的是月-日
            //     createTime = formatMD(messageOfSinge.createTime);
            //     mesTime = formatMD(messageOfSinge.createTime) + ' ' + formatHM(messageOfSinge.createTime);
            // }

            // var contentJson = {"content": content};
            // var contentArray = [contentJson];

            if (messageOfSinge.toType == 1 && typeof (content) != 'undefined' && messageOfSinge.command != "retractMessage") {
                //个人单条消息
                // imgTagArray.splice(0);
                var imgTagArrayReturn = [];
                var messageReturnJson = chatDetil.getImgTag(messageOfSinge);
                if (WebServiceUtil.isEmpty(messageReturnJson) == false && WebServiceUtil.isEmpty(messageReturnJson.messageType) == false) {
                    if (messageReturnJson.messageType == "text") {
                        content = messageReturnJson.textMessage;
                    } else if (messageReturnJson.messageType == "imgTag") {
                        imgTagArrayReturn = messageReturnJson.imgMessage;
                    }
                }

                if (isSend == false) {
                    //收到的
                    if (data.message.command != "message_read" && data.message.command != "biu_message") {
                        if (chatDetil.state.toId == data.message.fromUser.colUid) {
                            //处理在停留在别人聊天窗口时另一人新消息会显示的问题，其中chatDetil.state.toId是点击的那个人的信息，
                            //data.message.fromUser是新消息来的那个人的信息
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
                                "mesTimeForDetil": messageOfSinge.createTime,
                            };
                            mesArr.push(messageShow);
                        }
                    }
                } else {
                    //我发出的
                    if (WebServiceUtil.isEmpty(messageOfSinge.toUser) == false) {
                        if (data.message.command != "message_read") {
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
                                "uuid": uuid,
                                "showType": showType,
                                "readState": readState,
                                "readStateStr": '未读',
                                "mesTimeForDetil": messageOfSinge.createTime,
                                "toId": toId,
                                "toName": toName,
                            };
                            //如果发送的消息=当前点击人的id，才push
                            if (messageOfSinge.toUser.colUid == chatDetil.state.toId) {
                                mesArr.push(messageShow);
                            }

                        }
                    }
                }
            }
            this.setState({messageList: mesArr.concat(this.state.messageList)})
            if (data.message.toId == this.state.toId) {
                //我发出的,拉到最底
                this.buildChatsContent(true)
            } else {
                this.buildChatsContent(true)
                // this.buildChatsContent('nothing')
            }
        }

    }

    getUser2UserMessages(timeNode, posFlag) {
        var _this = this;
        var timeNode = timeNode || (new Date()).valueOf()
        var param = {
            "method": 'getUser2UserMessages',
            "user1Id": this.state.fromId,
            "user2Id": this.state.toId,
            "timeNode": timeNode
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {
                    _this.buildChatObj(result.response, posFlag)
                    _this.setState({refreshing: false});
                    Toast.hide()
                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    buildChatObj(data, posFlag) {
        var _this = this;
        if (WebServiceUtil.isEmpty(data) == false) {

            var i = 0;
            var arr = [];
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
                        arr.push(messageShow);
                    }
                }

            })
            this.setState({messageList: this.state.messageList.concat(arr)})
            this.buildChatsContent(posFlag)
        }
    }

    /**
     * 判断来的消息是什么消息
     * @param messageOfSingle
     * @returns {{}}
     */
    getImgTag(messageOfSingle) {
        var messageReturnJson;
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

    /**
     * 根据messageList渲染聊天内容列表
     * 收发消息后将新内容push到数组中再调用这个函数
     */
    buildChatsContent(posFlag) {
        var arr = this.state.messageList
        var array = []
        if (WebServiceUtil.isEmpty(arr) == false) {
            arr.forEach(function (v, i) {
                if (v.fromUser.colUid == chatDetil.state.fromId) {
                    //我发出的
                    if (WebServiceUtil.isEmpty(v.attachment) == false) {
                        //有内容的链接

                    } else if (WebServiceUtil.isEmpty(v.expressionItem) == false) {
                        //来自安卓的动态表情（安卓的动态表情的content里有“表情”两个字）

                    } else if (WebServiceUtil.isEmpty(v.fileName) == false) {
                        //发送的文件（content里带有文件名字）

                    } else {
                        //文字消息
                        if (v.biumes == true) {

                        } else {
                            //普通文字消息
                            var contentItem = <li className="message me">
                                <img className='userAvatar' src={v.fromUser.avatar}/>
                                <div className="content">
                                    <div className="bubble bubble_primary right">
                                        <div className="bubble_cont">
                                            <div className="plain">
                                                <pre>{v.content}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        }
                    }
                } else {
                    //我收到的
                    if (WebServiceUtil.isEmpty(v.attachment) == false) {
                        //有内容的链接

                    } else if (WebServiceUtil.isEmpty(v.expressionItem) == false) {
                        //来自安卓的动态表情（安卓的动态表情的content里有“表情”两个字）

                    } else if (WebServiceUtil.isEmpty(v.fileName) == false) {
                        //发送的文件（content里带有文件名字）

                    } else {
                        //文字消息
                        if (v.biumes == true) {

                        } else {
                            //普通文字消息
                            var contentItem = <li className="message">
                                <img className='userAvatar' src={v.fromUser.avatar}/>
                                <div className="bubble bubble_default left">
                                    <div className="bubble_cont">
                                        <div className="plain">
                                            <pre>{v.content}</pre>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        }
                    }
                }
                array.unshift(contentItem);
            })
        }
        this.setState({mesConList: array})


        if (posFlag != 'nothing') {
            if (posFlag) {
                //滚动到底
                this.goToBottom()
            } else {
                //滚动到中间位置
                this.goToRememberPos()
            }
        }
    }

    /**
     * 回到底部
     */
    goToBottom() {
        $('#pullContent')[0].scrollTop = $('#pullContent')[0].scrollHeight - (this.state.height - 66)
        scrollNum = $('#pullContent')[0].scrollHeight
    }

    /**
     * 回到记忆位置
     */
    goToRememberPos() {
        $('#pullContent')[0].scrollTop = $('#pullContent')[0].scrollHeight - scrollNum
        scrollNum = $('#pullContent')[0].scrollHeight
    }

    pullToFresh() {
        this.setState({refreshing: true});
        this.getUser2UserMessages(this.state.firstMessageCreateTime, false)
    }

    sendMessage() {
        if (chatDetil.state.TextareaValue.trim() == '') {
            Toast.fail('请输入内容发送', 1)
            return
        }

        chatDetil.setState({TextareaValue: ''})
        var fromUser = chatDetil.state.loginUser
        var uuid = WebServiceUtil.createUUID();
        var createTime = (new Date()).valueOf();
        var messageJson = {
            'content': chatDetil.state.TextareaValue, "createTime": createTime, 'fromUser': fromUser,
            "toId": chatDetil.state.toId, "command": "message", "hostId": chatDetil.state.fromId,
            "uuid": uuid, "toType": 1
        };

        var commandJson = {"command": "message", "data": {"message": messageJson}};

        ms.send(commandJson);
    }

    TextareaOnKeyUp(e) {
        if (e.keyCode == 13) {

            if (chatDetil.state.TextareaValue.trim() == '') {
                Toast.fail('请输入内容发送', 1)
                return
            }

            chatDetil.setState({TextareaValue: ''})
            var fromUser = chatDetil.state.loginUser
            var uuid = WebServiceUtil.createUUID();
            var createTime = (new Date()).valueOf();
            var messageJson = {
                'content': chatDetil.state.TextareaValue, "createTime": createTime, 'fromUser': fromUser,
                "toId": chatDetil.state.toId, "command": "message", "hostId": chatDetil.state.fromId,
                "uuid": uuid, "toType": 1
            };

            var commandJson = {"command": "message", "data": {"message": messageJson}};

            ms.send(commandJson);
        }
    }

    TextareaOnKeyChange(value) {
        chatDetil.setState({TextareaValue: value})
    }

    TextareaOnFocus() {
        $('#pullContent')[0].scrollTop = $('#pullContent')[0].scrollHeight - (chatDetil.state.height - 66)
    }

    render() {

        return (<div id='chatDetil'>
            <PullToRefresh
                id='pullContent'
                damping={60}   //拉动距离限制, 建议小于 200
                ref={el => this.ptr = el}
                style={{
                    height: this.state.height - 66,
                    overflow: 'auto',
                }}
                direction='down'
                refreshing={this.state.refreshing}  //是否显示刷新状态
                onRefresh={() => {
                    this.pullToFresh()
                }}
            >
                <div className="messageWrap">{this.state.mesConList}</div>
            </PullToRefresh>

            <List className="input_message lineTop_public"
                  style={{
                      position: 'absolute',
                      bottom: '0px',
                      width: document.body.clientWidth - 24
                  }}>
                <TextareaItem
                    value={this.state.TextareaValue}
                    autoHeight
                    labelNumber={3}
                    // onKeyUp={this.TextareaOnKeyUp}
                    onChange={this.TextareaOnKeyChange}
                    count={60}
                    onFocus={this.TextareaOnFocus}
                />

                <button className="submit" onClick={this.sendMessage}>发送</button>
            </List>
        </div>);
    }
}

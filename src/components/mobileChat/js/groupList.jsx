import React from 'react';
import {ListView, Toast, List} from 'antd-mobile';
import '../css/groupList.less'

var group_List;
const {Item} = List;

export default class groupChatList extends React.Component {

    constructor(props) {
        super(props);
        group_List = this;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.initData = [];

        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            userId: '',
            unionid: '',        //微信登录的unionid
        };
    }

    componentWillMount() {
        document.title = "我的群组";   //设置title

        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var userId = searchArray[0].split('=')[1];
        var colPasswd = searchArray[1].split('=')[1];
        var unionid = searchArray[2].split('=')[1];

        this.setState({userId, colPasswd, unionid});
    }

    componentDidMount() {
        this.getUserChatGroup()
    }

    getUserChatGroup() {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getUserChatGroup',
            "userId": this.state.userId,
            "pageNo": -1
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: function (result) {
                if (result.success == true && result.msg == '调用成功') {

                    let response = result.response

                    for (let i = 0; i < response.length; i++) {
                        var topic = response[i];
                        dataBlob[`${i}`] = topic;
                    }
                    _this.initData = _this.initData.concat(response);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                    })

                } else {
                    Toast.fail(result.msg, 3);
                }
            },
            onError: function (error) {
                // message.error(error);
            }
        });
    }

    itemOnClick(rowData) {
        return () => {

            var colPasswd = this.state.colPasswd

            window.location.href = encodeURI(WebServiceUtil.mobileServiceURL + 'chatDetil?fromId=' + this.state.userId + '&toId=' + rowData.chatGroupId + '&choosePos=te&unionid=' + this.state.unionid + '&colPasswd=' + colPasswd + '&toName=' + rowData.name + '&mesType=1')
        }
    }

    render() {

        var _this = this;

        const row = (rowData, sectionID, rowID) => {

            var groupMemebersPhoto = [];
            var currentMemberArray = rowData.avatar.split('#');
            for (var i = 0; i < currentMemberArray.length; i++) {
                var member = currentMemberArray[i];
                var memberAvatarTag = <img src={member}></img>;
                groupMemebersPhoto.push(memberAvatarTag);
                if (i >= 3) {
                    break;
                }
            }

            var imgTag = <div className="maaee_group_face">{groupMemebersPhoto}</div>;
            switch (groupMemebersPhoto.length) {
                case 1:
                    imgTag = <div className="maaee_group_face1">{groupMemebersPhoto}</div>;
                    break;
                case 2:
                    imgTag = <div className="maaee_group_face2">{groupMemebersPhoto}</div>;
                    break;
                case 3:
                    imgTag = <div className="maaee_group_face3">{groupMemebersPhoto}</div>;
                    break;
                case 4:
                    imgTag = <div className="maaee_group_face">{groupMemebersPhoto}</div>;
                    break;
            }

            return (
                <Item onClick={this.itemOnClick(rowData)}>
                    {imgTag}
                    <div className="group_userCont">
                        <div className="group_user">
                            <span className="text_hidden group_name">{rowData.name}</span><br /><span className="text_hidden group_name2"><span>群主：</span>{rowData.owner.userName}</span>
                        </div>
                        <span className="group_number">{rowData.members.length}人</span>
                    </div>
                </Item>
            )
        }

        return (
            <div id="groupChatList">
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                        className="am-list"
                        pageSize={30}    //每次事件循环（每帧）渲染的行数
                        scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
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

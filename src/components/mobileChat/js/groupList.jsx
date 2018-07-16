import React from 'react';
import {} from 'antd-mobile';
import '../css/groupList.less'

var group_List;

export default class groupChatList extends React.Component {

    constructor(props) {
        super(props);
        group_List = this;
        this.state = {};
    }

    componentWillMount() {
        document.title = "小蚂蚁直播";   //设置title
    }

    componentDidMount() {

    }

    render() {

        var _this = this;

        return (
            <div id="groupChatList">
                groupChatList
            </div>
        );
    }
}

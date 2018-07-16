import React from 'react';
import {} from 'antd-mobile';
import '../css/friendList.less'

var friend_List;

export default class friendList extends React.Component {

    constructor(props) {
        super(props);
        friend_List = this;
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
            <div id="friendList">
                12
            </div>
        );
    }
}

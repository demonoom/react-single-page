import React from 'react';
import {} from 'antd-mobile';
import '../css/searchFromOrigination.less'

var search_FromOrigination;

export default class searchFromOrigination extends React.Component {

    constructor(props) {
        super(props);
        search_FromOrigination = this;
        this.state = {};
    }

    componentWillMount() {
        document.title = "小蚂蚁聊天";   //设置title
    }

    componentDidMount() {

    }

    render() {

        var _this = this;

        return (
            <div id="searchFromOrigination">
                324
            </div>
        );
    }
}

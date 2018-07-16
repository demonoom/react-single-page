import React from 'react';
import {} from 'antd-mobile';
import '../css/classList.less'

var class_List;

export default class classList extends React.Component {

    constructor(props) {
        super(props);
        class_List = this;
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
            <div id="classList">
                classList
            </div>
        );
    }
}

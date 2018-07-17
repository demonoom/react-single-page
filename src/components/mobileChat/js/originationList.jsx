import React from 'react';
import {} from 'antd-mobile';
import '../css/originationList.less'

var origination_List;

export default class originationList extends React.Component {

    constructor(props) {
        super(props);
        origination_List = this;
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
            <div id="originationList">
                originationList
            </div>
        );
    }
}

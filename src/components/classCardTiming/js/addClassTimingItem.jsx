import React from 'react';
import {

} from 'antd-mobile';


var classBinding;

export default class addClassTimingItem extends React.Component {

    constructor(props) {
        super(props);
        classBinding = this;
        this.state = {

        };
    }

    componentDidMount() {
        Bridge.setShareAble("false");
        document.title = '班牌定时';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        // var uid = locationSearch.split("&")[0].split("=")[1];
    }

    render() {
        return (
            <div id="addClassTimingItem">
                1234
            </div>
        );
    }
}

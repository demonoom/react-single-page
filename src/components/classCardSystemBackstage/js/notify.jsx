import React from 'react';
import {} from 'antd-mobile';
import '../css/notify.less'

var demeanor;

export default class notifyBack extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <div id="notify" style={{height: document.body.clientHeight}}>
                通知lidong
            </div>
        );
    }
}

import React from 'react';
import {Toast} from 'antd-mobile';

var demeanor;

export default class course extends React.Component {

    constructor(props) {
        super(props);
        demeanor = this;
        this.state = {};
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.messageUtilObj.command == 'brand_class_open') {
            console.log('开课')
            console.log(nextProps.messageUtilObj.command.data);
        } else if (nextProps.messageUtilObj.command == 'brand_class_close') {
            console.log('下课')
            console.log(nextProps.messageUtilObj.command.data);
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div id="course">
                课程安排
            </div>
        );
    }
}

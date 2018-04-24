import React from 'react';
import '../css/personalSettings.less'

export default class personalSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    render() {

        return (
            <div id="personalSettings" style={{height: document.body.clientHeight}}>
                personalSettings
            </div>
        );
    }
}

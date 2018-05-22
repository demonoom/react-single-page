import React from 'react';
import {} from 'antd-mobile';

var demeanor;

export default class application extends React.Component {

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
            <div id="application"  className="application_height home_card">
                <h3 className="home_title">应用</h3>
                <div className="application_cont">
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                    <li className="app_list"><div className="app_list_img"></div><div className="app_list_text text_hidden">班级课表</div></li>
                </div>
            </div>
        );
    }
}

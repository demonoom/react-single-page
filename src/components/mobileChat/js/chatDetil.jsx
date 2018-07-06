import React from 'react';
import '../css/contactsList.less'

var chatDetil;

export default class chat_Detil extends React.Component {

    constructor(props) {
        super(props);

        chatDetil = this;
        this.state = {};
    }

    componentWillMount() {
        document.title = "小蚂蚁聊天窗口";   //设置title
    }

    componentDidMount() {

    }


    render() {
        return (
            <div id='chatDetil'>
                12345
            </div>
        );
    }
}

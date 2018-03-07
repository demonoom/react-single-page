import React from 'react';
import {Modal, Button, WingBlank, WhiteSpace, Toast} from 'antd-mobile';

const alert = Modal.alert;

const showAlert = () => {
    const alertInstance = alert('删除', '您确定要删除该文件吗?', [
        {text: 'Cancel', onPress: () => console.log('cancel'), style: 'default'},
        {text: 'OK', onPress: () => console.log('ok')},
    ]);
    // setTimeout(() => {
    //     // 可以调用close方法以在外部close
    //     console.log('auto close');
    //     alertInstance.close();
    // }, 500000);
};

export default class Stage5 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {

        return (
            <div>
                <Button onClick={showAlert}>customized buttons</Button>
            </div>
        );
    }
}

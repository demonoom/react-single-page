import React from 'react';
import {Toast, WhiteSpace, WingBlank, Button} from 'antd-mobile';

export default class Demo extends React.Component {
    componentDidMount() {

    }

    showToast() {
        Toast.info('This is a toast tips !!!', 1);
    }

    // showToastNoMask() {
    //     Toast.info('Toast without mask !!!', 2, null, false);
    // }
    //
    // successToast() {
    //     Toast.success('Load success !!!', 1);
    // }
    //
    failToast() {
        Toast.fail('Load failed !!!', 1);
    }

    //
    // offline() {
    //     Toast.offline('Network connection failed !!!', 1);
    // }
    //
    // loadingToast() {
    //     Toast.loading('Loading...', 1, () => {
    //         console.log('Load complete !!!');
    //     });
    // }

    render() {
        return (
            <WingBlank>
                <WhiteSpace/>
                <Button onClick={this.showToast}>text only</Button>
                <WhiteSpace/>
                {/*<Button onClick={this.showToastNoMask}>without mask</Button>*/}
                {/*<WhiteSpace/>*/}
                {/*<Button onClick={() => Toast.info(customIcon(), 1)}>*/}
                {/*cumstom icon*/}
                {/*</Button>*/}
                {/*<WhiteSpace/>*/}
                {/*<Button onClick={this.successToast}>success</Button>*/}
                {/*<WhiteSpace/>*/}
                <Button onClick={this.failToast}>fail</Button>
                {/*<WhiteSpace/>*/}
                {/*<Button onClick={this.offline}>network failure</Button>*/}
                {/*<WhiteSpace/>*/}
                {/*<Button onClick={this.loadingToast}>loading</Button>*/}
                {/*<WhiteSpace/>*/}
            </WingBlank>
        );
    }
}

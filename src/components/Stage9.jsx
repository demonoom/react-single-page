import React from 'react';
import {ActivityIndicator, WingBlank, WhiteSpace, Button} from 'antd-mobile';

export default class Demo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animating: false,
        };
    }

    componentWillUnmount() {
        clearTimeout(this.closeTimer);
    }

    showToast = () => {
        this.setState({animating: !this.state.animating});
        this.closeTimer = setTimeout(() => {
            this.setState({animating: !this.state.animating});
        }, 3000);
    }

    render() {

        return (
            <div>
                <WingBlank>
                    <div className="toast-container">
                        <WhiteSpace size="xl"/>
                        <Button onClick={this.showToast}>click to show Toast</Button>
                        <div className="toast-example">
                            <ActivityIndicator
                                toast
                                text="正在加载..."
                                animating={this.state.animating}
                            />
                        </div>
                    </div>
                </WingBlank>
            </div>
        )
    }
}

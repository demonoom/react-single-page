import React from 'react';
import {Popover, NavBar, Icon} from 'antd-mobile';

const Item = Popover.Item;

const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs"
                          alt=""/>;

export default class Stage5 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            selected: '',
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    onSelect = (opt) => {
        // console.log(opt.props.value);
        this.setState({
            visible: false,
            selected: opt.props.value,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({
            visible,
        });
    };

    render() {

        return (
            <div>
                <Popover mask
                         placement="bottomLeft"
                         overlayClassName="fortest"
                         overlayStyle={{color: 'currentColor'}}
                         visible={this.state.visible}
                         overlay={[
                             (<Item key="4" value="scan" icon={myImg('tOtXhkIWzwotgGSeptou')} data-seed="logId">单选题</Item>),
                             (<Item key="5" value="special" icon={myImg('PKAgAqZWJVNwKsAJSmXd')}
                                    style={{whiteSpace: 'nowrap'}}>简答题</Item>),
                             (<Item key="6" value="button ct" icon={myImg('uQIYTFeRrjPELImDRrPt')}>
                                 <span style={{marginRight: 5}}>判断题</span>
                             </Item>),
                             (<Item key="7" value="button ct" icon={myImg('uQIYTFeRrjPELImDRrPt')}>
                                 <span style={{marginRight: 5}}>多选题</span>
                             </Item>),
                         ]}
                         align={{
                             overflow: {adjustY: 0, adjustX: 0},
                             offset: [-10, 0],
                         }}
                         onVisibleChange={this.handleVisibleChange}
                         onSelect={this.onSelect}
                >
                    <div style={{
                        height: '100%',
                        padding: '0 15px',
                        marginRight: '-15px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    >
                        <span>上传</span>
                    </div>
                </Popover>
            </div>
        );
    }
}

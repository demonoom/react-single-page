import React from 'react';

export default class previewFile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
        };
    }

    componentDidMount() {
        document.title = '文件预览';
        var previewFile = JSON.parse(localStorage.getItem('previewFile'));
        if(WebServiceUtil.isEmpty(previewFile)==false) {
            if (previewFile.type == '1' || previewFile.type == '31') {
                //PDF||DOC
                var iframeSrc = "http://www.maaee.com/Excoord_For_Education/js/pdfjs/web/viewer.html?file=" + previewFile.src;
                var content = <iframe src={iframeSrc} frameborder="0"></iframe>;
                this.setState({content})

            } else if (previewFile.type == '9') {
                //AUDIO
                var content = <audio src={previewFile.src} controls='controls'></audio>
                this.setState({content})
            } else if (previewFile.type == '7') {
                //VIDEO
                var content = <video src={previewFile.src} controls='controls'></video>
                this.setState({content})
            } else {
                var iframeSrc = previewFile.src;
                var content = <iframe src={iframeSrc} frameborder="0"></iframe>;
                this.setState({content})
            }
        }
    }

    render() {

        return (
            <div id="previewFile" style={{height: document.body.clientHeight}}>
                {this.state.content}
            </div>
        );
    }
}

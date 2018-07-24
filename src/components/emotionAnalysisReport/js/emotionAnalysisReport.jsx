import React from "react";

var calm;
export default class emotionAnalysisReport extends React.Component {
    constructor(props){
        super(props);
        calm = this;
        this.state = {
            faceEmotionData:{}
        }
    }
    componentDidMount(){
        this.getFaceEmotionVclassHistoryAnalysis()
    }

    /**
     * 表情分析
     * autonomousLearn----自主学习度
     * avgUnderstand---课堂平均理解度
     * classJoy---课堂愉悦度
     * effectiveTeaching---有效教学实践
     * guidedLearning---引导性学习
     * heavyDifficultPoints---重难点分配度
     * highUnderstand---高效理解比例
     * learnDiversify---教学方式多样性
     */
    getFaceEmotionVclassHistoryAnalysis(){
       
        var param = {
            "method": 'getFaceEmotionVclassHistoryAnalysis',
            "vid":"1111",
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result,"result")
                if (result.msg == '调用成功' || result.success) {
                    // _this.setState({
                    //     faceEmotionData:result.response
                    // })
                }
            },
            onError: function (error) {
                Toast.info('获取列表失败', error);
            }
        });
    }
    
    render(){
        
        console.log(calm.faceEmotionData)
        return(
            <div>
                <span>课堂平均理解度<span>{calm.faceEmotionData.avgUnderstand}</span></span>
                <span>高效理解比例<span>{calm.faceEmotionData.highUnderstand}</span></span>
                <span>教学方式多样性<span>{calm.faceEmotionData.learnDiversify}</span></span>
                <span>有效教学时间<span>{calm.faceEmotionData.effectiveTeaching}</span></span>
                <span>重难点分配度<span>{_this.faceEmotionData.heavyDifficultPoints}</span></span>
                <span>引导性学习<span>{_this.faceEmotionData.guidedLearning}</span></span>
                <span>课堂愉悦度<span>{_this.faceEmotionData.classJoy}</span></span>
                <span>自主学习度<span>{_this.faceEmotionData.autonomousLearn}</span></span>
            </div>
        )
    }
}
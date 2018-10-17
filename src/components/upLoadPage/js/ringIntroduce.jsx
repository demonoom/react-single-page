import React from 'react';
import { } from 'antd-mobile';
import '../css/ringIntroduce.less'
export default class ringIntroduce extends React.Component {
    render() {
        return (<div id='ringIntroduce'>
            <div className='title'>
                智慧手环简介
            </div>
            <div className="at">
                <div className="author"> 恒坐标集团</div>
                {/*<div className="createTime">2018-10-16</div>*/}
            </div>
            <div className="content">
                恒坐标教育科技集团立足教育信息化工作实际，充分利用自主开发的“小蚂蚁智慧校园”技术，探索基于大数据模式下教育管理与教育教学实现方式，逐步实现校园环境的全面感知、校园管理高效协同、校园安全实时监控的教学管理生态链，形成完整统一、技术先进、覆盖全面、应用深入、高效稳定、安全可靠的智慧校园体系。
                <img src={require("../img/wristband02.jpg")} />站在学校发展的总体高度，基于可穿戴智能手环为应用核心，结合智慧校园智慧环境，打造校园教学、教务、管理、生活全部数据互通的校园生态链，教师、学生、家长间的数据流和任务流无缝对接，完成学校跨部门、跨空间的教学和管理，以及物联校园和安全校园建设，达到降低学校的管理、教学、安全的投资成本，并获得最佳的使用效果。
                <img src={require("../img/wristband01.jpg")} />小蚂蚁“一校通”智慧校园平台由安全校园、互动校园、健康校园、物联校园、智慧校园管理五大部分组成。
                <img src={require("../img/wristband03.jpg")} />基于大数据，利用最新的云计算、物联网技术，通过系统分析手环采集的运动、健康和学习数据为学校提供整体解决方案，有效解决学生安全、健康等监控预警的问题，从而提升学校教学和管理的效率。小蚂蚁智慧校园系统依用户不同，分为学生、教师、家长及学校管理员四种角色。拥有平台账号的教师、学生、家长及学校管理员就可以在平台各个应用系统中实现统一登录，结合用户权限管理子系统，从而实现所有应用系统的无缝访问。
            </div>
        </div>);
    }
}

import App from '../components/App';
import Util from './util';

const routeConfig = [{
    path: '/',
    component: App,
    onEnter: function(nextState, replaceState) {
        console.log('onEnter', nextState)
        let pathName = nextState.location.pathname.replace(/^\//,'')
        console.log("pathName",pathName);
        if (Util.needLogin() && pathName.indexOf('login') == -1) {
            replaceState(`login/unlock/${pathName}`)
        } else if (pathName == '') {
            replaceState(`welcome`)
        }
    },
    childRoutes: [
        {
            path: 's1',
            getComponents(location, callback) {
                require.ensure([], function(require) {
                    callback(null, require('../components/Stage1').default)
                })
            }
        },
        {
            path: 's2',
            getComponents(location, callback) {
                require.ensure([], function(require) {
                    callback(null, require('../components/Stage2').default)
                })
            }
        },
        {
            path: 's3',
            getComponents(location, callback) {
                require.ensure([], function(require) {
                    callback(null, require('../components/Stage3').default)
                })
            }
        },{
            path: 'welcome',
            getComponents(location, callback) {
                require.ensure([], function(require) {
                    callback(null, require('../components/Welcome').default)
                })
            }
        },
        {
            path: '*',
            onEnter: function(nextState, replaceState) {
                replaceState(`s1`)
            }
        }
    ]
}]

export default routeConfig
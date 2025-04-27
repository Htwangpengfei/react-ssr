import {routerList} from 'web/router'
import {matchPath} from 'react-router-dom'

export function findRoute(path) {
    return routerList.find(item => matchPath(path, item))
}
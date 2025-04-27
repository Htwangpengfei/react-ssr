import {Index} from '../pages/Index';
import { About } from '../pages/About';
import { fetch as IndexFetch } from '../pages/Index/fetch';
import { fetch as AboutFetch } from '../pages/About/fetch';

export const routerList = [
    {
        path: '/',
        component: Index,
        exact: true,
        fetch: IndexFetch
    },
    {
        path: '/about',
        component: About,
        fetch: AboutFetch
    }
]
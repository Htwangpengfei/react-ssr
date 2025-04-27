import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {routerList} from './router';
import {WrapperComponent} from './wrapper'

export const Index = () => {
    return (
        <Switch>
            {
                routerList.map(Item => {
                    const NewComponent = WrapperComponent(Item.component);
                    return (
                        <Route key={Item.path} path={Item.path} exact={Item.exact} render={(props) => <NewComponent {...props} fetch={Item.fetch} />}>
                        </Route>
                    )
                })
            }
        </Switch>
    )
}
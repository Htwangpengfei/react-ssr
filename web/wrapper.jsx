import React from "react";
import {withRouter} from 'react-router-dom';

let hasRender = false;
export const WrapperComponent = (Component) => {
    return withRouter(class extends React.Component {
        constructor (props) {
            super(props);

            this.state = {
                staticContext: props.staticContext || {
                    initData: window && !hasRender && window.__INIT_STATE__
                }
            }
        }
        componentDidMount () {
            if (!hasRender) {
                hasRender = true;
            } else {
                this.props.fetch().then(res => {
                    console.log('fetch')
                    this.setState({
                        staticContext: {
                            initData: res
                        }
                    });
                })
            }
        }

        render () {
            return (
                <Component {...this.props} staticContext={this.state.staticContext}></Component>
            )
        }
    })
}
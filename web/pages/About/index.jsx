import React from 'react';
import {useHistory} from 'react-router-dom';
import './style.css'

export const About = (props) => {
    const history = useHistory();
    return (
        <div className='test-css2'>
            <button onClick={() => history.push('/')}>toIndex</button>
            <div>
                {props.staticContext.initData}
            </div>
        </div>
    )
}
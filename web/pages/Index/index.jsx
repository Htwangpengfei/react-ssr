import React from 'react';
import {useHistory} from 'react-router-dom';
import './style.css';

export const Index = (props) => {
    const history = useHistory();
    console.log(props)
    return (
        <div className='test-css'>
            <button onClick={() => history.push('/about')}>toAbout</button>
            <div>
                {props.staticContext.initData.name}
            </div>
        </div>
    )
}
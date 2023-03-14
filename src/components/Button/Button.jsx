import React, { Component } from "react";
import PropTypes from 'prop-types';
import style from './button.module.scss';

class Button extends Component {

    render() {
        return (
            <div className={style.container}>
                <button className={style.button} type="button" onClick={this.props.onClick}>Load more</button>
            </div>
        )
    }
}

export default Button;
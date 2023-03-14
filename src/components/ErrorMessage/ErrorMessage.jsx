import style from './errorMessage.module.scss'
import React, { Component } from "react";
import PropTypes from 'prop-types';

class ErrorMessage extends Component {
    render() {
        return (
            <div className={style.errorMessage}>
                <p>{this.props.message}</p>
            </div>
        )
    }
}

ErrorMessage.propTypes = {
    message: PropTypes.string,
}

export default ErrorMessage;
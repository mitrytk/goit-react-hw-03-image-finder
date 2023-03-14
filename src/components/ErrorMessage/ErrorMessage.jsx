import style from './errorMessage.module.scss'
import React, { Component } from "react";

class ErrorMessage extends Component {
    render() {
        return (
            <div className={style.errorMessage}>
                <p>{this.props.message}</p>
            </div>
        )
    }
}

export default ErrorMessage;
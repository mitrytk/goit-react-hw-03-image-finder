import React, { Component } from "react";
import PropTypes from 'prop-types';
import style from './searchbar.module.scss';

class Searchbar extends Component {
    state = {
        search: '',
    }

    handleChange = (e) => {
        this.setState({search: e.currentTarget.value})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.search.trim() === '') {
            alert('ты че, слово не ввел?');
            alert('я для кого старался?');
            alert('код пишу, а тебе даже лень ввести что-то сюда');
            alert('ой все');
            return
        }
        this.props.onSubmit(this.state.search);
        this.setState({search: ''})

    }

    render() {
        return (
            <header className={style.searchbar}>
                <form onSubmit={this.handleSubmit} className={style.form}>
                    <button type="submit" className={style.button}>
                    <span className={style.buttonLabel}>Search</span>
                    </button>

                    <input
                    className={style.input}
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search images and photos"
                    value={this.state.search}
                    onChange={this.handleChange}
                    />
                </form>
            </header>
        )
    }
}

export default Searchbar;
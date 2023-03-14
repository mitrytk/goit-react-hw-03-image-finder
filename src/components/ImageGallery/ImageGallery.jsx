import React, { Component } from "react";
import PropTypes from 'prop-types';
import style from './imageGallery.module.scss';

import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Loader from "components/Loader/Loader";
import Button from "components/Button/Button";
import ErrorMessage from "components/ErrorMessage/ErrorMessage";

class ImageGallery extends Component {
    state = {
        gallery: null,
        selected: '',
        status: 'idle',
        page: 1,
        loader: false,
    }

    componentDidUpdate(prevProps, prevState) {
        const { page } = this.state;
        
        if (prevProps.search !== this.props.search) {
            this.setState({
                status: 'pending',
                page: 1,
            }, () => this.handleAPI(1, true))
        }

        if (prevState.page !== page) {
            this.handleAPI(page, false);

            this.setState({loader: true});
        }
    }

    handleLoadMore = () => {
        this.setState(prevState => {
            return {page: prevState.page + 1}
        })
    }

    handleAPI = (page, isNewSearch) => {
        const KEY_API = '34362001-d5ec89d1d84675fe0e9033f4a';

        fetch(`https://pixabay.com/api/?q=${this.props.search}&page=${page}&key=${KEY_API}&image_type=photo&orientation=horizontal&per_page=12`)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }

                    return Promise.reject(new Error('Error'))
                })
                .then(data => {
                    if (data.total !== 0) {
                        return this.setState(prevState => {

                            if (!isNewSearch) {
                                return {
                                    gallery: [ ...prevState.gallery, ...data.hits],
                                    status: 'resolved'}
                            }

                            return {
                                gallery: [...data.hits],
                                status: 'resolved'}
                        });
                    }
                    return Promise.reject(new Error('Error'))
                })
                .catch(() => this.setState({status: 'rejected'}))
                .finally(() => this.setState({loader: false}))
    }

    render() {
        const { gallery } = this.state;

        
        if (this.state.status === 'idle') {
            return;
        }
        if (this.state.status === 'pending') {
            return (<Loader />)
        }
        if (this.state.status === 'rejected') {
            return (<ErrorMessage message={'Nothing found for your request :('}/>);
        }
        if (this.state.status === 'resolved') {
            return (
                <>
                    <ul className={style.gallery} onClick={this.props.onSelected} >
                        {gallery !== null  && gallery.map( ({ id, largeImageURL, tags }) => 
                        (<ImageGalleryItem key={id} url={largeImageURL} tags={tags} id={id} />))}
                    </ul>

                    {!this.state.loader
                        ? <Button onClick={this.handleLoadMore}/>
                        : (<Loader />)}
                </>);
        }
    }
}

ImageGallery.propTypes = {
    search: PropTypes.string,
    onSelected: PropTypes.func,
}
export default ImageGallery;
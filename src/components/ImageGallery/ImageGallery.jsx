import React, { Component } from "react";
import PropTypes from 'prop-types';
import style from './imageGallery.module.scss';

import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import Loader from "components/Loader/Loader";
import Button from "components/Button/Button";

class ImageGallery extends Component {
    state = {
        gallery: null,
        selected: '',
        status: 'idle',
        page: 1,
        loader: false,
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.search !== this.props.search) {
            this.setState({status: 'pending'})

            this.handleAPI(this.state.page);
        }

        if (prevState.page !== this.state.page) {
            this.handleAPI(this.state.page);

            this.setState({loader: true});
        }
    }

    handleLoadMore = () => {
        this.setState(prevState => {
            return {page: prevState.page + 1}
        })
    }

    handleAPI = (page) => {
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

                            if (prevState.gallery) {
                                return {
                                    gallery: [ ...prevState.gallery, ...data.hits],
                                    status: 'resolved'}
                            }

                            return {
                                gallery: [...data.hits],
                                status: 'resolved'}
                        });
                    }
                })
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
            return (<div>ошибка</div>)
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

export default ImageGallery;
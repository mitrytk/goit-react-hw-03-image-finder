import React, { Component } from "react";
import PropTypes from 'prop-types';
import style from './imageGalleryItem.module.scss';

class ImageGalleryItem extends Component {
    
    handleClick = () => {

    }

    render() {
        const { url,tags } = this.props;

        return (
            <li className={style.galleryItem} >
                <img src={url} alt={tags} />
            </li>
        )
    }
}

export default ImageGalleryItem;
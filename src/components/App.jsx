import React, { Component } from "react";

import galleryApi from '../services/gallery-api';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from "./ImageGallery/ImageGallery";
import Modal from "./Modal/Modal";
import ImageGalleryItem from "./ImageGallery/ImageGalleryItem/ImageGalleryItem";
import Loader from "./Loader/Loader";
import Button from "./Button/Button";
import ErrorMessage from "./ErrorMessage/ErrorMessage";

export class App extends Component {
  state = {
    search: '',
    selected: null,
    status: 'idle',
    page: 1,
    loader: false,
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { page, search } = this.state;
    
    if (prevState.search !== search) {
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

  onSubmitForm = (state) => {
    
    this.setState({search: state})
  }

  onSelected = (e) => {
    this.setState({selected: {url: e.target.src, alt: e.target.alt}})
  }

  closeModal = () => {
    this.setState({selected: null})
  }

  handleLoadMore = () => {
      this.setState(prevState => {
          return {page: prevState.page + 1}
      })
  }

  handleAPI = (page, isNewSearch) => {
      galleryApi
        .fetchGallery(page, this.state.search)
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
                  status: 'resolved',
                  showBtn: this.state.page < Math.ceil(data.total / 12),
                }
              }

              return {
                gallery: [...data.hits],
                status: 'resolved',
                showBtn: this.state.page < Math.ceil(data.total / 12),
              }
            });
          }
            return Promise.reject(new Error('Error'))
        })
        .catch(() => this.setState({status: 'rejected'}))
        .finally(() => this.setState({loader: false}))
  }

  render() {
    return (
      <>
        <Searchbar onSubmit={this.onSubmitForm} />

        {this.state.status === 'pending' && 
          <Loader />
        }

        {this.state.status === 'rejected' && 
          <ErrorMessage message={'Nothing found for your request :('}/>
        }

        {this.state.status === 'resolved' && 
          <>
            <ImageGallery onSelected={this.onSelected}>

              {this.state.gallery !== null  && this.state.gallery.map( 
                ({ id, largeImageURL, tags }) => <ImageGalleryItem key={id} url={largeImageURL} tags={tags} id={id} />)}

            </ImageGallery>

            {!this.state.loader
              ? <>{this.state.showBtn && <Button gallery={this.state.gallery} onClick={this.handleLoadMore}/>}</>
              : (<Loader />)}
          </>
        }

        {this.state.selected && (<Modal img={this.state.selected} closeModal={this.closeModal}/>)}
      </>
    );
  }
}


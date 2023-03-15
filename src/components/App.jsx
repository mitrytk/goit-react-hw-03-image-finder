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
    message: '',
    status: 'idle',
    gallery: [],
    selected: null,
    page: 1,
    loader: false,
    showBtn: false,
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { page, search } = this.state;
    
    if (prevState.search !== search || prevState.page !== page) {
       this.handleAPI(page)
    }

  }

  onSubmitForm = (state) => {
    if (!state) {
      return this.setState({
        status: 'rejected',
        message: 'string must not be empty'
      })
    }

    this.setState({
      search: state,
      status: 'pending',
      gallery: [],
      loader: true,
      page: 1,
      showBtn: false,
    })
  }

  onSelected = (e) => {
    
    if (e.target.src === undefined) {
      return;
    }
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

  handleAPI = (page) => {
      this.setState({loader: true})

      galleryApi
        .fetchGallery(page, this.state.search)
        .then(data => {
          if (data.total === 0) {
            return this.setState({
              status: 'rejected',
              message: 'Nothing found for your request :(',
            })
          }
            return this.setState(prevState => {
              return {
                gallery: [ ...prevState.gallery, ...data.hits],
                status: 'resolved',
                showBtn: this.state.page < Math.ceil(data.total / 12),
              }
            });
        })
        .catch(() => this.setState({
          status: 'rejected',
          message: 'Ooops... something went wrong :(',
        }))
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
          <ErrorMessage message={this.state.message}/>
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


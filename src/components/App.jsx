import React, { Component } from "react";

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from "./ImageGallery/ImageGallery";
import Modal from "./Modal/Modal";

export class App extends Component {
  state = {
    search: '',
    selected: null,
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

  render() {
    return (
      <>
        <Searchbar onSubmit={this.onSubmitForm} />
        <ImageGallery search={this.state.search} onSelected={this.onSelected} />
        {this.state.selected && (<Modal img={this.state.selected} closeModal={this.closeModal}/>)}
      </>
    );
  }
}


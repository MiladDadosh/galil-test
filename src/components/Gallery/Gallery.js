import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import ImageModal from '../ImageModal';
import Sortable from 'sortablejs';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      isLoading: false,
      paginate: {
        page: 1,
        perPage: 100,
        numOfPages: 1
      },
      imageModal: {
        show: false,
        image: null,
        currentIndex: 0,
        total: 0
      }
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag, paginate, append = false) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${paginate.perPage}&format=json&safe_search=1&nojsoncallback=1&page=${paginate.page}`;
    const baseUrl = 'https://api.flickr.com/';
    //enable loader
    this.setState({isLoading: true});

    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {

          //if append then add loaded images to previous image, else set new
          if(append) this.setState({images: this.state.images.concat(res.photos.photo)});
          else this.setState({images: res.photos.photo});

          //set pagination data
          this.setState({paginate: {
            page: res.photos.page,
            perPage: res.photos.perpage,
            numOfPages: res.photos.pages
          }});

          // get localstorage favorite images and assign for favorite
          this.getLocalStorage();
          // enable event listener for scroll and load more images
          document.addEventListener('scroll', this.trackScrolling);

          this.dnd();

          //stop loader
          this.setState({isLoading: false});
        }
      });
  }

  dnd() {
    let vm = this;
    let {images} = this.state;
    let el = document.querySelector('#scrl-gallery');
    var sortable = Sortable.create(el, {
      animation: 100,
      sort: true,
      // Element dragging ended
      onEnd: function (/**Event*/evt) {
          // re-ordering images based on dnd
          // const oldIndex = evt.oldIndex;
          // const newIndex = evt.newIndex;
          // const temp = images[oldIndex];
          // console.log(oldIndex)
          // console.log(newIndex)
          
          // if(oldIndex < newIndex) {
          //   for(let i= oldIndex; i<= newIndex; i++) {
          //     if(i == newIndex) {
          //       images[i] = temp;
          //     } else {
          //       images[i] = images[i+1];
          //     }
          //   }
          // }
          // else if(oldIndex > newIndex) {
          //   for(let i= oldIndex; i>= newIndex; i--) {
          //     if(i == newIndex) {
          //       images[i] = temp;
          //     } else {
          //       images[i] = images[i-1];
          //     }
          //   }
          // }
          // vm.setState({images});
      }
    });
  }

  componentDidMount() {
    const {paginate} = this.state;
    this.getImages(this.props.tag, paginate);
    this.setState({
      galleryWidth: document.body.clientWidth
    });

  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  componentWillReceiveProps(props) {
    const {paginate} = this.state;
    this.getImages(props.tag, paginate);
  }

  // track scroll, when reaches bottom of images wrapper + offset then make a request to load images
  trackScrolling = () => {
    const target = document.getElementById('scrl-gallery');
    const offset = 100;
    if (this.isBottom(target, offset)) {
      console.log('header bottom reached');
      let {paginate} = this.state;
      if(paginate.page < paginate.numOfPages) {
        document.removeEventListener('scroll', this.trackScrolling);
        paginate.page++;
        this.setState({ paginate });
        this.getImages(this.props.tag, paginate, true);
      }

    }
  }

  // is scrolling reached bottom + offset
  isBottom(el, offset) {
    return el.getBoundingClientRect().bottom <= window.innerHeight + offset;
  }

  // get localstorage favorite images and assign for favorite
  getLocalStorage() {
    let localStorage = window.localStorage.getItem('galil-favorite') || '[]';
    let localStorageArray = JSON.parse(localStorage);
    let {images} = this.state;

    if(localStorageArray.length) {
      images.map(img => {
        //assign isFavorite value
        img.isFavorite = false;
        let existImg = localStorageArray.find(eImg => eImg.id === img.id);
        if(existImg !== undefined) {
          img.isFavorite = true;
        }
      });

      this.setState({images});
    }
  }

  // set localstorage favorite images and assign for favorite
  setLocalStorage(img) {
    const localStorage = window.localStorage.getItem('galil-favorite') || '[]';
    let localStorageArray = JSON.parse(localStorage);
    const index = localStorageArray.findIndex((item) => item.id === img.id);
    if(index > -1) {
      localStorageArray.splice(index, 1);
    } else {
      localStorageArray.push({
        id: img.id,
        isFavorite: img.isFavorite,
        url: this.urlFromDto(img)
      });
    }

    window.localStorage.setItem('galil-favorite', JSON.stringify(localStorageArray))
    this.renderFavoriteView();
  }

  // render favorite sidebar component
  renderFavoriteView() {
    this.props.onRenderFavorite();
  }

  // duplicate image
  duplicate(cloned_dto) {
    const {images} = this.state;
    this.setState({ images:  [cloned_dto, ...images] });

    // scroll top gallery top
    const gallery = document.getElementById('scrl-gallery');
    gallery.scrollIntoView({ block: 'start',  behavior: 'smooth' });
  }

  // handle modal props and open / close or reset it
  handleModal(image, currentIndex, reset = false) {
    this.setState({
      imageModal: {
        show: reset ? false : true,
        total: this.state.images.length,
        currentIndex: (currentIndex + 1),
        image
      }
    });
  }

  // toggle image favorite view
  toggleFavorite() {
    let {images} = this.state;
    let {image} = Object.assign({}, this.state.imageModal);
    images = images.map(img => {
      if(img.id === image.id) {
        img.isFavorite = !img.isFavorite;
        image.isFavorite = img.isFavorite;
        this.setState({image});
        this.setLocalStorage(img);
      }
      return img;
    });
    this.setState({ images });
  }

  // navigate images (next, prev) image for modal
  navigateTo(dir) {
    const { images } = this.state;
    let { image } = this.state.imageModal;
    let currentIndex = images.findIndex(img => img.id === image.id);
    let nextIndex = currentIndex + (dir);
    
    // reverse loop, set last index to view
    if(nextIndex < 0) {
      nextIndex = images.length -1;
    }
    // last index reach, set index to start
    else if(nextIndex >= images.length) {
      nextIndex = 0;
    }

    const target = images[nextIndex];
    this.setState({
      imageModal: {
        show: true,
        image: {
          isFlipped: false,
          id: target.id,
          isFavorite: target.isFavorite,
          url: this.urlFromDto(target)
        },
        total: this.state.images.length,
        currentIndex: (nextIndex + 1)
      }
    });
  }

  // need parent to child call method ?
  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    return (
      <div>
        <div className="gallery-root" id="scrl-gallery">
          {this.state.images.map((dto,index) => {
            return <Image
                    key={'image-' + index}
                    dataIndex={index}
                    dto={dto}
                    galleryWidth={this.state.galleryWidth}
                    onDuplicate={ () => {this.duplicate(dto)} }
                    onToggleModal={ (image, index) => {this.handleModal(image, index)} }
                    />;
          })}
        </div>
        { this.state.isLoading ? <div className="loader-block">Loading...</div> : ''}
        { this.state.imageModal.show ? <ImageModal data={this.state.imageModal} onCloseModal={ () => { this.handleModal(null, 0, true) } } onToggleFavorite={ () => { this.toggleFavorite() } } onNavigateTo={ dir => { this.navigateTo(dir) } } /> : '' }
        </div>
    );
  }
}

export default Gallery;

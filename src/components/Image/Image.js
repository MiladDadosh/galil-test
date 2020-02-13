import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };


  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      image: {
        id: null,
        isFlipped: false,
        isFavorite: false,
        url: ''
      }
    };
  }

  // style data for image-root
  getRootStyle() {
    return {
      backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
      width: this.state.size + 'px',
      height: this.state.size + 'px',
      transform: this.state.image.isFlipped ? 'rotateY(180deg)' : ''
    };
  }

  // style data for overlay on image
  getOverlayStyle() {
    return {
      transform: this.state.image.isFlipped ? 'rotateY(180deg)' : ''
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  setImage(dto) {
    let image = {
      id: this.idFromDto(dto),
      isFlipped: false,
      isFavorite: this.favoriteFromDto(dto),
      url: this.urlFromDto(dto)
    }
    this.setState({ image });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  componentWillReceiveProps(props) {
    this.setImage(props.dto)
  }

  // get image favorite value from dto
  favoriteFromDto(dto) {
    return dto.isFavorite;
  }

  // get image id value from dto
  idFromDto(dto) {
    return dto.id;
  }

  // get url image value from dto
  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  // flip the image
  flipImage() {
    let {image} = this.state;
    image.isFlipped = !image.isFlipped;
    this.setState({image});
  }

  render() {
    return (
      <div
        className="image-root"
        style={this.getRootStyle()}
        >
        <div
          style={this.getOverlayStyle()}
        >
          <FontAwesome className="image-icon" onClick={ () => {this.flipImage()} } name="arrows-alt-h" title="flip"/>
          <FontAwesome className="image-icon" onClick={ this.props.onDuplicate } name="clone" title="clone"/>
          <FontAwesome className="image-icon" onClick={ () => {this.props.onToggleModal(this.state.image, this.props.dataIndex) } } name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;

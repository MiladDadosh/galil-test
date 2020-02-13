import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';


import './Modal.scss';

class ImageModal extends React.Component {

  static propTypes = {
    url: PropTypes.string
  };

  render() {
    return (
      <div className="modal">
        <div className="modal-bg"></div>
        <div className="modal-container">

          <button className="btn close" onClick={this.props.onCloseModal}>x</button>

          <div className="paginate">
            <button onClick={ () => { this.props.onNavigateTo(-1) } }><FontAwesome className="arrow" name="angle-left" title="angle-left"/></button>
            <div className="paginate-count">
              {this.props.data.currentIndex} / {this.props.data.total}
            </div>
            <button onClick={ () => { this.props.onNavigateTo(1) } }><FontAwesome className="arrow" name="angle-right" title="angle-right"/></button>
          </div>

          <img src={this.props.data.image.url} alt="" style={{ transform: this.props.data.image.isFlipped ? 'rotatey(180deg)' : '' }}/>


          <button className="btn-add-to-favorite" onClick={ () => {this.props.onToggleFavorite()} }>
            <FontAwesome className={`${this.props.data.image.isFavorite ? 'red' : ''}`} name="heart" title="favorite"/>
          </button>

        </div>
      </div>
    );
  }
}

export default ImageModal;

import React from 'react';
import './Favorite.scss';

class Favorite extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      favImages: []
    }
  }

  componentDidMount() {
    this.getFavFromLocalStorage();
  }

  // get favorite images from local storagr
  getFavFromLocalStorage() {
    let localStorage = window.localStorage.getItem('galil-favorite') || '[]';
    let localStorageArray = JSON.parse(localStorage);
    this.setState({favImages: localStorageArray});
  }

  render() {
    return (
      <div className={'sidebar ' + (this.props.show ? 'active' : '')}>
        <div className="sidebar-container">
          <button className="btn close" onClick={this.props.onCloseSidebar}>x</button>
          <h3>Favorite</h3>
          <div className="fav-images">
            {
              this.state.favImages.map((img, index) => {
                return <img key={index} src={img.url} alt="" />
              })
            }
          </div>
        </div>
      </div>

    );
  }
}

export default Favorite;

import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import Favorite from '../Favorite';
import FontAwesome from 'react-fontawesome';


class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'sea',
      toggleSidebar: false,
      activeSidebar: true
    };
  }

  // toggle sidebar favorite images
  toggleFavorite() {
    this.setState({ toggleSidebar: !this.state.toggleSidebar });
  }

  // render sidebar
  renderFavorite() {
    this.setState({ activeSidebar: false });
    setTimeout(() => {
      this.setState({ activeSidebar: true });
    },0);
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
          <button className="btn-fav-toggle" onClick={ () => {this.toggleFavorite()} }><FontAwesome name="heart" title="favorite-toggler"/></button>
        </div>
        { this.state.activeSidebar ? <Favorite show={this.state.toggleSidebar} onCloseSidebar={ () => {this.toggleFavorite()} } /> : '' }
        <Gallery tag={this.state.tag} onRenderFavorite={() => {this.renderFavorite()} }/>
      </div>
    );
  }
}

export default App;

import React from 'react';
import {Map} from './Map.js'
import {GoogleApiWrapper} from 'google-maps-react';

export class Container extends React.Component{
  render(){
    const style = {
      width: '290px',
      height: '250px'
  }

    return (
      <div style={style}>
        <Map  initialCenter={this.props.location}
        google={this.props.google} />
      </div>
    )
  }

}


export default GoogleApiWrapper({
  apiKey: ("AIzaSyD23VhZQRJDKE88Zp-yDAFYwyfrZc1itKw")
})(Container)

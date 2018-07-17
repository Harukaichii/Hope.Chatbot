import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const styles ={
  position: 'static',
  height:"100%"
};


export class Map extends React.Component {
  constructor(props) {
    super(props);

    const {initialCenter} = this.props;
    this.state = {
      address: initialCenter
    };

  }

  componentDidMount() {
    this.loadMap();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
  }

  // returns the coordinates from geocode API using address
  getCoordinates(address, something)
  {
    const {google} = this.props;
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: address}, function(results, status){
         let coord = results[0].geometry.location;
          var coordinates=[coord.lat(), coord.lng()];
         something(coordinates);
       });
    }

//NOTE: This function is way too complex and should be broken down later in time into smaller components
  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;
      const createMarker = this.createMarker;

      //gets the coordinates of the request
     this.getCoordinates(this.state.address, (co) => {
       const mapRef = this.refs.map;
       const node = ReactDOM.findDOMNode(mapRef);

       //sets up map settings
       let {zoom} = this.props;
       const lat = co[0];
       const lng = co[1];
       const center = new maps.LatLng(lat, lng);
       const mapConfig = Object.assign({}, {
         center: center,
         zoom: zoom
        }
      );

       this.map = new maps.Map(node, mapConfig);
       var help = this.map;

       var request = {
         location : center,
         radius: 10000,
         keyword: ["woman's shelters", "woman shelter", "womans shelter"]
       };


       var infowindow = new google.maps.InfoWindow();
       var service = new google.maps.places.PlacesService(this.map);
       service.nearbySearch(request, function(result, status){
          var markers= [];
          if (status === google.maps.places.PlacesServiceStatus.OK){
                for (let i = 0; i <result.length; i++){
                    let placeLoc = result[i].geometry.location;
                    let marker = new google.maps.Marker({
                      map: help,
                      position: result[i].geometry.location,
                      name :result[i].name
                    });
                    google.maps.event.addListener(marker, 'click', function(){
                      infowindow.setContent('<div>'+marker.name+'</div>');
                      infowindow.open(help, this);
                  markers.push(marker); // make a marker at each place that match the request
                });
              }


       }else{
         alert("Sorry! Please try another location");
       }


      });
    });
  }
}


  render() {
    return (
      <div ref='map' style={styles}>
        Loading map...
      </div>
    );
  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.string
}

Map.defaultProps= {
  zoom: 13,
  initialCenter: "1290 Heritage Way"
}

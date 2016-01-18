var React = require("react")
var ReactDOM = require("react-dom")
var Component = require("react").Component

var GoogleMap = require("react-google-maps").GoogleMap
var Marker = require("react-google-maps").Marker
var SearchBox = require("react-google-maps").SearchBox
var DirectionsRenderer = require("react-google-maps").DirectionsRenderer


/*
 * https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */


var mapCenter = {
  "lat": 47.6205588,
  "lng": -122.3212725
}

var inputStyle = {
  "border": "1px solid transparent",
  "borderRadius": "1px",
  "boxShadow": "0 2px 6px rgba(0, 0, 0, 0.3)",
  "boxSizing": "border-box",
  "MozBoxSizing": "border-box",
  "fontSize": "14px",
  "height": "32px",
  "marginTop": "27px",
  "outline": "none",
  "padding": "0 12px",
  "textOverflow": "ellipses",
  "width": "400px"
}


var PiMaps = React.createClass({
  getInitialState: function() {
    return {
      origin: "Brasov", //new google.maps.LatLng(41.8507300, -87.6512600),
      destination: "Craiova", //new google.maps.LatLng(41.8525800, -87.6514100),
      directions: null,
      waypoints: [
        {
         location:"Sibiu",
         stopover:true
       }],
    };
  },

  handleBoundsChanged: function () {
    this.setState({
      bounds: this.refs.map.getBounds(),
      center: this.refs.map.getCenter()
    });
  },

  handlePlacesChanged: function () {
    const places = this.refs.searchBox.getPlaces();
    const markers = [];

    // Add a marker for each place returned from search bar
    places.forEach(function (place) {
      markers.push({
        position: place.geometry.location
      });
    });

    // Set markers; set map center to first search result
    const mapCenter = markers.length > 0 ? markers[0].position : this.state.center;

    this.setState({
      center: mapCenter,
      markers: markers
    });

    return;
  },

  componentDidMount: function () {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: this.state.origin,
      destination: this.state.destination,
      waypoints: this.state.waypoints,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if(status == google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result
        })
      }
      else {
        console.error(`error fetching directions ${ result }`);
      }
    });
  },

  render: function () {
    const origin = this.state.origin
    const directions = this.state.directions

    return (
      <GoogleMap containerProps={{
          style: {
            height: "100%",
          },
        }}
        defaultZoom={7}
        defaultCenter={origin}>
        {directions ? <DirectionsRenderer directions={directions} /> : null}
      </GoogleMap>
    );
  }

})

ReactDOM.render((<PiMaps />), document.getElementById("main"))

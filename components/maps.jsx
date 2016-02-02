var React     = require("react")
var ReactDOM  = require("react-dom")
var Component = require("react").Component


var GoogleMap  = require("react-google-maps").GoogleMap
var InfoWindow = require("react-google-maps").InfoWindow
var Circle     = require("react-google-maps").Circle
var DirectionsRenderer = require("react-google-maps").DirectionsRenderer


const REFRESH_INTERVAL = 4000;
const RADIUS_SIZE = 20;


var PiMaps = React.createClass({
  getInitialState: function() {
    return {
      origin      : '',
      destination : '',
      directions  : null,
      waypoints   : [],
      lat         : null,
      lng         : null
    };
  },

  getDirections: function () {
    $.get('/directions', function(res) {
      var places = res.places.split(',');

        // Define empty state
        var newState = {
          origin      : '',
          destination : '',
          directions  : null,
          waypoints   : []
        };

        // Set navigation origin
        if (places[0]) {
          // If coords given, use lat and lng
          if (places[0].split('/').length == 2) {
            this.setState({
              lat: parseFloat(places[0].split('/')[0]),
              lng: parseFloat(places[0].split('/')[1])
            });
          } else {
            newState.origin = places[0];
          }
        }

        // Set navigation destination
        if (places.length > 1) {
          newState.destination = places[places.length-1];
        } else {
          newState.destination = places[0];
        }

        // Set navigation waypoints
        if (places.length > 2) {
          for (i=1; i<places.length-1; i++)
            newState.waypoints.push({
              location: places[i],
              stopover: true
            });
        }


      if (newState.origin != this.state.origin ||
          newState.destination != this.state.destination ||
          newState.waypoints.join() != this.state.waypoints.join()) {
        // Set new state
        this.setState(newState);

        // Refresh map
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
          origin      : this.state.origin,
          destination : this.state.destination,
          waypoints   : this.state.waypoints,
          travelMode  : google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if(status == google.maps.DirectionsStatus.OK) {
            this.setState({ directions: result });
          } else {
            console.error(`error fetching directions ${ result }`);
          }
        });
      };
    }.bind(this))
  },

  componentDidMount: function () {
    this.getDirections();
    setInterval(this.getDirections, REFRESH_INTERVAL);
  },

  render: function () {
    const origin     = this.state.origin;
    const directions = this.state.directions;

    const lat = this.state.lat;
    const lng = this.state.lng;

    return (
      <GoogleMap
        containerProps={{ style: { height: "100%" } }}
        zoom={40}
        center={ lat ? {lat:lat, lng:lng} : ''}>
        {lat ? [
          (<InfoWindow
            key="info"
            position={{lat:lat, lng:lng}}
            content="You are in this area" />),
          (<Circle
            key="circle"
            center={{lat:lat, lng:lng}}
            radius={RADIUS_SIZE}
            options={{
              fillColor: "red",
              fillOpacity: 0.20,
              strokeColor: "red",
              strokeOpacity: 1,
              strokeWeight: 1,
            }} />),
        ] : null}
        {directions ? <DirectionsRenderer directions={directions} /> : null}
      </GoogleMap>
    );
  }

});


if (document.getElementById("main"))
  ReactDOM.render((<PiMaps />), document.getElementById("main"))

var React = require("react")
var ReactDOM = require("react-dom")
var Component = require("react").Component

var GoogleMap = require("react-google-maps").GoogleMap
var DirectionsRenderer = require("react-google-maps").DirectionsRenderer


const REFRESH_INTERVAL = 4000;


var PiMaps = React.createClass({
  getInitialState: function() {
    return {
      origin      : '',
      destination : '',
      directions  : null,
      waypoints   : [],
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
        if (places[0]) newState.origin = places[0];

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
    const origin = this.state.origin
    const directions = this.state.directions

    return (
      <GoogleMap
        containerProps={{ style: { height: "100%" }}}
        defaultZoom={6}
        defaultCenter={{lat: -25.363882, lng: 131.044922}}>
        {directions ? <DirectionsRenderer directions={directions} /> : null}
      </GoogleMap>
    );
  }

});

var PiMapsRemote = React.createClass({
  handlePlaceChange: function (event) {
    $.get('/put_directions?places=' + event.target.value, function(res) {})
  },

  render: function () {
    return (
      <div style={{margin: '20% auto 0px auto'}}>
        <h2>PiMaps</h2>
        <p>Add your route:</p>
        <input
          type="text"
          placeholder='Places (separated by a comma)'
          style={{ width: '100%', fontSize: '16px' }}
          onChange={this.handlePlaceChange}/>
      </div>
    );
  }
});

if (document.getElementById("main"))
  ReactDOM.render((<PiMaps />), document.getElementById("main"))
if (document.getElementById("remote"))
  ReactDOM.render((<PiMapsRemote />), document.getElementById("remote"))

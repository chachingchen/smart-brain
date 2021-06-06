import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: '7944ea3a4d1744539ca18a6f69c49630'
});

const particlesOption = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component {
  constructor(){
    super();
    this.state= {
      input: '',
      imageUrl:''
    }
  }

  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = ()=> {
    this.setState({imageUrl: this.state.input});
    app.models.predict('e466caa0619f444ab97497640cefc4dc', this.state.input).then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      },
      function(err) {

      }
    );
  }

  render(){
    return (
      <div className="App">
      <Particles className='particles' params={particlesOption} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
  
}

export default App;

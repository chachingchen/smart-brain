import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftcol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightcol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = ()=> {
    this.setState({imageUrl: this.state.input});
    app.models.predict('e466caa0619f444ab97497640cefc4dc', this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response))) 
    .catch(err => console.log(err));
  }

  onRouteChange = (route)=> {
    if(route === 'signout') {
      this.setState({isSignedIn: false})
    }else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    
    const {imageUrl,box,route, isSignedIn } = this.state;
    return (
      <div className="App">
      <Particles className='particles' params={particlesOption} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
            ? <div>
                <Logo />
                <Rank />
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div> 
            : (
                route === 'signin' 
                ? <Signin onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
             
        }
        
      </div>
    );
  }
  
}

export default App;

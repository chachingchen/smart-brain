import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';


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

const initialState = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      selectedFile: null,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor(){
    super();
    this.state= initialState;
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

  onFileChange = (event)=> {
    let img = event.target.files[0];
    console.log('img:  ',img);
    this.setState({selectedFile: URL.createObjectURL(img)});
    console.log('selectedFile:  ',this.state.selectedFile);
  }
  
  onButtonSubmit = ()=> {
    
      this.setState({imageUrl: this.state.selectedFile});
      fetch('https://damp-retreat-36499.herokuapp.com/imageurl',{
        method: 'post',
        headers: {'content-type' : 'application/json'},
        body: JSON.stringify({
        input: this.state.selectedFile
      })
    })
    .then(response => response.json())
    .then(response => {
      if (typeof response === 'object'){
        if (response) {
        fetch('https://damp-retreat-36499.herokuapp.com/image',{
          method: 'put',
          headers: {'content-type' : 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)

      }
      this.displayFaceBox(this.calculateFaceLocation(response))
      }
      
    }) 
    .catch(err => console.log(err));
  }

  onRouteChange = (route)=> {
    if(route === 'signout') {
      this.setState(initialState)
    }else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    
    const {imageUrl,box,route, isSignedIn } = this.state;
    const {name, entries} = this.state.user;
    return (
      <div className="App">
      <Particles className='particles' params={particlesOption} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} name={name} />
        { route === 'home' 
            ? <div>
                <Logo />
                <Rank name={name} entries={entries}/>
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} onFileChange={this.onFileChange}/>
                <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div> 
            : (
                route === 'signin' 
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
             
        }
        
      </div>
    );
  }
  
}

export default App;

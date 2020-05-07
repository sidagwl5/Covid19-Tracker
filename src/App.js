import React, { Component , Fragment} from 'react'
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import Axios from 'axios';


export default class App extends Component {

    state = {

        viewPort : {
  
             latitude : 20,
             longitude : 20,
             height : "100vh",
             width : "100%",
             zoom : 1.5
  
        },

        dataSet : [],
        selected : null,
        country : "",
        countryData : null
    }

    async componentDidMount(){

      const data = await Axios.get("https://corona.lmao.ninja/v2/countries");
  
                      
      this.arr = data.data.filter(v => {
  
  
                 const {lat, long} = v.countryInfo;
  
                 return (lat < 90 && lat > -90 && long < 90 && long > -90);
          })
  
  
      this.setState({
  
          dataSet : this.arr
      })
      
  
  
  } 
  
  handleColor(data){
  
      if(data.active <= 5000)
      {
          return "lightgreen";
      }
      else if (data.active > 5000 && data.active <= 20000){
  
          return "blue";
      }
      else{
  
          return "red";
      }
  }
  
  async handleClick(){
  
        if(this.state.country){
  
            try {
  
              const url = `https://corona.lmao.ninja/v2/countries/${this.state.country}`;
             const data = await Axios.get(url);
  
             if(data){
  
                 this.setState({
  
                     countryData : data.data
                 })
             }
             else{
  
                 this.setState({
  
                     countryData : null
                 })
             }
                
            } catch (error) {
                
               this.setState({
  
                   countryData : null
               })
            }
      
        }
        else{
  
           this.setState({
  
               countryData : null
           })
        }
  }
  
  handleData(){
  
       if(this.state.countryData){
  
            return(
            <div className = "tile">
  
              <p style = {{fontSize : "30px", textTransform : "uppercase", fontWeight : "600"}}>{this.state.countryData.country}</p>
              <p><span> Total Cases :</span> {this.state.countryData.cases}</p>
              <p><span> Active Cases :</span> {this.state.countryData.active} </p>
              <p><span> Recovered : </span>{this.state.countryData.recovered} </p>
              <p><span> Deaths : </span>{this.state.countryData.deaths} </p>
            </div>
            )
       }
       else{
  
          return <p style = {{color : "white"}}>Nothing to show</p>
       }
  }


  render() {
    return (
      <Fragment>

<div className="header">
        <div className="symbol">
            <div style = {{backgroundColor : "lightgreen"}} className="color">
            </div>
            <p>Low</p>    
        </div>
        <div className="symbol">
            <div style = {{backgroundColor : "blue"}} className="color">
            </div>
            <p>Medium</p>
        </div>
        <div className="symbol">
            <div style = {{backgroundColor : "red"}} className="color">
            </div>
            <p>High</p>
        </div>
    </div>

          <div>
          <ReactMapGL
             
              mapboxApiAccessToken = "pk.eyJ1Ijoic2lkYWd3bCIsImEiOiJjazl2b3F6dnAwMTUzM2lzMGl3MDcyd3JzIn0.d9_bb6FDqbt0d5qiiD8QMQ" 
              {...this.state.viewPort}
              onViewportChange = {(viewPort) => {

                    this.setState({

                          viewPort : viewPort
                    })
              }}
              
              mapStyle = "mapbox://styles/sidagwl/ck9vv6cyx02661jqfdy0meezw"
              
              
          >


{
              (this.state.dataSet.length > 0) ?   this.state.dataSet.map(v => {


                const {lat, long} = v.countryInfo;
                return(
            
            
                     <Marker latitude = {lat} longitude = {long}>


             <svg fill = {this.handleColor(v)} onClick = {(e) => {
        
        e.preventDefault();
        this.setState({

            selected : v
        })

  }} xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>
                        

                     </Marker> 
                )
              
            }) : null
          }

        {
        
        (this.state.selected) ? <Popup latitude = {this.state.selected.countryInfo.lat} longitude = {this.state.selected.countryInfo.long}><div>
            
             <p><span>Country : </span>{this.state.selected.country}</p>
            <p><span> Total Cases :</span> {this.state.selected.cases}</p>
            <p><span> Active Cases :</span> {this.state.selected.active} </p>
            <p><span> Recovered : </span>{this.state.selected.recovered} </p>
            <p><span> Deaths : </span>{this.state.selected.deaths} </p>
        
        
        </div></Popup> : null
        }

          </ReactMapGL>
          </div> 
          <div className = "main">
          <h1>Corona Statistics</h1>
          <div className = "input">
          <input type = "text" onChange = {(e) => this.setState({country : e.target.value})} placeholder = "Enter name of the country.." />
          <button onClick = {() => this.handleClick()}>Find</button>
          </div>
          {this.handleData()}
          </div>  
      </Fragment>
    )
  }
}

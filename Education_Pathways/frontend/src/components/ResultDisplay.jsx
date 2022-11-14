import React, { Component } from "react";
import axios from 'axios'
import Result from './Results'
import './css/Result.css'
import Label from './Label'
import "./css/styles.css";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get  } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6YzFrRBpdaOCf8xX3lZHPpYRDtYMH_7g",
  authDomain: "educationpathways-c37ec.firebaseapp.com",
  databaseURL: "https://educationpathways-c37ec-default-rtdb.firebaseio.com",
  projectId: "educationpathways-c37ec",
  storageBucket: "educationpathways-c37ec.appspot.com",
  messagingSenderId: "868723117829",
  appId: "1:868723117829:web:0ffafe21bca572ee2b716c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

const dbRef = ref(getDatabase());

class SearchResultDisplay extends Component{

  constructor() {
    super();
    this.state = {
      input: "",
      results: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getData(this.state.input)
  }

  getData = (input) => {
    axios.get(`https://assignment-1-starter-template.herokuapp.com/searchc?input=${input}`)
      .then(res => {
        console.log(`it is ${res.status}`)
        if (res.status === 200) {

          this.setState({results: []})
          
          if (res.data.length > 0) {
            let len = res.data.length
            let result_temp = []
            result_temp.push(<Label></Label>)
            for (let i = 0; i < len; i++) {
              get(child(dbRef, `feedback/${res.data[i].code}`)).then((snapshot) => {
                if (snapshot.exists()) {
                  result_temp.push(<Result course_code={res.data[i].code} course_name={res.data[i].name}
                    complexity={snapshot.val().complexity} workload={snapshot.val().workload}></Result>)
                }else{
                  result_temp.push(<Result course_code={res.data[i].code} course_name={res.data[i].name}></Result>)
                }
              }).catch((error) => {
                console.error(error);
              });
            }
            this.setState({results: result_temp})
          } else if (res.data.length === 0) {
            alert("Course not found")
          }else {
            let result_temp = []
            result_temp.push(<Label></Label>)

            get(child(dbRef, `feedback/${res.data.course.code}`)).then((snapshot) => {
              if (snapshot.exists()) {
                result_temp.push(<Result course_code={res.data.course.code} course_name={res.data.course.name}
                  complexity={snapshot.val().complexity} workload={snapshot.val().workload}></Result>)
              } else {
                result_temp.push(<Result course_code={res.data.course.code} course_name={res.data.course.name}></Result>)
              }
            }).catch((error) => {
              console.error(error);
            });

            this.setState({results: result_temp})
          }

        } else if (res.status === 400) {
          alert("System Error. Please refresh")
        }
    })
  }

  // search_render = (input) => {

  //   <div className="SearchQuery">
  //       <div style={{ marginTop: "10%" }}>
  //           <h1> Education Pathways Search</h1>
  //           <br></br>
  //           <form onSubmit={this.handleSubmit} className={"search"}>
  //               <input placeholder={"Search for course code, course name, keyword ..."} className={"text-input"} type="text" value={this.state.input} onChange={this.handleChange} />
  //               <input type="submit" value="Submit" className={"submit-button"}/>
  //           </form>
  //       </div>

  //       <div className={"search-result-display"} >
  //           {this.state.results}
  //       </div>

       
  //     </div>





  // }

  render(){
    return (
      <div className="SearchQuery">
        <div style={{ marginTop: "10%" }}>
            <h1> Education Pathways</h1>
            <br></br>
            {/* <div className = "body_text">
      Welcome to CARTE's in-development tool for course selection at UofT. Education Pathways allows for more intelligent course searching, by matching not just the terms you search, but ones relevant to them. The more terms you search for, the more relevant your results will be! Even try searching across disciplines for the courses that best cover each.

Whatever year you are looking for, Education Pathways will also suggest courses in earlier years that will best help you to prepare. To get the most out of this, try searching for courses in a later year and see what is suggested for your current one.

We are looking for feedback to improve Education Pathways and make it more useful for students. If you have ideas or suggestions, please <a href = "mailto:alex.olson@utoronto.ca">  email us! </a>


      </div> */}
            <form onSubmit={this.handleSubmit} className={"search"}>
                <input placeholder={"Search for course code, course name, keyword ..."} className={"text-input"} type="text" value={this.state.input} onChange={this.handleChange} />
                <input type="submit" value="Search" className={"submit-button"}/>
            </form>
        </div>

        <div className={"search-result-display"} >
            {this.state.results}
        </div>

       
      </div>
    );
  }


  
}

export default SearchResultDisplay;

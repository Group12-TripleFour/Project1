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
        console.log(input)
        if (res.status === 200) {

          this.setState({results: []})
          
          if (res.data.length > 0) {
            let len = res.data.length
            let result_temp = []
            result_temp.push(<Label></Label>)
            for (let i = 0; i < len; i++) {
              //reads the data from the database for each course code displayed 
              get(child(dbRef, `feedback/${res.data[i].code}`)).then((snapshot) => {
                //calculates the average workload and complexity of the course based on reviews
                if (snapshot.exists()) {
                  let workload_cnt = 0
                  let complexity_cnt = 0
                  let total = 0
                  snapshot.forEach(child =>{
                    total++
                    workload_cnt += parseInt(child.val().workload, 10)
                    complexity_cnt += parseInt(child.val().complexity, 10)
                    console.log(workload_cnt)
                  })
                  result_temp.push(<Result course_code={res.data[i].code} course_name={res.data[i].name}
                    complexity={(complexity_cnt/total).toFixed(1)+"/5"} workload={(workload_cnt/total).toFixed(1)+"/5"}></Result>)
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

            //for if only one course is displayed
            get(child(dbRef, `feedback/${res.data.course.code}`)).then((snapshot) => {
              if (snapshot.exists()) {
                result_temp.push(<Result course_code={res.data.course.code} course_name={res.data.course.name}
                  complexity={(snapshot.val().complexity).toFixed(1)+"/5"} workload={(snapshot.val().workload).toFixed(1)+"/5"}></Result>)
              } else {
                result_temp.push(<Result course_code={res.data.course.code} course_name={res.data.course.name}></Result>)
              }
            }).catch((error) => {
              console.error(error);
            });

            this.setState({results: result_temp})
            console.log(result_temp)
          }

        } else if (res.status === 400) {
          alert("System Error. Please refresh")
        }
    })
  }

  render(){
    return (
      <div className="SearchQuery">
        <div style={{ marginTop: "10%" }}>
            <h1> Education Pathways</h1>
            <br></br>

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

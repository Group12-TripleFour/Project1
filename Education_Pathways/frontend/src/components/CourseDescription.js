import React, { Component } from 'react';
import './css/course-description.css'
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import requisite_label from './img/requisite-label.png'
import empty_star from './img/star.png'
import starred from './img/starred.png'
import axios from "axios"

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

let star = empty_star;

class CourseDescriptionPage extends Component {

  constructor(props){
    super(props)

    this.state = {
      course_code: this.props.course_code,
      course_name: "",
      division: "Faculty of Applied Science and Engineering",
      department: "Department of Edward S. Rogers Sr. Dept. of Electrical & Computer Engineering",
      workload: [],
      complexity: [],
      usefulness: [],
      feedback: [], //{workload: [], complexity: [], usefulness: []}
      graph : "",
      course_description: "",
      syllabus: "",
      prerequisites: "",
      corequisites: "",
      exclusions: "",
      starred: false,
      graphics: [],
      username: localStorage.getItem('username')
    }
  }



  componentDidMount() {
    console.log("pass in course code: ", this.props.match.params.code)

    axios.get(`https://cors-anywhere.herokuapp.com/https://assignment-1-starter-template.herokuapp.com/course/details?code=${this.props.match.params.code}`, {
      code: this.props.course_code
    })
      .then(res => {
        console.log(res.data)
        this.setState({course_code: res.data.course.code})
        this.setState({course_name: res.data.course.name})
        this.setState({course_description : res.data.course.description})
        this.setState({graph: res.data.course.graph})
        let prereq_len = res.data.course.prereq.length
        if (prereq_len > 1) {
          let prereq_str = ""
          for (let i = 0; i < prereq_len; i++) {
            prereq_str += res.data.course.prereq[i]
            if (i !== prereq_len - 1) {
              prereq_str += ", "
            }
          }
          this.setState({prerequisites : prereq_str})
        } else {
          this.setState({prerequisites : res.data.course.prereq})
        }
        let coreq_len = res.data.course.coreq.length
        if (coreq_len > 1) {
          let coreq_str = ""
          for (let i = 0; i < coreq_str; i++) {
            coreq_str += res.data.course.coreq[i]
            if (i !== coreq_len - 1) {
              coreq_str += ", "
            }
          }
          this.setState({corequisites : coreq_str})
        } else {
          this.setState({corequisites : res.data.course.coreq})
        }
        let exclusion_len = res.data.course.exclusion.length
        if (exclusion_len > 1) {
          let exclusion_str = ""
          for (let i = 0; i < exclusion_str; i++) {
            exclusion_str += res.data.course.exclusion[i]
            if (i !== exclusion_len - 1) {
              exclusion_str += ", "
            }
          }
          this.setState({exclusions : exclusion_str})
        } else {
          this.setState({exclusions : res.data.course.exclusion})
        }
        let syllabus_link = "http://courses.skule.ca/course/" + this.props.code
        this.setState({syllabus : syllabus_link})

        let temp_graph = []
        //temp_graph.push(<ShowGraph graph_src={this.state.graph}></ShowGraph>)
        this.setState({graphics: temp_graph})


    })

    this.setState({course_code: this.props.match.params.code})

    get(child(dbRef, `feedback/${this.props.match.params.code}`)).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach(child =>{
          this.setState({
            feedback: this.state.feedback.concat([{workload: child.val().workload, complexity: child.val().complexity, usefulness: child.val().usefulness}])
          })
        })
      }
    }).catch((error) => {
      console.error(error);
    });

    console.log("new state: ", this.state)
  }


  openLink = () => {
    const newWindow = window.open(this.state.syllabus, '_blacnk', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  }

	render() {

		return(

      <div className="page-content">
        <Container className="course-template">
          <Row float="center" className="course-title">
            <Col xs={8}>
              <h1>{this.state.course_code} : {this.state.course_name}</h1>
            </Col>
            {/* <Col xs={4}>
              <img src={star} onClick={this.check_star} alt="" />
            </Col> */}
          </Row>
          <Row>
            <Col className="col-item">
              <h3>Division</h3>
              <p>{this.state.division}</p>
            </Col>
            <Col className="col-item">
              <h3>Department</h3>
              <p>{this.state.department}</p>
            </Col>
            <Col className="col-item">
              <h3>Past Tests and Syllabi</h3>
              <button className={"syllabus-link"} onClick={this.openLink}>View</button>
            </Col>
          </Row>
          <Row className="col-item course-description">
            <h3>Course Description</h3>
            <p>{this.state.course_description}</p>
          </Row>
          <Row className="col-item course-requisite">
            <Row>
              <h3>Course Requisites</h3>
            </Row>
            <Row>
              <Col className="requisites-display">
                <h4>Pre-Requisites</h4>
                <p>{this.state.prerequisites}</p>
              </Col>
              <Col className="requisites-display">
                <h4>Co-Requisites</h4>
                <p>{this.state.corequisites}</p>
              </Col>
              <Col className="requisites-display">
                <h4>Exclusion</h4>
                <p>{this.state.exclusions}</p>
              </Col>
            </Row>
            <Row>
              <div className={"req-graph"}>
                <img style={{width: "70%", marginBottom: "3%"}} alt="" src={requisite_label}></img>
                <img src={`data:image/jpeg;base64,${this.state.graph}`} alt="" ></img>
              </div>
            </Row>
          </Row>
          <Row>
            <h3>Course Feedback</h3>
          </Row>
          <Row className="col-item reviews">
            <Row>
              <h3>Course Feedback</h3>
            </Row>
            <Row>
              <table className="table table-striped table-bordered">
                  <thead>
                      <tr>
                          <th style={{width: 120}}>Workload</th>
                          <th style={{width: 125}}>Complexity</th>
                          <th>Comments</th>
                      </tr>
                  </thead>
                  <tbody>
                      {this.state.feedback && this.state.feedback.map((user, index) =>
                          <tr key={index}>
                              <td>{user.workload}</td>
                              <td>{user.complexity}</td>
                              <td align="left">{user.usefulness}</td>
                          </tr>
                      )}
                  </tbody>
              </table>
            </Row>
          </Row>
        </Container>
      </div>

		)
	}
}

export default CourseDescriptionPage

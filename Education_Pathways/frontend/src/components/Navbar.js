import React, { Component } from 'react';
import './css/navbar.css'
import 'bootstrap/dist/css/bootstrap.css';
import logo from './img/logo.png'
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
// import LogIn from "./LogIn.jsx";
import CourseDescriptionPage from "./CourseDescription";
// import Wishlist from './Wishlist';
// import SignUp from './SignUp'
import SearchResultDisplay from './ResultDisplay'
import Form from "./Form";
import FeedbackList from './feedbacks/FeedbackList';
import NewFeedbackForm from './feedbacks/NewFeedbackForm';
// import Comparison from './Comparison'

const DUMMY_DATA = [
  {
    coursename: 'ABC100',
    workload: 'H',
    complexity: 'H',
    usefulness: 'H',
  },
  {
    coursename: 'BCA200',
    workload: 'L',
    complexity:'L',
    usefulness: 'L',
  },
];

function CourseDescription (props) {
  let query = useQuery();
  return <CourseDescriptionPage code={query.get("code")} />;
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function addFeedbackHandler(feedback){
  console.log(feedback);
}

export default class NavbarComp extends Component {

  // constructor(props){
  //   super(props)
  //   this.state = {
  //     username: localStorage.getItem('username'),
  //     login: false
  //   }
  // }

  // componentDidMount() {
  //   if (localStorage.getItem('username') !== "") {
  //     this.setState({username: localStorage.getItem('username')})
  //   }
  // }

  // logOut = () => {
  //   localStorage.setItem('username', "");
  //   this.setState({username: ""})
  // }

  render() {
    return (
      <Router>
        <div>
          <Navbar bg="myBlue" variant="dark" sticky="top" expand="lg">
            <Navbar.Brand>
              <img src={logo} alt="" />{" "}
              <Nav.Link href="/" style={{ color: "white", display: "inline" }}>
                Education Pathways
              </Nav.Link>
            </Navbar.Brand>

            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav>
                <Nav.Link as={Link} to="/about">
                  About Us
                </Nav.Link>

                {/*<Nav.Link as={Link} to="/filter">
                  Filter
                </Nav.Link>*/}
		<a class="navbar-brand-top" href="/filter"> Filter </a>

                <Nav.Link as={Link} to="/review">
                  Review
                </Nav.Link>
    <a class="navbar-brand-top" href="/Comparison"> Comparison </a>
                {/*<Nav.Link as={Link} to="/comparison">
                  Comparsion
              </Nav.Link>*/}

              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div>
          <Switch>
          <Route path="/about">
            <div className = "body_text">
            <p>

      Welcome to CARTE's in-development tool for course selection at UofT. Education Pathways allows for more intelligent course searching, by matching not just the terms you search, but ones relevant to them. The more terms you search for, the more relevant your results will be! Even try searching across disciplines for the courses that best cover each.

Whatever year you are looking for, Education Pathways will also suggest courses in earlier years that will best help you to prepare. To get the most out of this, try searching for courses in a later year and see what is suggested for your current one.

We are looking for feedback to improve Education Pathways and make it more useful for students. If you have ideas or suggestions, please <a href = "mailto:alex.olson@utoronto.ca">  email us! </a> <br></br>
</p>
<p> 
  <b>Development Team: </b>
</p>
<p>Alexander Olson <a href="https://carte.utoronto.ca/"> (CARTE)</a> </p>
<p>Student team from <a href="https://shuiblue.github.io/UofT-ECE444/">ECE444-Fall2021</a> : Janelle Cuevas, Jean Lin, Terry Luan, Cansin Varol, Nick Woo</p>


      </div>
              {/* <SearchResultDisplay /> */}
            </Route>

            {/*<Route path="/filter">
              <div style={{ marginTop: "10%" }}>
              <h2> Filter for courses </h2>
              <Form />
              </div>
            </Route>*/}

            <Route path="/review">
              <div style={{ marginTop: "3%" }}>           <section>
              <h3> Submit Review Feedback</h3>
                <NewFeedbackForm onAddFeedback={addFeedbackHandler}/>
              </section>
              <section>
                <FeedbackList feedbacks={DUMMY_DATA} />
              </section>
              </div> 
            </Route>
            
            <Route exact
              path="/courseDetails/:code"
              render={props =>(<CourseDescriptionPage {...props} />)}>
            </Route>
            <Route path="/">
              <SearchResultDisplay />
            </Route>

          </Switch>
        </div>
        
        
    
      </Router>
    );
  }
}

import React, { Component } from 'react';
import './css/navbar.css'
import 'bootstrap/dist/css/bootstrap.css';
import logo from './img/logo.png'
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
import CourseDescriptionPage from "./CourseDescription";


import SearchResultDisplay, { global_array } from './ResultDisplay'
import Form from "./Form";
import FeedbackList from './feedbacks/FeedbackList';
import { useContext } from 'react';
import FavoritesContext from './favorites-context';
import classes from './Navbar.module.css';
import FeedbackSubmitPage from './FeedbackSubmitPage';

import NewFeedbackForm from './feedbacks/NewFeedbackForm';

function CourseDescription (props) {
  let query = useQuery();
  return <CourseDescriptionPage code={query.get("code")} />;
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Count(){
  const favoritesCtx = useContext(FavoritesContext);
  console.log(favoritesCtx.totalFavorites);
  return (
    <span className={classes.badge}>{favoritesCtx.totalFavorites}</span> 
  )}

function addFeedbackHandler(feedback){
  console.log(feedback);
}

export default class NavbarComp extends Component {
  
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
			
                <Nav.Link className={classes.navpath} as={Link} to="/about">
                  About Us
                </Nav.Link>

		<a class="navbar-brand-top" href="/filter"> 
		  Filter 
		</a>

                <Nav.Link as={Link} to="/review">
                  Review
                </Nav.Link>

    		<a class="navbar-brand-top" href="/Comparison"> 
		  Comparison 
		</a>

              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div>
          <Switch>
          <Route path="/about">
            <div className = "body_text">
            <p>

      Welcome to Triple 4's in-development tool for course selection at UofT. Education Pathways allows for more intelligent course searching, by matching not just the terms you search, but ones relevant to them. In filter page, you can search course with expected course year, division, department, campus, and minor. In review page, you can add your thoughts for certain course, it will be shown on the course pages.

We are looking for feedback to improve Education Pathways and make it more useful for students. If you have ideas or suggestions, please <a href = "mailto:eric.liang@utoronto.ca">  email us! </a> <br></br>
</p>
<p> 
  <b>Development Team: </b>
</p>
<p>Student team from <a href="https://github.com/Group12-TripleFour/Project1">ECE444-Fall2022</a> : Emma Zhao, Eric Liang, Mandy Hsu, Nathan Coelho</p>


      </div>
              {/* <SearchResultDisplay /> */}
            </Route>

            <Route path="/review">
            <div>
              <FeedbackSubmitPage/>
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

import pandas as pd
from flask.testing import FlaskClient
import os
import sys
import inspect
currentdir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parentdir = os.path.dirname(currentdir)
sys.path.insert(0, parentdir) 
from index import app
import controller

# Eric - test for course comparison functionality 
def test_comparison_results():
    course1 = "Shakespeare and Film"
    course2 = "Introduction to Social Psychology"
    table = controller.compare_results(course1,course2)
    # check if the table is a proper pandas dataframe
    assert isinstance(table, pd.DataFrame)
    # check if there are 9 columns in the table
    assert len(table.keys())==9,"missing columns"

# Eric - test for comparison page response
def test_comparison_endpoint():
    tester = app.test_client()
    response1 = tester.get("/Comparison")
    response2 = tester.get("/Comparison/results")
    assert response1.status_code == 200
    assert response2.status_code == 200

# test_comparison_results()
# test_comparison_endpoint()
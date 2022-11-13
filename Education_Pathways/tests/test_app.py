from index import app
import controller
from minor import check_course_in_minor
from flask.testing import FlaskClient


# Emma - test for filter functionality
def test_filter_results():
    minor = "Biomedical Engineering Minor"
    table =  controller.filter_results(None, "0", "Any", "Any", "Any", minor)
    assert table[0].iloc[:,0][0].strip().split('<')[1].split('>')[1]=="BME440H1"

def test_course_details_endpoint():
    tester = app.test_client()
    response = tester.get("/course/BME440H1")

    assert response.status_code == 200



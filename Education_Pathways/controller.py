# this is the controller
from flask import jsonify, request, redirect, render_template
from flask_restful import Resource, reqparse
# from flask_cors import cross_origin
from config import app
from model import *
import minor
from fuzzy import nysiis
import re
import pickle
import networkx as nx
import numpy as np
from collections import defaultdict
with open('resources/course_vectorizer.pickle','rb') as f:
    vectorizer = pickle.load(f)
with open('resources/course_vectors.npz','rb') as f:
    course_vectors = pickle.load(f)
with open('resources/graph.pickle','rb') as f:
    G = nx.read_gpickle(f)
df = pd.read_pickle('resources/df_processed.pickle').set_index('Code')

# -------------------- Course related --------------------
class FilterCourse(Resource):
    def get(self):
        input = request.args.get('division')

class SearchCourse(Resource):
    def get(self):
        input = request.args.get('input')
        code = re.findall('[a-zA-Z]{3}\d{3}[hH]?\d?', input)
        if code:
            code = code[0].upper()
            if len(code) == 6:
                code += 'H1'
            elif len(code) == 5:
                code += '1'
            if Course.objects(code=code):
                try:
                    resp = jsonify({'course': Course.get(code)})
                    resp.status_code = 200
                    return resp
                except Exception as e:
                    resp = jsonify({'error': 'something went wrong'})
                    resp.status_code = 400
                    return resp
        input = ' '.join([nysiis(w) for w in input.split()])
        try:
            search = Course.objects.search_text(input).order_by('$text_score')
            resp = jsonify(search)
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('input', required=True)
        data = parser.parse_args()
        input = data['input']
        code = re.findall('[a-zA-Z]{3}\d{3}[hH]?\d?', input)
        if code:
            code = code[0].upper()
            if len(code) == 6:
                code += 'H1'
            elif len(code) == 5:
                code += '1'
            if Course.objects(code=code):
                try:
                    resp = jsonify({'course': Course.get(code)})
                    resp.status_code = 200
                    return resp
                except Exception as e:
                    resp = jsonify({'error': 'something went wrong'})
                    resp.status_code = 400
                    return resp
        input = ' '.join([nysiis(w) for w in input.split()])
        try:
            search = Course.objects.search_text(input).order_by('$text_score')
            resp = jsonify(search)
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp


class ShowCourse(Resource):
    def get(self):
        code = request.args.get('code')
        if not Course.objects(code=code):
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp
        try:
            resp = jsonify({'course': Course.get(code)})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('code', required=True)
        data = parser.parse_args()
        code = data['code']
        if not Course.objects(code=code):
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp
        try:
            resp = jsonify({'course': Course.get(code)})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp


class ShowCourseGraph(Resource):
    def get(self):
        code = request.args.get('code')
        if not Course.objects(code=code):
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp
        try:
            resp = jsonify({'graph': Course.get_requisite_graph(code)})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('code', required=True)
        data = parser.parse_args()
        code = data['code']
        if not Course.objects(code=code):
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp
        try:
            resp = jsonify({'graph': Course.get_requisite_graph(code)})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

# ------------------------------------------------------------
@app.route('/filter/results')
def filter_courses(search):
    results = filter_results(
	    search.data['search'],
	    search.data['select'],
	    search.data['divisions'],
	    search.data['departments'],
	    search.data['campuses'],
	    search.data['minor_search'],
	    )

    return render_template('results.html',tables=[t.to_html(classes='data',index=False,na_rep='',render_links=True, escape=False) for t in results],form=search)

# function for filter implementation
# input: filter parameter from selection bars
# output: result table of the course information
def filter_results(search, year, division, department, campus, minor_search, n_return=10):
        n_return=int(n_return)
        year=int(year)
        pos_vals = np.zeros((len(df),))
        idxs = [t[1] for t in sorted(list(zip(list(pos_vals),list(df.index))),key=lambda x:x[0],reverse=True)]
        tf = df.loc[idxs]
        print("type is:",tf)
        requisite_vals = defaultdict(list)
        if minor_search != 'Any':
                course_names=minor.engineering_minor_list[minor_search]
                print("course_names",course_names)
                tf.set_index('Course')
                tf_return = tf.loc[course_names]
                print("tf_return",tf_return)
                tables = [tf_return[['Course','Name','Division','Course Description','Department','Course Level']]]
                return tables
        if year!=0:
                main_table = tf[tf['Course Level'] == year]
        else:
                main_table = tf[tf['Course Level'] == 1]
        for name,filter in [('Division',division), ('Department',department), ('Campus',campus)]:
                if filter != 'Any':
                        #if name=='Minor':
                        #        course_names=engineering_minor_list[filter]
                        #        print("course name",course_names)
                        #        for n in course_names:
                        #                main_table = main_table[main_table['Course']==n]
                        print("name=",name)
                        main_table = main_table[main_table[name] == filter]
        tables = [main_table[0:n_return][['Course','Name','Division','Course Description','Department','Course Level']]]
        if year!=0:
                year-=1
                while (year>0):
                        tf = df.loc[[t[0] for t in sorted(requisite_vals.items(),key=lambda x: x[1],reverse=True)]]
                        tf = tf[tf['Course Level'] == year]
                        for name,filter in [('Division',division), ('Department',department), ('Campus',campus)]:
                                if filter != 'Any':
                                        tf = tf[tf[name] == filter]
                        tables.append(tf[0:n_return][['Course','Name','Division','Course Description','Department','Course Level']])
                        tables.pop()
                        year-=1
        return tables
@app.route('/course/<code>')
def course(code):

    #If the course code is not present in the dataset, progressively remove the last character until we get a match.
    #For example, if there is no CSC413 then we find the first match that is CSC41.
    #If there are no matches for any character, just go home.

    if code not in df.index:
        while True:
            code = code[:-1]
            if len(code) == 0:
                return redirect('/')
            t = df[df.index.str.contains(code)]
            if len(t) > 0:
                code = t.index[0]
                return redirect('/courseDetails/' + code)


    course = df.loc[code]
    #use course network graph to identify pre and post requisites
    pre = G.in_edges(code)
    post = G.out_edges(code)
    excl = course['Exclusion']
    coreq = course['Corequisite']
    aiprereq = course['AIPreReqs']
    majors = course['MajorsOutcomes']
    minors = course['MinorsOutcomes']
    faseavailable = course['FASEAvailable']
    mayberestricted = course['MaybeRestricted']
    terms = course['Term']
    activities = course['Activity']
    course = {k:v for k,v in course.items() if k not in ['Course','Course Level Number','FASEAvailable','MaybeRestricted','URL','Pre-requisites','Exclusion','Corequisite','Recommended Preparation','AIPreReqs','MajorsOutcomes','MinorsOutcomes','Term','Activity'] and v==v}
    return render_template(
            'course.html',
            course=course,
            pre=pre, 
            post=post,
            excl=excl,
            coreq=coreq,
            aip=aiprereq,
            majors=majors,
            minors=minors,
            faseavailable=faseavailable,
            mayberestricted=mayberestricted,
            terms=terms,
            activities=activities,
            zip=zip
            )



# --------------------Course Comparison Feature----------------------
@app.route('/comparison/results')
def compare_courses(search):
    # Store course information as a pd dataframe so that we can convert to html table directly 
    results = compare_results(search.data['course1'],search.data['course2'])
    return render_template('comparison_results.html',tables=[t.to_html(classes='data',index=False,na_rep='',render_links=True, escape=False) for t in [results]],form=search)

# Retreieve relevant course information for user selected courses and store into a pd dataframe 
def compare_results(course1,course2):
    tf = df.set_index("Course")
    # relevant course info: course code (with hyperlink), name, division, description, department, pre-requistes, level, APSC electives, and terms
    df1 = tf.loc[tf.Name==course1].reset_index()[["Course","Name","Division","Course Description","Department","Pre-requisites","Course Level","APSC Electives","Term"]]
    df2 = tf.loc[tf.Name==course2].reset_index()[["Course","Name","Division","Course Description","Department","Pre-requisites","Course Level","APSC Electives","Term"]]
    df_combined = pd.concat([df1,df2])
    # convert lists to strings for dataframe columns 
    df_combined["Term"] = [','.join(map(str, l)) for l in df_combined["Term"]]
    df_combined["Pre-requisites"] = [','.join(map(str, l)) for l in df_combined["Pre-requisites"]]
    return df_combined

# -------------------- Wishlist related --------------------
class UserWishlist(Resource):
    def get(self):
        username = "curr"
        try:
            resp = jsonify({'wishlist': User.get_wishlist(username_=username).expand()})
            resp.status_code = 200
            return resp
        except Exception as e: 
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

    def post(self):
        #parser = reqparse.RequestParser()
        #parser.add_argument('username', required=True)
        #data = parser.parse_args()
        username = "curr"# data['username']
        try:
            resp = jsonify({'wishlist': User.get_wishlist(username_=username).expand()})
            resp.status_code = 200
            return resp
        except Exception as e: 
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('code', required=True)
        data = parser.parse_args()
        code = data['code']
        if not Course.objects(code=code):
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp        
# ------------------------------------------------------------

class UserWishlistAdd(Resource):
    def get(self):
        username = "curr"#request.args.get('username')
        code = request.args.get('code')
        try:
            course = Course.get(code)
            wl = User.get_wishlist(username_=username)
            wl.add_course(course)
            resp = jsonify({'wishlist': wl.expand()})
            resp.status_code = 200
            return resp
        except Exception as e: 
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

    def post(self):
        parser = reqparse.RequestParser()
        #parser.add_argument('username', required=True)
        parser.add_argument('code', required=True)
        data = parser.parse_args()
        username = "curr" #data['username']
        code = data['code']
        try:
            course = Course.get(code)
            wl = User.get_wishlist(username_=username)
            wl.add_course(course)
            resp = jsonify({'wishlist': wl.expand()})
            resp.status_code = 200
            return resp
        except Exception as e: 
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp


class UserWishlistRemove(Resource):
    def get(self):
        username = "curr" #request.args.get('username')
        code = request.args.get('code')
        try:
            course = Course.get(code)
            wl = User.get_wishlist(username_=username)
            wl.remove_course(course)
            resp = jsonify({'wishlist': wl.expand()})
            resp.status_code = 200
            return resp
        except Exception as e: 
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

    def post(self):
        parser = reqparse.RequestParser()
        #parser.add_argument('username', required=True)
        parser.add_argument('code', required=True)
        data = parser.parse_args()
        username = "curr"#data['username']
        code = data['code']
        try:
            course = Course.get(code)
            wl = User.get_wishlist(username_=username)
            wl.remove_course(course)
            resp = jsonify({'wishlist': wl.expand()})
            resp.status_code = 200
            return resp
        except Exception as e: 
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp


class UserWishlistMinorCheck(Resource):
    def get(self):
        username = "curr"#request.args.get('username')
        try:
            wl = User.get_wishlist(username_=username)
            courses = [c.code for c in wl.course]
            print(courses)
            check = Minor.check(codes_=courses)
            print(check)
            resp = jsonify({'minorCheck': check})
            resp.status_code = 200
            return resp
        except Exception as e: 
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp
    
    def post(self):
        #parser = reqparse.RequestParser()
        #parser.add_argument('username', required=True)
        #data = parser.parse_args()
        username = "curr"#data['username']
        try:
            wl = User.get_wishlist(username_=username)
            courses = [c.code for c in wl.course]
            print(courses)
            check = Minor.check(codes_=courses)
            print(check)
            resp = jsonify({'minorCheck': check})
            resp.status_code = 200
            return resp
        except Exception as e: 
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp
            

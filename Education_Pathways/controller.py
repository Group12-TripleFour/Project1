# this is the controller

from flask import jsonify, request, redirect, render_template
from flask_restful import Resource, reqparse
# from flask_cors import cross_origin
from .config import app
from .model import *
from . import minor
from fuzzy import nysiis
import re
import numpy as np
from collections import defaultdict
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
	#if search.data['search'] == '' or not search.data['search']:
	#	print("search is empty")
	#	return redirect('/filter')
	results = filter_results(
		search.data['search'],
		search.data['select'],
		search.data['divisions'],
		search.data['departments'],
		search.data['campuses'],
		search.data['minor_search'],
		)
	print("not empty",results)
	#return send_from_directory(app.static_folder, 'filter_result.html')
	return render_template('results.html',tables=[t.to_html(classes='data',index=False,na_rep='',render_links=True, escape=False) for t in results],form=search)
def filter_results(search, year, division, department, campus, minor_search, n_return=10):
        n_return=int(n_return)
        year=int(year)
        pos_vals = np.zeros((len(df),))
        idxs = [t[1] for t in sorted(list(zip(list(pos_vals),list(df.index))),key=lambda x:x[0],reverse=True)]
        tf = df.loc[idxs]
        print("type is:",type(tf))
        requisite_vals = defaultdict(list)
        if minor_search != 'Any':
                course_names=minor.engineering_minor_list[minor_search]
                print("course_names",course_names)
                tf.set_index('Course')
                tf_return = tf.loc[course_names]
                print("tf_return",tf_return)
                tables = [tf_return[['Course','Name','Division','Course Description','Department','Course Level']]]
                return tables
        if year!='Any':
                main_table = tf[tf['Course Level'] == year]
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
        if year!='Any':
                year-=1
                while (year>0):
                        tf = df.loc[[t[0] for t in sorted(requisite_vals.items(),key=lambda x: x[1],reverse=True)]]
                        tf = tf[tf['Course Level'] == year]
                        for name,filter in [('Division',division), ('Department',department), ('Campus',campus)]:
                                if filter != 'Any':
                                        tf = tf[tf[name] == filter]
                        tables.append(tf[0:n_return][['Course','Name','Division','Course Description','Department','Course Level']])
                        year-=1
        return tables

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
            

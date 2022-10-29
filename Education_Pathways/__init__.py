import os
import pickle
import numpy as np
import pandas as pd
import networkx as nx
from collections import defaultdict
from scipy.sparse import load_npz
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, render_template, request, redirect
from wtforms import Form, StringField, SelectField
import model

def create_app():
	app=Flask(__name__, instance_relative_config=True)
	try:
		os.makedirs(app.instance_path)
	except OSError:
		pass

	@app.route('/',methods=['GET','POST'])
	def home():
		search=request.form['text']
		if request.method == 'POST':
			return search_results(search)
		return render_template('index.html', form=search)
	@app.route('/results')
	def search_results(search):
		if search=='' or not search:
			return redirect('/')
		results=search_courses(search)
		return render_template('results.html',tables=[t.to_html(classes='data',index=False,na_rep='',render_links=True, escape=False) for t in results],form=search)


	@app.route('/filter',methods=['GET','POST'])
	def filter_page():
		search = CourseSearchForm(request.form)
		if request.method=='POST':
			return filter_results(search)
		# add filter.html !!!!!
		return render_template('filter.html',form=search)
	@app.route('/filter/results')
	def filter_results(search):
		results=filter_courses(search.data['select'],search.data['divisions'],search.data['departments'],search.data['campuses'])
		return render_template('filter_results.html',tables=[t.tohtml(classes='data',index=False,na_rep='',render_links=True, escape=False) for t in results],form=search)

	#@app.route('/minor',methods=['GET','POST'])
	#def minor():
	#	minor_choice=request.form.get("minor")
	#	if request.method=='POST':
	#		return minor_results(minor_choice)
	#	return render_template('minor.html')

def search_courses(search_terms, n_return=10):
	n_return=int(n_return)
	terms=[t for t in pos_terms.split(',') if t.strip() in vectorizer.get_feature_names()]
	if len(terms)==0:
		return []
	
	for term in terms:
		idx = vectorizer.transform([term.strip()]).nonzero()[1][0]
		relevants = course_vectors[:,idx].nonzero()[0]
		pos_vals += np.mean(cosine_similarity(course_vectors,course_vectors[relevants,:]),axis=1)

	requisite_vals = defaultdict(list)
	for (k,v),i in zip(df.iterrows(),list(pos_vals)):
		if i>100:
			break
		for col in ['Pre-requisites','Recommended Preparation']:
			for c in v[col]:
				if c in df.index:
					requisite_vals[c].append(i)
	for (k,v) in requisite_vals.items():
		requisite_vals[k] = np.mean(v)

	pos_vals = np.zeros((len(df),))
	idxs = [t[1] for t in sorted(list(zip(list(pos_vals),list(df.index))),key=lambda x:x[0],reverse=True)]
	table=df.loc[idx][0:n_return]
	return table



	
def filter_courses(year, division, department, campus, n_return=10):
	n_return=int(n_return)
	year=int(year)
	pos_vals = np.zeros((len(df),))
	idxs = [t[1] for t in sorted(list(zip(list(pos_vals),list(df.index))),key=lambda x:x[0],reverse=True)]
	tf = df.loc[idxs]
	if year!='Any':
		main_table = tf[tf['Course Level'] == year]
	for name,filter in [('Division',division), ('Department',department), ('Campus',campus)]:
		if filter != 'Any':
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


#def minor_results(minor_choice):
	



with open('resources/course_vectorizer.pickle','rb') as f:
	vectorizer = pickle.load(f)
with open('resources/course_vectors.npz','rb') as f:
	course_vectors = pickle.load(f)
with open('resources/graph.pickle','rb') as f:
	G = nx.read_gpickle(f)


df = pd.read_pickle('resources/df_processed.pickle').set_index('Code')
app = create_app()
if __name__ == '__main__':
	app.run(host='0.0.0.0')

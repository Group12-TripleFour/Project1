# This is the model

from config import app, db
from wtforms import Form, StringField, SelectField
import pandas as pd

class Course(db.Document):
    code = db.StringField(required=True, unique=True)
    name = db.StringField(required=True)
    description = db.StringField(required=True)
    syllabus = db.URLField()
    prereq = db.ListField()
    coreq = db.ListField()
    exclusion = db.ListField()
    keyword = db.StringField(required=True)
    graph = db.StringField(required=True)
    ratings_difficulty = db.StringField()
    ratings_engagement = db.StringField()
    ratings_courseload = db.StringField()
    tags = db.StringField()
    meta = {'indexes': [
        '$keyword'
    ]}

    @classmethod
    def get(cls, code_):
        return cls.objects(code=code_).get()
    
    @classmethod
    def get_requisite_graph(cls, code_):
        return cls.objects(code=code_).get().graph


class CourseSearchForm(Form):
    df = pd.read_pickle('resources/df_processed.pickle').set_index('Code')
    divisions = [('Any','Any')] + sorted([
        (t,t) for t in set(df.Division.values)
    ])

    departments = [('Any','Any')] + sorted([
        (t,t) for t in set(df.Department.values)
    ])

    campus = [('Any','Any')] + sorted([
        (t,t) for t in set(df.Campus.values)
    ])

    year_choices = [
        (t,t) for t in set(df['Course Level'].values)
    ]
            
    top = [
        ('10','10'),
        ('25','25'),
        ('50','50')
    ]

    # add the minors to be part of the filter
    minors = [('Any','Any'), 
	('Artificial Intelligence Minor','Artificial Intelligence Minor'),
	('Advanced Manufacturing Minor','Advanced Manufacturing Minor'),
	('Bioengineering Minor','Bioengineering Minor'),
	('Environmental Engineering Minor','Environmental Engineering Minor'),
	('Sustainable Energy Minor','Sustainable Energy Minor'),
	('Engineering Business Minor','Engineering Business Minor'),
	('Robotics and Mechatronics Minor','Robotics and Mechatronics Minor'), 
	('Biomedical Engineering Minor','Biomedical Engineering Minor'),
	('Nanoengineering Minor','Nanoengineering Minor'),
	('Music Performance Minor','Music Performance Minor')]

    select = SelectField('Course Year:', choices=year_choices)
    top = SelectField('',choices=top)
    divisions = SelectField('Division:', choices=divisions)
    departments = SelectField('Department:', choices=departments)
    campuses = SelectField('Campus:', choices=campus)
    search = StringField('Search Terms:')
    minor_search = SelectField('Minors',choices=minors)

class CourseComparisonForm(Form):
    df = pd.read_pickle('resources/df_processed.pickle').set_index('Code')
    course_info = [('Any')] + sorted([
        (t) for t in set(df.Name.values)
    ])
    course1 = SelectField('Course 1:',choices=course_info)
    course2 = SelectField('Course 2:',choices=course_info)


class Wishlist(db.Document):
    #username = db.StringField(required=True, unique=True)
    course = db.ListField(db.ReferenceField(Course))
    comments = db.DictField()

    @classmethod
    def create(cls,username_):
        usr = cls.objects(username=username_)
        usr.update_one(set__course=[],
                       upsert=True)
        return True
    
    def add_course(self, course_):
        if course_ not in self.course:
            self.update(add_to_set__course=course_)
    
    def remove_course(self, course_):
        if course_ in self.course:
            self.course.remove(course_)
            self.save()

    def expand(self):
        ret = {
            'username': self.username,
            'course': self.course,
            'comments': self.comments
        }
        return ret


class User(db.Document):
    #username = db.StringField(required=True, unique=True)
    #password = db.StringField(required=True)

    @classmethod
    def create(cls):
        usr = cls.objects(username="curr")
        Wishlist.create("curr")
        #usr.update_one(set__username=username_, 
        #               set__password=password_,
        #               upsert=True)
        return True

    @classmethod
    def delete(cls):
        usr = cls.objects(username="curr").get()
        if usr:
            usr.delete()
            wl = Wishlist.objects(username="curr").get()
            if wl:
                wl.delete()
            return True
        return False

    #@classmethod
    #def verify_password(cls, username_, password_):
    #    usr = cls.objects(username=username_).get()
    #    if usr and usr.password == password_:
    #            return True
    #    return False
    
    @classmethod
    def get_wishlist(cls):
        return Wishlist.objects(username="curr").get()

    @classmethod
    def add_comment(cls, code_, comment_):
        usr = cls.objects(username="curr").get()
        if usr:
            usr.comments[code_] = comment_
            usr.save()
            return True
        return False


class Minor(db.Document):
    name = db.StringField(required=True, unique=True)
    description = db.StringField()
    requisites = db.ListField(db.ListField(db.ListField())) 
            #[ (['code', 'code'], 2), (['code', 'code'], 1), ] 

    @classmethod
    def get(cls, name_):
        return cls.objects(name=name_).get()
    
    @classmethod
    def check(cls, codes_):
        ret = []

        for mn in cls.objects:
            print(f"checking {mn}")
            yes = True
            for req in mn.requisites:
                if len(set(req[0]).intersection(set(codes_))) < req[1]:
                    yes = False
                    break
            if yes:
                ret.append(mn)
        return ret

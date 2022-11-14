import pandas as pd 

df = pd.read_pickle('resources/df_processed.pickle').set_index('Code')

course1 = "Shakespeare and Film"
course2 = "Introduction to Social Psychology"
tf = df.reset_index().set_index("Course")
# print(tf)

df1 = tf.loc[tf.Name==course1].reset_index()[["Course","Name","Division","Course Description","Department","Pre-requisites","Course Level","APSC Electives","Term"]]
df2 = tf.loc[tf.Name==course2].reset_index()[["Course","Name","Division","Course Description","Department","Pre-requisites","Course Level","APSC Electives","Term"]]
df_combined = pd.concat([df1,df2])
df_combined["Term"] = [','.join(map(str, l)) for l in df_combined["Term"]]

# # df1 = df.loc[df.Name==course1].reset_index()[["Code","Name","Division","Course Description","Department","Pre-requisites","Course Level","APSC Electives","Term"]]
# # df2 = df.loc[df.Name==course2].reset_index()[["Code","Name","Division","Course Description","Department","Pre-requisites","Course Level","APSC Electives","Term"]]
# # df_combined = pd.concat([df1,df2]).reset_index(drop=True)
# #df_combined = df_combined[["Code","Name","Division","Course Description","Department","Pre-requisites","Course Level","APSC Electives","Term"]]
print(df_combined["Term"])
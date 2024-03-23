import sys
import numpy as np 
import pandas as pd
df=pd.read_csv('mycsvfile.csv')

def recommend_song(last_word):
    df1=df.copy()
    df1['Lyric'] = df1['Lyric'].str.split().str[:5]
    #print(df1['Lyric'])
    rec_song=[]
    for i in range(len(df1)):
        k=df1['Lyric'][i]
        #print(k)
        for j in range(len(k)):
            if k[j].lower()==last_word.lower():
        # if last_word in df1[i]['Lyric']:
                rec_song.append([i,df1['SName'][i],df1['Genres'][i].split('; ')])
    return rec_song
#     print(rec_song)


def recommend_song_genre(word,genre):
    rec_song=recommend_song(word)
    genre=[i.lower() for i in genre]
    rec_song=[[k,j,[y.lower() for y in i]] for k,j,i in rec_song]
    ans=[]
    for i in range(len(rec_song)):
        
        lst1=list(set(genre)&set(rec_song[i][2]))
        if len(lst1)>0:
            ans.append([len(lst1),rec_song[i][0]])
    ans.sort(reverse=True)
    print(ans)
    lst=[]
    for k,s in ans:
        lst.append(s)
    print(lst)


k=list(df['Genres'])

def get_genres(df_):
    df1=df_
    genres=set()
    for i in range(len(df1)):
        subset=df1['Genres'][i]
        if isinstance(subset,float):
            print(subset)
            continue
        subset = set(subset.split('; '))
        genres|=subset
#         for j in range(len(k)):
            
#         # if last_word in df1[i]['Lyric']:
#             subset=set(df1['Genres'][i].split('; '))
#             genres|=subset
    return list(genres)
genre=get_genres(df)
def getrating():
    lst = []
    for i in range(50):
        for j in range(100):
            lst.append([i, random.randint(0,len(lyrics)), random.randint(1,30)])
    return lst
rating = getrating()
tocsv1 = pd.DataFrame(rating, columns = ['userId','songId','rating'])
tocsv1.to_csv("rating.csv",index=True,index_label = "Id")


dictt={}
for i in range(len(tocsv1)):
    
    if tocsv1['songId'][i]  in dictt.keys():
        dictt[tocsv1['songId'][i]].append([tocsv1['userId'][i],tocsv1['rating'][i]])
        #print('sdfaf')
    
    else:
        dictt[tocsv1['songId'][i]]=[[tocsv1['userId'][i],tocsv1['rating'][i]]]
   
list1=[]
dict2={}
for i in dictt.keys():
    k=dictt[i]
    list2=[0]*50
    for j in range(len(k)):
        list2[k[j][0]]=k[j][1]
    list1.append(list2)  
    dict2[i]=list2
    

m=0
for i in dict2.keys():
    if i>m:
        m=i

sample=[[0]*50 for i in range(191801)]
print(len(sample))
for i in dict2.keys():
    sample[i]=dict2[i]


import numpy as np
from sklearn.neighbors import NearestNeighbors
class recommand:
    def __init__(self,userid):
        self.userid=userid
        self.song_listened=dict_user_song[self.userid]       
        
    #def recommander(self):
        #song_listened=dict_user_song[self.userid]
        
        #ma=0
       # max_songid=0
        #for i in range(len(self.song_listened)):
         #   cur_rating=dict2[self.song_listened[i]][self.userid]
            #print(kk)
           # if cur_rating>ma:
            #    ma=cur_rating
           #     max_songid=self.song_listened[i]
            #ma=max(cur_rating,ma)
       # data=dict2[max_songid]
        
      #  return data
    
    def train(self):
        #sample=[]
        #for i in range(len())
        #samples = [[0., 0., 0.], [0., .5, 0.], [1., 1., .5]]
        ma=0
        max_songid=0
        for i in range(len(self.song_listened)):
            cur_rating=dict2[self.song_listened[i]][self.userid]
            #print(kk)
            if cur_rating>ma:
                ma=cur_rating
                max_songid=self.song_listened[i]
            #ma=max(cur_rating,ma)
        data=dict2[max_songid]
        #from sklearn.neighbors import NearestNeighbors
        neigh = NearestNeighbors(n_neighbors=5)
        
        neigh.fit(sample)
        
        #NearestNeighbors(n_neighbors=5)
        res=neigh.kneighbors([data])[1]
        #print(res)
        recommanded_song=[]
        for i in range(len(res[0])):
            print(songId[res[0][i]])
            recommanded_song.append(songId[res[0][i]])
        #return recommanded_song
        
fun=recommand(0)
#print(fun.recommander())
fun.train()
   
        
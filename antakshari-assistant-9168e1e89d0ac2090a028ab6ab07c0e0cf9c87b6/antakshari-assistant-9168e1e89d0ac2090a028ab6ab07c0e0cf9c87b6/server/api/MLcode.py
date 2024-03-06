import sys
import numpy as np 
import pandas as pd
df=pd.read_csv('mycsvfile.csv')
def valid_song(last_word):
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

def recommend_song_genre(word,genre):
    rec_song=valid_song(word)
    genre=[i.lower() for i in genre]
    rec_song=[[k,j,[y.lower() for y in i]] for k,j,i in rec_song]
    ans=[]
    for i in range(len(rec_song)):
        # print(genre)
        lst1=list(set(genre)&set(rec_song[i][2]))
        if len(lst1)>0:
            ans.append([len(lst1),rec_song[i][1],rec_song[i][0]])
    ans.sort(reverse=True)
    lst=[]
    c=0;
    for k,s,id in ans:
        c+=1;
        if c>8:
            break;
        lst.append([id,s])
    
    return lst

def getLyrics(id):
    d = list(df.get('Lyric'))
    return d[int(id)]

sys.modules[__name__] = [recommend_song_genre,df,getLyrics]
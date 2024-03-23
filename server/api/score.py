import difflib
import sys


def match(txt1,txt2):
    s = ''
    i = 0
    flag = True
    s2 = ''

    for ch in txt2:
        if(ch.isalpha()):
            s2 = s2 + ch

    while(i < len(s2)):
        if(txt1[i]=='['):
            flag = False
        if(flag and (txt1[i].isalpha())):
            s = s + txt1[i]
        if(txt1[i] == ']'):
            flag =True
        i = i+1
    # print(s2, s)
    matcher = difflib.SequenceMatcher(None, s.lower(), s2.lower())
    similarity_ratio = matcher.ratio()
    return similarity_ratio

# print(f"The similarity ratio between the two strings is {match(string1,string2)}")
sys.modules[__name__] = match
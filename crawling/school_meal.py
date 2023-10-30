# Python 3.8.10 - 64-bit

# pip3 install beautifulsoup4
# pip3 install requests
# pip3 install pymongo
# pip3 install schedule
# pip3 install pytz

# DB - database name: school_meal
# DB - collection name: seoul_new_7

import requests
from bs4 import BeautifulSoup as bs
from pymongo import MongoClient

import schedule
import time
from datetime import datetime, timedelta

import os
import json
import pytz
from enum import Enum

# TODO: 구조 변경: 모든 표의 tbody안의 tr의 갯수로 for 문 돌려서 서로 다른 유형의 데이터 가져오기

class Meal(Enum):
    BREAKFAST = "B"
    LUNCH = "L"

def getTodayDateByFormat(): # YYYY-MM-DD
    nowDate = datetime.now(pytz.timezone('Asia/Seoul'))
    return nowDate.strftime('%Y-%m-%d') # YYYY-MM-DD

def getWeeklyDateIncludedToday(): # 오늘이 포함한 이번주의 월~금의 날짜를 출력해줌.
    todayDate = datetime.now(pytz.timezone('Asia/Seoul'))
    todayWeekday  = todayDate.weekday()
    weeklyDate = []
    nowWeekday = 0
    while(len(weeklyDate) < 5):
        if (nowWeekday <= todayWeekday):
            weekdayDiff = todayWeekday - nowWeekday
            dayDiff = timedelta(hours=(24 * weekdayDiff))
            nowWeekdayDatetime = todayDate - dayDiff
            weeklyDate.append(nowWeekdayDatetime.strftime('%Y-%m-%d')) # YYYY-MM-DD
        else:
            weekdayDiff = nowWeekday - todayWeekday
            dayDiff = timedelta(hours=24 * weekdayDiff)
            nowWeekdayDatetime = todayDate + dayDiff
            weeklyDate.append(nowWeekdayDatetime.strftime('%Y-%m-%d')) # YYYY-MM-DD
        nowWeekday+=1
    return weeklyDate

def makeUrlList():
    today = getTodayDateByFormat()
    crawlingUrlList = {}
    for i in Meal:
        crawlingUrlList[i.value] = f'https://www.smu.ac.kr/kor/life/restaurantView.do?mode=menuList&srMealCategory={i.value}&srDt={today}'
    return crawlingUrlList
    
def getAllRowHtml(url):
    page = requests.get(url)
    soup = bs(page.content, "html.parser")
    mealTableHtml = soup.find('table', class_="smu-table tb-w150").find("tbody")
    mealsClass = mealTableHtml.find_all("tr")
    return mealsClass

def getOneRowMeal(oneRowHtml):
    mealNameHtml = oneRowHtml.find("th")
    mealName = mealNameHtml.text.replace(" ", "").replace("\n", "").replace("\t", "")
    
    mealDescHtmlList = oneRowHtml.find_all("ul")
    allMealDesc = getOneRowAllDesc(mealDescHtmlList)
    
    return {
        "mealName": mealName,
        "mealDescriptionList": allMealDesc
    }

def getOneRowAllDesc(oneRowMealDescList):
    allMealDescTextList = []
    for mealDesc in oneRowMealDescList:
        allMealDescTextList.append(mealDesc.text.strip("\n\t "))
    return allMealDescTextList

def getUrlMealInfoList(url):
    allMealDict = []
    mealTableHtml = getAllRowHtml(url)
    for oneRowHtml in mealTableHtml:
        oneMealDetail = getOneRowMeal(oneRowHtml)
        allMealDict.append(oneMealDetail)
    return allMealDict
        
def getSchoolMeal():
    try: 
        result = []
        weeklyDate = getWeeklyDateIncludedToday()
        crawlingUrls = makeUrlList()
        for mealTime, url in crawlingUrls.items():
            allRowMealDictList = getUrlMealInfoList(url)
            for nowRowIndex in range(len(allRowMealDictList)):
                for nowWeeklyNumber in range(len(allRowMealDictList[nowRowIndex]["mealDescriptionList"])):
                    result.append({
                            "date": weeklyDate[nowWeeklyNumber],
                            "weekday": nowWeeklyNumber+1,
                            "mealTimeType": mealTime,
                            "mealName": allRowMealDictList[nowRowIndex]["mealName"],
                            "mealDescription": allRowMealDictList[nowRowIndex]["mealDescriptionList"][nowWeeklyNumber]
                        })
                    
        client = MongoClient("mongodb://admin:capstone@localhost:27017/")
        mealDB = client["school_meal"]
        mealTable = mealDB["seoul_new_7"]
        
        mealTable.drop()
        for i in result:
            mealTable.insert_one(i)
    except Exception as e:
        print("Crawling Failed. Time:", str(datetime.now(pytz.timezone('Asia/Seoul'))))
        
    print("Crawling Done. Time:", str(datetime.now(pytz.timezone('Asia/Seoul'))))
    
if __name__ == "__main__":
    getSchoolMeal()
    schedule.every(1).days.do(getSchoolMeal)
    while True:
            schedule.run_pending()
            time.sleep(1)
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import tweepy
import tweepy.errors
import math
from tweepy import Response
from dotenv import load_dotenv
import os

load_dotenv()

# Set up the Twitter API client
consumer_key = os.getenv("CONSUMER_KEY")
consumer_secret = os.getenv("CONSUMER_SECRET")
access_token = os.getenv("ACCESS_TOKEN")
access_token_secret = os.getenv("ACCESS_TOKEN_SECRET")

# Set up the Twitter API client with OAuth 2.0 Bearer Token
bearer_token = os.getenv("BEARER_TOKEN")

client = tweepy.Client(bearer_token=bearer_token, consumer_key=consumer_key, consumer_secret=consumer_secret, access_token=access_token, access_token_secret=access_token_secret, return_type = Response,
                        wait_on_rate_limit=True)

app = FastAPI()


sentiment_analyzer = pipeline("sentiment-analysis")

# Assume you have a separate credibility analysis function
misinformation_detector = pipeline("text-classification", model="jy46604790/Fake-News-Bert-Detect")

class UserProfile(BaseModel):
    username: str

# Assume you have a separate credibility analysis function
def analyze_credibility(user_profile: str, sentiment_score: float, misleading_tweets: list):
    max_followers = 1000000  # Maximum number of followers to consider for engagement score
    max_tweets = 10000  # Maximum number of tweets to consider for engagement score

    # Engagement score based on profile metrics
    engagement_score = (user_profile["followers_count"] / max_followers) + \
                       (user_profile["tweets_count"] / max_tweets)

    misleading_penalty = len(misleading_tweets) * 2

    raw_score = 0.6 * engagement_score + 0.3 * sentiment_score - misleading_penalty

    # Final credibility score using weighted average
    # Apply sigmoid function to normalize the score between 0 and 1
    credibility_score = 1 / (1 + math.exp(-raw_score))

    return round(credibility_score, 2)

    

class TweetData(BaseModel):
    text: str
    userProfile: str

def analyze_sentiment(text):
    sentiment = sentiment_analyzer(text)[0]  # Get the first (and only) result from the pipeline
    return sentiment['label'], sentiment['score']


def analyze_misinformation(text):
    result = misinformation_detector(text)
    return result[0]['label'], result[0]['score']


@app.post("/getUserData")
async def get_user_data(user_profile: UserProfile):
    # Get user data
    try:
        user_response = client.get_user(
            username=user_profile.username,
            user_fields=["name", "username", "description", "public_metrics"]
        )
        user = user_response.data

        # Fetch the 10 most recent tweets
        tweets_response = client.get_users_tweets(user.id, max_results=10, tweet_fields=["created_at", "text"])
        tweets = tweets_response.data if tweets_response.data else []

         # Analyze sentiment for each tweet
        sentiment_scores = []
        misleading_tweets = []
        tweets_with_sentiment = []
        
        for tweet in tweets:
            sentiment_label, sentiment_score = analyze_sentiment(tweet.text)  # Assuming the sentiment analysis API returns a list of dictionaries
            misinfo_label, misinfo_score = analyze_misinformation(tweet.text)

            if misinfo_label == "LABEL_0" and misinfo_score > 0.8:  # Threshold for confidence
                misleading_tweets.append(tweet.text)

            tweets_with_sentiment.append({
                "text": tweet.text,
                "created_at": tweet.created_at,
                "sentiment": sentiment_label,
                "sentiment_score": sentiment_score,
                "misinfo_label": misinfo_label,
                "misinfo_score": misinfo_score,
            })
            sentiment_scores.append(sentiment_score)
        
        # Calculate average sentiment score
        average_sentiment_score = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0

        profile_data = {
            "name": user.name,
            "username": user.username,
            "bio": user.description,
            "followers_count": user.public_metrics["followers_count"],
            "following_count": user.public_metrics["following_count"],
            "tweets_count": user.public_metrics["tweet_count"],
        }

        # Calculate the credibility score using the average sentiment score
        credibility_score = analyze_credibility(profile_data, average_sentiment_score, misleading_tweets)

        user_data = {
            "name": user.name,
            "username": user.username,
            "bio": user.description,
            "followers_count": user.public_metrics["followers_count"],
            "following_count": user.public_metrics["following_count"],
            "tweets_count": user.public_metrics["tweet_count"],
            "credibility_score": credibility_score,
            "tweets": tweets_with_sentiment
        }


        return user_data
    except tweepy.TweepyException as e:
        return {"error": str(e)}
    

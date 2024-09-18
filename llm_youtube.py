import streamlit as st
from streamlit_extras.stateful_button import button
import requests
from collections import defaultdict


st.set_page_config(layout="wide")
st.markdown("""
<style>
.big-font {
    font-size:300px !important;
}
</style>
""", unsafe_allow_html=True)

COUNTRIES = {'KR':'ko', 'US':'en', 'SG':'en', 'TW':'zh', 'TH':'th', 'JP':'ja' }
CATEGORIES = {
        'All':'0', 'Film & Animation':'1', 'Autos & Vehicles':'2', 'Music':'10', 'Pets & Animals':'15',
    'Sports':'17', 'Gaming':'20', 'People & Blogs':'22', 'Entertainment':'24', 'News & Politics':'25',
    'Howto & Style':'26', 'Science & Technology':'28'
    }

st.subheader("Youtube Videos Trend Analysis")
st.markdown("Trend Analysis Service for Popular Youtube Videos")

trend_summary = None
global_view = defaultdict(list)
st.session_state.summary = None

if 'clicked' not in st.session_state:
    st.session_state.clicked = 0

def call_apigee(country, lang, category):
    params = {
        'country': country,
    'lang': lang,
    'category': category,
    'model': 'gemini-1.5-pro',
    'apikey': '{API_KEY}'
    }

    url = "{API_PROXY_URL}"
    x = requests.get(url, params=params)
    response = x.json()
    
    #print(response)
    try:
        videos = response["items"]

        images = []

        trend_summary = response["gemini"]
        st.session_state.summary = response["gemini"]

        for video in videos:
            images.append({
                'title': video['snippet']['title'],
                'video_id': video['id'],
                'channel_id': video['snippet']['channelId'],
                'channel_title': video['snippet']['channelTitle'],
                'url': video['snippet']['thumbnails']['medium']['url'],
                'category_id': video['snippet']['categoryId'],
                'live': video['snippet']['liveBroadcastContent']
            })
        return images
    except Exception as e:
        st.markdown('   ')
        st.subheader( response["fault"]["message"] )
        #st.stop()

def gemini_clicked(country_code, category_id, stage):
    print('stage')
    print(stage)
    if st.session_state.clicked == 0:
        st.session_state.clicked = stage
        print('clicked = 0')
        print(st.session_state.clicked)
    else:
        print('clicked not 0')
        print(stage)
        st.session_state.clicked = 1
        global_view[country_code] = call_apigee(country_code, COUNTRIES[country_code],  CATEGORIES[category_id])  # ( country_code, lang_code, category_code )

        try:
            for country_code, videos in global_view.items():
                videos = videos[:10]
                st.text(f"Top 10 Popular videos in {country_code}")
                cols = st.columns(5)
                for idx, video in enumerate(videos):
                    with cols[idx % 5]:
                        container = st.container(height=250)
                        container.image(video['url'], use_column_width=True)
                        container.caption(f"{video['title']} / {video['channel_title']}")
            st.markdown(st.session_state.summary)
            print('processed retrun value from apigee')
        except Exception as e:
            st.markdown('')

def selected():
    # do nothing
    if st.session_state.clicked == 2:
        st.session_state.clicked = 1
    else:
        st.session_state.clicked = 0
    print("select something")


#selected_country = st.sidebar.selectbox("Countries", COUNTRIES.values(), on_change=selected )
selected_country = st.sidebar.selectbox("Countries", COUNTRIES.keys(), on_change=selected )
selected_category = st.sidebar.selectbox("Video Categories", CATEGORIES.keys(), on_change=selected)


if st.session_state.clicked in [0, 1]:
    stage = st.session_state.clicked+1
    print('in button')
    print(stage)
    add_button = st.sidebar.button("Video Trend Analysis", on_click=gemini_clicked(selected_country, selected_category, stage ))


if st.session_state.clicked == 2:
    print('ok clicked')

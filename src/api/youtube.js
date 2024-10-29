import axios from "axios";

const youtubeAPI = axios.create({
  baseURL: `https://youtube.googleapis.com/youtube/v3`,
  params: {
    key: process.env.REACT_APP_YOUTUBE_API_KEY,
  },
});

export const getYoutubeList = async () => {
  try {
    const response = await youtubeAPI.get("/videos", {
      params: {
        part: "snippet,statistics",
        chart: "mostPopular",
        maxResults: 25,
      },
    });
    return response.data.items;
  } catch (error) {
    console.log(error);
  }
};

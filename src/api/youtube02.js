import axios from "axios";


export const getFakemostPopular = async () => {
    return axios.get(`/data/popular.json`).then((res) => res.data.items);
  }


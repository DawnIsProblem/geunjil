import axios from 'axios';
import {GOOGLE_API_KEY} from '@env';

export const searchPlaces = async (query: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query,
  )}&key=${GOOGLE_API_KEY}`;
  const res = await axios.get(url);
  return res.data.results;
};

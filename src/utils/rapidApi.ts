import axios, {AxiosResponse} from 'axios';
import {environment} from "../config/environment";

function getRapidApiHeader(apiName: string) {
  return {
    'x-rapidapi-host': environment.rapidApi[apiName].host,
    'x-rapidapi-key': environment.rapidApi[apiName].key
  };
}

export function urbanDefine(word: string): Promise<AxiosResponse> {
  return axios({
    method: 'GET',
    url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
    headers: getRapidApiHeader("urbanDictionary"),
    params: {term: word},
    responseType: 'json'
  });
}

export function normalDefine(word: string): Promise<AxiosResponse> {
  return axios({
    method: 'GET',
    url: `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`,
    headers: getRapidApiHeader("wordsApi"),
    responseType: 'json'
  });
}
import axios, {AxiosResponse} from 'axios';
import {environmentAsync} from "../config/environment";

async function getRapidApiHeader(apiName: string) {
  const config = await environmentAsync;
  return {
    'x-rapidapi-host': config.rapidApi[apiName].host,
    'x-rapidapi-key': config.rapidApi[apiName].key
  };
}

export async function urbanDefine(word: string): Promise<AxiosResponse> {
  return axios({
    method: 'GET',
    url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
    headers: await getRapidApiHeader("urbanDictionary"),
    params: {term: word},
    responseType: 'json'
  });
}

export async function normalDefine(word: string): Promise<AxiosResponse> {
  return axios({
    method: 'GET',
    url: `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`,
    headers: await getRapidApiHeader("wordsApi"),
    responseType: 'json'
  });
}

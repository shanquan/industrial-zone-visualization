import axios from 'axios'
import {Message} from 'element-ui'

if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = '/api/'
}else{
  axios.defaults.baseURL = '/'
}

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const MODELS=['zone','building','floor','workshop','profit']

axios.interceptors.response.use(function (response) {
  if(response.data.code){
    Message.error('code:' + response.data.code + ',message:' + response.data.message);
    return Promise.reject(response.data);
  }else{
    return response.data;
  }
},
function (error) {
  Message.error('code:0,message:' + error.toString());
  return Promise.reject({
    code: 0,
    message: error
  });
});

export default{
  getData(model,id){
    if (model && MODELS.includes(model)){
      id = id?id:'';
      let promise = axios.get(`${model}/${id}`);
      return promise;
    }
  },
  queryData(model, params) { // ref: https://sailsjs.com/documentation/reference/blueprint-api/find-where
    if (model && MODELS.includes(model)) {
      let promise = axios.get(`${model}?${params}`);
      return promise;
    }
  },
  postData(model,data){//data format: key1=value1&key2=value2
    if (model && MODELS.includes(model)) {
      let promise = axios.post(model, data);
      return promise;
    }
  },
  updateData(model,id,data){
    if (model && MODELS.includes(model)) {
      let promise = axios.patch(`${model}/${id}`, data);
      return promise;
    }
  },
  deleteData(model,id){
    if (model && MODELS.includes(model)) {
      let promise = axios.delete(`${model}/${id}`);
      return promise;
    }
  },
  upload(model,formData) {
    if (model && MODELS.includes(model)) {
      let promise = axios.post('upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return promise;
    }
  }
}
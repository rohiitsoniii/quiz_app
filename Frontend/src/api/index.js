// src/api/index.js
import axiosInstance from "./axiosInstance";
import { getErrorMessage } from "./errorHandler";

const buildQueryString = (params) => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

const transformToFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

export const fetchGetData = async (endpoint, params = {}, token = null) => {
  const queryString = buildQueryString(params);
  const url = `${endpoint}?${queryString}`;
  try {

    const config = {
      headers: {},
    };

    // Add Authorization header if token is provided
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    const response = await axiosInstance.get(url, config);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};

export const updateData = async (endpoint, data = {}) => {
  try {
    const formData = transformToFormData(data);

    const response = await axiosInstance.put(endpoint, formData);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};

export const postData = async (endpoint, data = {}, token = null) => {
  const formData = transformToFormData(data);
  try {
    const config = {
      headers: {},
    };

    // Add Authorization header if token is provided
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axiosInstance.post(endpoint, formData, config);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.log(errorMessage)
    throw new Error(errorMessage);
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};


export const patchData = async (endpoint, data = {}) => {

  try {
    const formData = transformToFormData(data);

    const response = await axiosInstance.patch(endpoint, formData);
    return response.data;
  } catch (error) {

    const errorMessage = getErrorMessage(error);

    throw new Error(errorMessage);
  }
};
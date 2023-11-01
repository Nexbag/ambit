import axios, { AxiosError } from "axios";

export const postRequest = async (url: string, data: any, token?: string) => {
  try {
    const { data: info } = await axios.post(url, data, { headers: { token } });
    return { message: "success", success: true, data: info };
  } catch (err) {
    const error = err as AxiosError;
    const data = error.isAxiosError
      ? (error.response!.data as { message: string })
      : ({ message: "Some error occured" } as { message: string });
    return { message: data.message, success: false, data: null };
  }
};
export const putRequest = async (url: string, data: any, token?: string) => {
  try {
    const { data: info } = await axios.put(url, data, { headers: { token } });
    return { message: "success", success: true, data: info };
  } catch (err) {
    const error = err as AxiosError;
    const data = error.isAxiosError
      ? (error.response!.data as { message: string })
      : ({ message: "Some error occured" } as { message: string });
    return { message: data.message, success: false, data: null };
  }
};
export const getRequest = async (url: string, token?: string) => {
  try {
    const { data: info } = await axios.get(url, {
      headers: { token },
    });
    return { message: "success", success: true, data: info };
  } catch (err) {
    const error = err as AxiosError;
    const data = error.isAxiosError
      ? (error.response!.data as { message: string })
      : ({ message: "Some error occured" } as { message: string });
    return { message: data.message, success: false, data: null };
  }
};
export const deleteRequest = async (url: string, token?: string) => {
  try {
    const { data: info } = await axios.delete(url, {
      headers: { token },
    });
    return { message: "success", success: true, data: info };
  } catch (err) {
    const error = err as AxiosError;
    const data = error.isAxiosError
      ? (error.response!.data as { message: string })
      : ({ message: "Some error occured" } as { message: string });
    return { message: data.message, success: false, data: null };
  }
};

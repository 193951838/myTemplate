import axios from 'axios';
import { AjaxMethods } from 'common/interface/enums';

export default class Ajax {
  /**
   * token
   */
  static get token() {
    return localStorage.getItem('agent-token');
  }

  /**
   * ajax query
   * @param param0
   */
  static async query(data) {
    const { url, method = AjaxMethods.GET, params = {}, type = 'form' } = data;
    const formData = new FormData();
    const isForm = type === 'form' && method !== AjaxMethods.GET;

    if (isForm && params) {
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });
    }

    try {
      const result = await axios({
        url,
        method: method,
        headers: {
          Authorization: Ajax.token,

          'Content-Type': `application/${
            type === 'body' ? 'json' : 'x-www-form-urlencoded'
          }`,
        },
        data: isForm ? formData : params,
        params: method === AjaxMethods.GET ? params : undefined,
      });

      if (result.status !== 200 || !result.data.result) throw result;

      if (data.isCheckData && !result.data.data) {
        throw result;
      }
      return result.data.data;
    } catch (e) {
      // ajax请求失败，异常处理
      const error = e.response || e;

      console.error('ajax failed:', error);

      throw error;
    }
  }

  /**
   * 上传文件
   * @param param0
   */
  static async upload({ url, params, onProgress = () => {} }) {
    const source = axios.CancelToken.source();
    try {
      const result = await axios.post(url, params, {
        cancelToken: source.token,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: Ajax.token,
        },
        onUploadProgress(p) {
          if (onProgress) onProgress(100 * (p.loaded / p.total));
        },
      });

      if (result.status !== 200 || !result.data.result) throw result;

      return {
        data: result.data.data,
        abort: source.cancel, // 取消
      };
    } catch (e) {
      // ajax请求失败，异常处理
      const error = e.response || e;

      console.error('ajax failed:', error);

      throw e;
    }
  }
}

import * as IShare from '../shares/interfaces';

export default abstract class LocalStorageHelper {
  /**
   * @description Set localstorage with exp
   * @public
   * @static
   * @param {string} key
   * @param {IShare.IStoreContent} val
   * @param {number} ttl
   * @returns {void}
   */
  public static setWithExpiry(key: string, val: IShare.IStoreContent, ttl: number): void {
    if (val.token) {
      const data = {
        value: val.token,
        exp: Date.now() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      const data = {
        value: val,
        exp: Date.now() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * @description Get localstorage with exp
   * @public
   * @static
   * @param {string} key
   * @returns {IShare.TStorageDataVal | unknown}
   */
  public static getWithExpiry(key: string): IShare.TStorageDataVal | unknown {
    const dataStr = localStorage.getItem(key);
    if (!dataStr) return null;
    const parsedData: IShare.IStorageData = JSON.parse(dataStr);
    const now = Date.now();

    if (now > parsedData.exp) {
      localStorage.removeItem(key);
      return null;
    }
    return parsedData.value;
  }
}

import swal from 'sweetalert2';
import * as IShare from '../shares/interfaces';

export default abstract class ComponentHelper {
  /**
   * @description Parese Validation Message
   * @static
   * @public
   * @param {IShare.IValidationFail[]} errors
   * @returns {string}
   */
  public static parseValidationErrorMsg(errors: IShare.IValidationFail[]): string {
    let msg = '';
    for (let i = 0; i < errors.length; ++i) {
      const error: IShare.IValidationFail = errors[i];
      const constraintsKey = Object.keys(error.constraints);
      msg += `${error.property}: ${error.constraints[constraintsKey[0]]}\n`;
    }
    return msg;
  }

  /**
   * @description Alert Helper
   * @static
   * @public static
   * @param {string} title
   * @param {string} text
   * @param {'success' | 'error'} icon
   * @returns {Promise<any>}
   */
  public static alertMsg(title: string, text: string, icon: 'success' | 'error'): Promise<any> {
    return swal.fire({
      title,
      text,
      timer: 2000,
      icon,
    });
  }

  /**
   * @description Alert Helper without Icon
   * @static
   * @public static
   * @param {string} title
   * @param {string} text
   * @returns {Promise<any>}
   */
  public static alertMsgWithoutIcon(title: string, text: string) {
    return swal.fire({
      title,
      text,
      timer: 1000,
    });
  }
}

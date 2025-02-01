/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */
  static URL = '/account';

  static get(id = '', callback) {
    return createRequest({
      url: this.URL,
      method: 'GET',
      responseType: 'json',
      data: id,
      callback: (err, response) => {
        if (response.success) {
        } else {
          console.log(err);
        }
        callback( err, response );
      }
    });
  }
}
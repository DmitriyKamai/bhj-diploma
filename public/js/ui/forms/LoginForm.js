/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    function loginUser(err, response) {
      if (response && response.user) {
        App.setState('user-logged');
      } else {
        console.log(err);
      }
    }
  User.login(data, loginUser);
  const modal = App.getModal('login');
  this.element.reset();
  modal.close();
  }
}
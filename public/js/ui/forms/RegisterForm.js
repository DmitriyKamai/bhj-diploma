/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    function loginUser(err, response) {
        if (response && response.user) {
          App.setState('user-logged');
        } else if (err) {
          console.log(err);
        }
      }
    User.register(data, loginUser);
    this.element.reset();
    const modal = App.getModal('register');
    modal.close();
  }
}
/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(null, (err, response) => {
      if (response && response.data) {
        const accountsSelects = [...document.querySelectorAll('.accounts-select')];
        accountsSelects.forEach(element1 => {
          element1.innerHTML = "";
          response.data.forEach(element2 => {
            element1.insertAdjacentHTML('beforeend', `<option value="${element2.id}">${element2.name}</option>`);
          })
        })
      } else if (err) {
        console.log(err);
      }});
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const modalId = this.element.closest('.modal').getAttribute('data-modal-id');
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        App.update();
        const modal = App.getModal(modalId);
        modal.close();
      } else if (err) {
        console.log(err);
      };
    });
    this.element.reset();
  }
}
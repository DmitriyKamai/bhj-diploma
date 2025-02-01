/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      console.log('Error: element undefined');
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const createExpense = document.querySelector('.create-expense-button');
    const createIncome = document.querySelector('.create-income-button');

    createExpense.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = App.getModal('newExpense');
      modal.open();
    })

    createIncome.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = App.getModal('newIncome');
      modal.open();
    })
  }
}

/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      console.log('Error: element undefined');
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (localStorage.getItem('lastOptions')) {
      try {
        const lastOptions = JSON.parse(localStorage.lastOptions);
        this.render(lastOptions);
      } catch {
        new Error('Error');
      }
    };
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const deleteAccount = document.querySelector('.remove-account');

    deleteAccount.addEventListener('click', (e) => {
      e.preventDefault();
      this.removeAccount();
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (localStorage.getItem('lastOptions')) {
      try {
        const contentTitle = document.querySelector('.content-title');
        const lastOptions = JSON.parse(localStorage.lastOptions);
        if (confirm(`Желаете удалить счёт ${contentTitle.textContent}?`)) {
          const data = new FormData;
          data.append('id', lastOptions.account_id);
          Account.remove(data, (err, response) => {
            if (response && response.success) {
              this.clear([]);
              App.updateWidgets();
              App.updateForms();
            } else if (err) {
              console.log(err);
            };
          });
          this.clear();
        }
      } catch {
        new Error('Error');
      }
    };

    
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id, name) {
    if (confirm(`Желаете удалить транзакцию ${name}?`)) {
      const data = new FormData;
      data.append('id', id);
      Transaction.remove(data, (err, response) => {
        if (response && response.success) {
          App.update();
        } else if (err) {
          console.log(err);
        };
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      localStorage.setItem('lastOptions', JSON.stringify(options));
      const data = new FormData;
      data.append('account_id', options.account_id);
      Account.get(options.account_id, (err, response) => {
        if (response && response.success) {
          this.renderTitle(response.data.name);
        } else if (err) {
          console.log(err);
        };
      });
      Transaction.list(data, (err, response) => {
        if (response && response.success) {
          this.renderTransactions(response.data)
        } else if (err) {
          console.log(err);
        };
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    const contentTitle = document.querySelector('.content-title');
    contentTitle.textContent = 'Название счёта';  
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const contentTitle = document.querySelector('.content-title');
    contentTitle.textContent = name;  
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateInMs = Date.parse(date);
    const newDate = new Date(dateInMs);
    const year = newDate.getFullYear();
    const month = getMonthNameInGenitiveCase(newDate.getMonth());
    const day = newDate.getDate();
    const hours = addZero(newDate.getHours());
    const minutes = addZero(newDate.getMinutes());

    function getMonthNameInGenitiveCase(month) {
      const monthsArr = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
      ];
      return monthsArr[month];
    }
    function addZero(item) {
      if (item < 10) {
       return '0' + item;
      } else {
        return item
      }
    }
    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${item.id}" data-name="${item.name}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const contentElement = document.querySelector('.content');
    contentElement.innerHTML = "";
    if (data.length) {
      data.forEach(element => {
        contentElement.insertAdjacentHTML('beforeend', this.getTransactionHTML(element));
      })
      const deleteTransaction = [...document.querySelectorAll('.transaction__remove')];
      if (deleteTransaction.length) {
        deleteTransaction.forEach(element => {
          element.addEventListener('click', (e) => {
            e.preventDefault();
            this.removeTransaction(e.currentTarget.dataset.id, e.currentTarget.dataset.name);
          })
        })
      }
    }
  }
}
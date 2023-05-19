import {openModal, closeModal} from './modal';
import { postData } from '../services/services';

function forms(formSelector, modalTimerId) {

    const forms = document.querySelectorAll(formSelector);    //Получаем формы 

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с Вами свяжемся',
        failure: 'Что-то пошло не так'
    };

    forms.forEach(item => { //Вешаем функцию bindPostData на каждую форму
        bindPostData(item);
    });

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();                                         //Отменяем стандартное поведение браузера
            
            const statusMessage = document.createElement('img');          //Создаём элемент картинку
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);  //Помещаем картинку на страницу после элемента, вызвавшего событие

    /*             const request = new XMLHttpRequest();                        //Создаём новый объект для HTTP запроса
            request.open('POST', 'server.php');                          //Указываем тип запроса и URL
            request.setRequestHeader('Content-type', 'application/json');   //ДЛЯ ПЕРЕДАЧИ В JSON !!!! только эта строка нужна. */

            const formData = new FormData(form);                         //Создаём новый объект FormData со значениями нашей формы

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });

            //request.send(json);                                     //ДЛЯ ПЕРЕДАЧИ В JSON !!!! только эта строка нужна.

            /* request.send(formData); */                                     //Отправляем запрос на сервер

    /*             request.addEventListener('load', () => {                     //Навешиваем обработчик на запрос
                if(request.status === 200) {                            // Если статус ОК
                    console.log(request.response);
                    showThanksModal(message.success);            // Сообщаем об этом 

                    form.reset();                                           //Очищаем форму
                    statusMessage.remove();                             //Убираем сообщение

                } else {
                    showThanksModal(message.failure);
                }
            }); */
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.style.display = 'none';
        openModal('.modal', modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class = "modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.style.display = 'block';
            closeModal('.modal');
        }, 4000);
    }
}

export default forms;
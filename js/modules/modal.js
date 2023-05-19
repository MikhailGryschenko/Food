function openModal (modalWindowSelector, modalTimerId) {
    const modalWindow = document.querySelector(modalWindowSelector);
    modalWindow.style.display = 'block';
    document.body.style.overflow = 'hidden'; //Отключаем прокрутку (скрол), когда открыто модальное окно
    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
}

function closeModal (modalWindowSelector) {
    const modalWindow = document.querySelector(modalWindowSelector);
    modalWindow.style.display = 'none';
    document.body.style.overflow = '';                  //Восстанавливаем прокрутку (скрол), когда закрыто модальное окно
}

function modal(btnOpenSelector, modalWindowSelector, modalTimerId) {

    const btnOpen = document.querySelectorAll(btnOpenSelector),
        modalWindow = document.querySelector(modalWindowSelector);

    btnOpen.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalWindowSelector, modalTimerId));           //НЕ ВЫЗЫВАЕМ функцию, а только передаём. Будет вызвана после клика.
    });

    modalWindow.addEventListener('click', (e) => {
        if(e.target === modalWindow || e.target.getAttribute('data-close') == '') {
            closeModal (modalWindowSelector); 
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modalWindow.style.display === 'block') {
            closeModal(modalWindowSelector);
        }
    });

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal(modalWindowSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {openModal};
export {closeModal};


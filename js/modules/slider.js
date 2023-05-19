function slider({container, slides, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {  //Деструктуризация!!! круто!
    // Slider

    const slide = document.querySelectorAll(slides),
    slider = document.querySelector(container),
    //slideParent = document.querySelector('.offer__slider-counter'),
    prev = document.querySelector(prevArrow),
    next = document.querySelector(nextArrow),
    currentNum = document.querySelector(currentCounter),
    totalNum = document.querySelector(totalCounter),
    slideWrapper = document.querySelector(wrapper),
    slideField = document.querySelector(field),
    width = window.getComputedStyle(slideWrapper).width;

    let slideActiveNow = 1;
    let offset = 0;

    if(slide.length < 10) {
        totalNum.textContent = `0${slide.length}`;
        currentNum.textContent = `0${slideActiveNow}`;
    } else {
        totalNum.textContent = slide.length;
        currentNum.textContent = slideActiveNow;
    }

    slideField.style.width = 100 * slide.length + '%';
    slideField.style.display = 'flex';
    slideField.style.transition = '0.5s all';
    slideWrapper.style.overflow = 'hidden';     //Скрываем все элементы, которые не попадают в область видимости

    slide.forEach(item => {                     // устанавливаем ширину каждого слайда, чтобы одинаковая была
        item.style.width = width;
    });

    slider.style.position = 'relative'; //для того, чтобы точкам потом присвоить position: absolute

    const indicators = document.createElement('ol'),    // создаём нумерованный список для точек (обёртка для наших точек)
        dots = [];                                  // создаём массив для записи в него точек после их создания
    indicators.classList.add('carousel-indicators');     // добавляем класс для этого списка
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;                                                  // стилизуем блок с точками
    slider.append(indicators);                          // помещаем блок на страницу

    for(let i = 0; i < slide.length; i++) {                 // создаём сами точки (по количеству слайдов)
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);       // устанавливаем каждой точке атрибут, чтобы потом привязать её к конкретному слайду
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;                                              // стилизуем точку
        if(i == 0) {                                    // выделяем точку нулевого слайда, делаем её не прозрачной
            dot.style.opacity = 1;
        }
        indicators.append(dot);                         // помещаем точку в блок indicators
        dots.push(dot);                                 // добавляем каждую точку в массив
    }

    function deleteNotDigits (str) {                    // создаём функцию, кот принимает строку и возвращает всё, кроме НЕ ЦИФР, т.е. отрезает PX
        return +str.replace(/\D/g, '');
    }
    
    next.addEventListener('click', () => {
        if(offset == deleteNotDigits(width) * (slide.length - 1)) {  //ширина одного слайда * кол-во слайдов минус один
            offset = 0;
        } else {
            offset += deleteNotDigits(width);    // лучше исп-ть рег. выраж: +width.replace(/\D/g, ''), т.е. НЕ числа заменим на пустую строку (удалим)
        }
        slideField.style.transform = `translateX(-${offset}px)`;

        if(slideActiveNow == slide.length) {
            slideActiveNow = 1;
        } else {
            slideActiveNow ++;
        }

        if(slide.length < 10) {
            currentNum.textContent = `0${slideActiveNow}`;
        } else {
            currentNum.textContent = slideActiveNow;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideActiveNow - 1].style.opacity = 1;

    });

    prev.addEventListener('click', () => {
        if(offset == 0) {
            offset = deleteNotDigits(width) * (slide.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }
        slideField.style.transform = `translateX(-${offset}px)`;

        if(slideActiveNow == 1) {
            slideActiveNow = slide.length;
        } else {
            slideActiveNow --;
        }

        if(slide.length < 10) {
            currentNum.textContent = `0${slideActiveNow}`;
        } else {
            currentNum.textContent = slideActiveNow;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideActiveNow - 1].style.opacity = 1;

    });

    dots.forEach(dot => {                                           // перебираем все точки
        dot.addEventListener('click', (e) => {                      // вешаем обработчик событий на каждую точку
            const slideTo = e.target.getAttribute('data-slide-to'); // получаем атрибут (его значение) у нажатой точки

            slideActiveNow = slideTo;                               // подписываем номер активного слайда соответств. номером точки

            offset = deleteNotDigits(width) * (slideTo - 1);        // определяем переменную на сколько смещать слайды
            slideField.style.transform = `translateX(-${offset}px)`;    // смещаем на эту величину

            if(slide.length < 10) {                                     // подставляем 0 перед номером слайда, если меньше 10
                currentNum.textContent = `0${slideActiveNow}`;
            } else {
                currentNum.textContent = slideActiveNow;
            }

            dots.forEach(dot => dot.style.opacity = '.5');              // все точки полупрозрачные
            dots[slideActiveNow - 1].style.opacity = 1;                 // точка активного слайда - не прозрачная
        });
    });

/*     function numbers (a) {
        currentNum.textContent = a;
        totalNum.textContent = getZero(slide.length);
    }

    numbers(getZero(slideActiveNow));

    function hideSlide () {
        slide.forEach(item => {
            item.style.display = 'none';
        });
    }

    hideSlide();

    function showSlide (i) {
        slide[i].style.display = 'block';
    }

    showSlide(slideActiveNow - 1);

    slideParent.addEventListener('click', (event) => {
        const target = event.target;
        if(target == next) {
            hideSlide();
            if(slideActiveNow == slide.length) {
                slideActiveNow = 1;
            } else {
                slideActiveNow += 1;
            };
            showSlide(slideActiveNow - 1);
            numbers(getZero(slideActiveNow));
        };
        if(target == prev) {
            hideSlide();
            if(slideActiveNow == 1) {
                slideActiveNow = slide.length;
            } else {
                slideActiveNow -= 1;
            };
            showSlide(slideActiveNow - 1);
            numbers(getZero(slideActiveNow));
        }
    }); */
}

export default slider;
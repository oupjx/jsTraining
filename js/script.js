window.addEventListener('DOMContentLoaded', () =>{

    //tab
    const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

    function hide(){
        tabsContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    

    tabsParent.addEventListener('click', (Event) =>{
        const target = Event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) =>{
                if(target == item){
                    hide();
                    showTabContent(i);
                }
            });
        }
    });
    hide();
    showTabContent();

    //timer

    const deadline = '2021-05-28';

    function getTimeRemaining(endtime){
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)), 
              hours = Math.floor(t / (1000 * 60 * 60) % 24), 
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000 ) % 60);

        return{
            'total': t,
            'days':days,
            'hours':hours,
            'minutes':minutes,
            'seconds':seconds
        };
    }

    function getZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        }else{
            return num;
        }
    }

   

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
              updateClock();
        function updateClock(){
            const t = getTimeRemaining(endtime);
            if(t.total < 0){
                days.innerHTML = "00";
                hours.innerHTML = "00";
                minutes.innerHTML = "00";
                seconds.innerHTML = "00";
            }else{
                days.innerHTML = getZero(t.days);
                hours.innerHTML = getZero(t.hours);
                minutes.innerHTML = getZero(t.minutes);
                seconds.innerHTML = getZero(t.seconds);
            }
        
            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer',deadline );

    // Modal
    const modal = document.querySelector('.modal'),
        btnOpen = document.querySelectorAll('[data-modal]');

    function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = "hidden";
        clearInterval(modalTimerId);
    }

    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = "";
    }

    btnOpen.forEach(btn => {
        btn.addEventListener('click', openModal);
    });
    

    modal.addEventListener('click', (e) =>{
        if(e.target === modal || e.target.getAttribute('data-close') == ""){
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) =>{
        if(e.code === 'Escape' && modal.classList.contains('show')){
            closeModal();
            console.log("gg");
        }
    });

    const modalTimerId = setTimeout(openModal, 2000);
    
    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll',showModalByScroll )
       }
    }

    window.addEventListener('scroll',showModalByScroll );

    // классы
    class Menucard{
        constructor(src, alt, title, descr, price, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUah();
        }

        changeToUah(){
            this.price = +this.price * this.transfer;
        }

        render(){
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.element = 'menu__item';
                element.classList.add(this.element);
            }else{
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
            
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                
            `;
            this.parent.append(element);
        }
    }

    new Menucard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню "Фитнес"',
        'В меню “Премиум” мы используем не только красивый дизайн упако',
        45,
        '.menu .container',
        'menu__item'
        
    ).render();

    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'icons/spinner.svg',
        success: "Душевно",
        failed: "Что-то пошло не так"
    };

    forms.forEach(item =>{
        bindpostData(item);
    })

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
    
        return await res.json();
    };

    function bindpostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMsg = document.createElement('img');
            statusMsg.src = message.loading;
            statusMsg.style.cssText= `
             display: block;
             margin: 0 auto;
            `;  
            form.insertAdjacentElement('afterend', statusMsg);
        
            // request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            
            postData('http://localhost:3000/requests', JSON.stringify(Object))
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                form.reset();
                statusMsg.remove();
            }).catch(() =>{
                showThanksModal(message.failure);
            }).finally(() =>{
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        //openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            //prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
            
        }, 2000);
    }
});
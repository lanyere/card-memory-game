(() => {

    function generatePairedNumbers(n) {
        let result = [];
        if (n < 2 || n > 10 || n % 2 !== 0) {
            return;
        }

        switch (n) {
            case 4: n *= 2; break;// 4 * 2 = 8, 4 пары
            case 6: n *= 4; break; // 6 * 4 = 36, 6 пар
            case 8: n *= 8; break; // 8 * 8 = 64, 8 пар
            case 10: n *= 10; break; // 10 * 10 = 100, 10 пар
        }

        for (let i = 1; i <= n; i++) { // цикл до числа n
            result.push(i, i); // добавляю два числа в массив
        }

        return result;
    }

    function shuffleNumbers(arr) {
        for (let i = arr.length - 1; i > 0; i--) { // от последнего элемента в массиве, как в алгоритме Фишера Йейтса
            let j = Math.floor(Math.random() * (i + 1)); 
    
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }
    
    function setLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getLocalStorage(key) {
        let data = localStorage.getItem(key);
        data = data ? JSON.parse(data) : [];
        return data;
    }

    function isCardsLeft() {
        const cards = document.querySelectorAll('.card');
    
        for (const card of cards) {
            if (!card.classList.contains('match')) {
                return true;
            }
        }
    
        return false;
    }

    function setCardEvent(item) {
        let card = item.children[0];
        card.classList.toggle('closed');
        
        setTimeout(() => {
            let openedCards = getLocalStorage(LOCAL_STORAGE_KEY);

            if (openedCards.includes(card.dataset.id) || (card.classList.contains('match'))) {
                return;
            }
    
            openedCards.push(item.dataset.id);
            setLocalStorage(LOCAL_STORAGE_KEY, openedCards);
    
            if (openedCards.length === 2) {
                const firstId = openedCards[0];
                const secondId = openedCards[1];
    
                setLocalStorage(LOCAL_STORAGE_KEY, []);
    
                const firstCard = document.querySelector(`.item[data-id="${firstId}"`);
                const secondCard = document.querySelector(`.item[data-id="${secondId}"`);
    
                let fCardInfo = firstCard.children[0];
                let sCardInfo = secondCard.children[0];
    
                if (fCardInfo.textContent !== sCardInfo.textContent) {
                    fCardInfo.classList.add('closed');
                    sCardInfo.classList.add('closed');
                    return;
                }
    
                firstCard.classList.add('animate');
                secondCard.classList.add('animate');

                fCardInfo.classList.add('match');
                sCardInfo.classList.add('match');

                if (!isCardsLeft()) {
                    createGridForm("Победа! Поздравляю с отличной памятью ^_^");
                    let err = document.querySelector('.grid__err');
                    err.style.color = 'green';
                }
            }
        }, CARD_TIME_APPEARANCE);
    
    }

    function createCardTable(cards, n) {
        if (cards.length === 0) {
            return;
        }

        let container = document.querySelector('.container');
        container.innerHTML = '';

        let datasetId = 0;
        for (let i = 0; i < n; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
    
            for (let j = 0; j < n; j++) {
                let column = document.createElement('div');
                column.classList.add('column');
    
                let item = document.createElement('div');
                item.classList.add('item');
                item.dataset.id = datasetId;
                datasetId++;

                item.addEventListener('click', () => {
                    setCardEvent(item);
                })
                
                let index = i * n + j;

                let cardInfo = document.createElement('p');
                cardInfo.textContent = cards[index];
                cardInfo.classList.add('card');
                cardInfo.classList.add('closed');

                item.appendChild(cardInfo);
                column.appendChild(item);
                row.appendChild(column);
            }
    
            container.appendChild(row);
        }

    }

    function startGame(n) {
        let arr = generatePairedNumbers(n);
        let shuffledArr = shuffleNumbers(arr);
        
        createCardTable(shuffledArr, n);
        setTimeout(() => {
            let container = document.querySelector('.container');
            container.innerHTML = '';
    
            createGridForm('Время закончилось. Пожалуйста, начните игру заново.');
        }, GAME_TIMEOUT);
    };

    function createGridForm(errText = '') {
        let container = document.querySelector('.container');
        container.innerHTML = '';

        let form = document.createElement('form');
        form.classList.add('grid__form');

        let err = document.createElement('p');
        err.classList.add('grid__err');
        err.textContent = errText;

        let input = document.createElement('input');
        input.classList.add('grid__size');
        input.placeholder = 'Размер сетки';
        input.type = 'number';

        let btn = document.createElement('button');
        btn.classList.add('grid__retry_btn');
        btn.type = 'submit';
        btn.textContent = 'Начать игру';
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            let input = document.querySelector('.grid__size');
            let value = parseInt(input.value, 10);


            if (typeof value !== "number") {
                let err = document.querySelector('.grid__err');
                err.textContent = 'Размер сетки должен быть от 2 до 10';
                return;
            }

            if (value % 2 !== 0) {
                let err = document.querySelector('.grid__err');
                err.textContent = 'Размер сетки должен быть чётным';
                return;
            }

            if (value < 2 || value > 10) {
                value = 4;
            }

            startGame(value);
        });

        form.appendChild(err);
        form.appendChild(input);
        form.appendChild(btn);
        container.appendChild(form);
        return;
    }

     
    const CARD_TIME_APPEARANCE = 1000;
    const GAME_TIMEOUT = 60000;
    const LOCAL_STORAGE_KEY = 'openedCards';
    createGridForm();
})();
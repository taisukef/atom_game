const elements = [
    ...Array(15).fill('H'), ...Array(30).fill('C'), ...Array(25).fill('O'),
    'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Fe', 'Cu', 'Zn', 'I'
];

let currentHand = [];
let selectedElements = {};

document.getElementById('drawCards').addEventListener('click', () => {
    selectedElements = {}; // 選択されている元素をリセット
    currentHand = drawRandomElements(elements, 8);
    displayHand(currentHand);
});

document.getElementById('replaceCard').addEventListener('click', () => {
    const selectedCards = document.querySelectorAll('.selected');
    if (selectedCards.length > 0) {
        selectedCards.forEach(cardToReplace => {
            // 新しいカードを一枚引く
            const newCardElement = drawRandomElements(elements, 1)[0];
            const newCardDiv = document.createElement('div');
            const newImg = document.createElement('img');
            newImg.src = `../image/${elementToNumber[newCardElement]}.png`;
            newImg.alt = `Element ${newCardElement}`;
            newImg.style.width = '60px';

            newCardDiv.appendChild(newImg);
            newCardDiv.style.margin = '5px';
            newCardDiv.style.display = 'inline-block';
            newCardDiv.style.padding = '10px';
            newCardDiv.style.border = '1px solid black';
            newCardDiv.className = 'card';

            newCardDiv.addEventListener('click', function() {
                this.classList.toggle('selected');
                if (this.classList.contains('selected')) {
                    selectedElements[newCardElement] = (selectedElements[newCardElement] || 0) + 1;
                } else {
                    if (selectedElements[newCardElement]) {
                        selectedElements[newCardElement]--;
                        if (selectedElements[newCardElement] === 0) {
                            delete selectedElements[newCardElement];
                        }
                    }
                }
            });

            // 古いカードを新しいカードで置き換える
            cardToReplace.parentNode.replaceChild(newCardDiv, cardToReplace);

            // 古いカードの選択状態を解除し、選択データを更新
            const oldElementSymbol = cardToReplace.querySelector('img').alt.split(' ')[1];
            if (selectedElements[oldElementSymbol]) {
                selectedElements[oldElementSymbol]--;
                if (selectedElements[oldElementSymbol] === 0) {
                    delete selectedElements[oldElementSymbol];
                }
            }
        });
    } else {
        alert('交換するカードを選択してください。');
    }
});


function drawRandomElements(elements, numCards) {
    const shuffled = elements.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numCards);
}

function displayHand(hand) {
    const handDiv = document.getElementById('hand');
    handDiv.innerHTML = '';
    hand.forEach((element) => {
        const card = document.createElement('div');
        const img = document.createElement('img');
        img.src = `../image/${elementToNumber[element]}.png`; // PNG画像のパス
        img.alt = `Element ${element}`;
        img.style.width = '60px'; // 画像サイズ調整
        card.appendChild(img);
        card.style.margin = '5px';
        card.style.display = 'inline-block';
        card.style.padding = '10px';
        card.style.border = '1px solid black';
        card.className = 'card';
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            if (this.classList.contains('selected')) {
                selectedElements[element] = (selectedElements[element] || 0) + 1;
            } else {
                if (selectedElements[element]) {
                    selectedElements[element]--;
                    if (selectedElements[element] === 0) {
                        delete selectedElements[element];
                    }
                }
            }
            console.log(selectedElements);
        });        
        handDiv.appendChild(card);
    });
}

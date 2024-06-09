// 元素名から元素番号へのマッピング
const elementToNumber = {
    "H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,
    "Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 15, "S": 16, "Cl": 17, "Ar": 18, "K": 19, "Ca": 20,
    "Fe": 26, "Cu": 29, "Zn": 30, "I": 53
};

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

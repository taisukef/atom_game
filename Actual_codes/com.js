aiHand = [];
playerHand = [];
let playerPoints = 0;

async function aiTurn() {
    clearAISelection();
    disableButtons(true);
    disablePlayerCards(true);
    const possibleCompounds = await listCreatableMaterials(aiHand);
    const aiPointsDiv = document.getElementById('aiPoints');
    const resultDiv = document.getElementById('results');

    const compound = decideCompound(aiHand, possibleCompounds);
    if (compound) {
        console.log('AIが選択するはずのカード:', compound.components);
        for (let element in compound.components) {
            let count = compound.components[element];
            const elements = document.querySelectorAll(`#aiHand img[alt="Element ${element}"]`);
            for (let i = 0; i < elements.length && count > 0; i++) {
                const cardElement = elements[i].parentNode;
                cardElement.classList.add('selected');
                count--;
                await new Promise(resolve => setTimeout(resolve, 700));
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        resultDiv.innerHTML = `<p>AIが生成: ${compound.name} (${compound.formula}) - ${compound.point} ポイント</p>`;
        updatePoints(compound, aiPointsDiv);
        replaceUsedCards(compound, aiHand, true);
    } else {
        const elementToExchange = decideElementsToExchange(aiHand);
        if (elementToExchange) {
            const cardElement = document.querySelector(`#aiHand img[alt="Element ${elementToExchange}"]`).parentNode;
            cardElement.classList.add('selected');
            await new Promise(resolve => setTimeout(resolve, 700));
            const index = aiHand.indexOf(elementToExchange);
            if (index > -1) {
                aiHand[index] = drawRandomElements(elements, 1)[0];
                displayHand(aiHand, 'aiHand');
            }
        }
    }
    disableButtons(false);
    disablePlayerCards(false);
    console.log('現在のプレイヤーの手札:', playerHand);
}

function disableButtons(disable) {
    document.getElementById('exchangeButton').disabled = disable;
    document.getElementById('searchButton').disabled = disable;
}

function disablePlayerCards(disable) {
    const playerCards = document.querySelectorAll('#hand .card');
    playerCards.forEach(card => {
        card.style.pointerEvents = disable ? 'none' : 'auto';
    });
}

function updatePoints(compound, pointsDiv) {
    aiPoints += compound.point;
    pointsDiv.textContent = `AIポイント: ${aiPoints}`;
    checkWinCondition(); // 勝利条件を確認
}


function replaceUsedCards(compound, hand, isAI = false) {
    for (let element in compound.components) {
        for (let i = 0; i < compound.components[element]; i++) {
            const index = hand.indexOf(element);
            if (index > -1) {
                hand[index] = drawRandomElements(elements, 1)[0];
            }
        }
    }
    if (!isAI) {
        selectedElements = {};
    }
    displayHand(hand, isAI ? 'aiHand' : 'hand');
}


async function listCreatableMaterials(hand) {
    const materials = [];
    const combinations = getCombinations(hand);

    for (const combo of combinations) {
        const comboCounts = {};
        combo.forEach(el => comboCounts[el] = (comboCounts[el] || 0) + 1);
        const foundMaterials = await findMaterials(comboCounts);
        materials.push(...foundMaterials);
    }

    return materials;
}

function getCombinations(hand) {
    const results = [];

    const recurse = (path, hand, depth) => {
        if (depth === 0) {
            results.push(path);
            return;
        }
        for (let i = 0; i < hand.length; i++) {
            recurse(path.concat(hand[i]), hand.slice(i + 1), depth - 1);
        }
    };

    for (let i = 1; i <= hand.length; i++) {
        recurse([], hand, i);
    }

    return results;
}

function canGenerateCompound(hand, compound) {
    const availableElements = {};
    hand.forEach(el => availableElements[el] = (availableElements[el] || 0) + 1);

    for (let el in compound.components) {
        if (!availableElements[el] || availableElements[el] < compound.components[el]) {
            return false;
        }
    }
    return true;
}

function decideCompound(currentHand, possibleCompounds) {
    let bestCompound = null;
    let maxPoints = 0;
    for (let compound of possibleCompounds) {
        if (canGenerateCompound(currentHand, compound) && compound.point > maxPoints) {
            bestCompound = compound;
            maxPoints = compound.point;
        }
    }
    return bestCompound;
}

function decideElementsToExchange(currentHand) {
    const elementCounts = {};
    currentHand.forEach(el => elementCounts[el] = (elementCounts[el] || 0) + 1);

    let minCount = Infinity;
    let elementToExchange = null;
    for (let el in elementCounts) {
        if (elementCounts[el] < minCount) {
            minCount = elementCounts[el];
            elementToExchange = el;
        }
    }
    return elementToExchange;
}

document.getElementById('exchangeButton').addEventListener('click', () => {
    let selectedCards = document.querySelectorAll('#hand .selected img');
    selectedCards.forEach(card => {
        let element = card.alt.split(' ')[1];
        let index = playerHand.indexOf(element);
        if (index > -1) {
            let newElement = elements[Math.floor(Math.random() * elements.length)]; // ランダムな新しい元素を選ぶ
            let elementNumber = elementToNumber[newElement]; // 元素記号に対応する番号を取得
            playerHand[index] = newElement;
            card.src = `../image/${elementNumber}.png`; // 番号に基づいて画像のパスを設定
            card.alt = `Element ${newElement}`; // 画像のalt属性を更新
        }
        card.parentNode.classList.remove('selected'); // カードの選択状態を解除
    });
    selectedElements = {}; // 選択状態をリセット
    displayHand(playerHand, 'hand'); // 手札を再表示
    aiTurn()
});

function initializeHands() {
    aiHand = drawRandomElements(elements, 8); // AIの手札を初期化
    playerHand = drawRandomElements(elements, 8); // プレイヤーの手札を初期化
    displayHand(aiHand, 'aiHand');
    displayHand(playerHand, 'hand');
}

document.getElementById('drawCards').addEventListener('click', () => {
    initializeHands();
    aiTurn()
});

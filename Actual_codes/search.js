async function loadMaterials() {
    const response = await fetch('../compound/standard.json');
    const data = await response.json();
    if (!data.material || !Array.isArray(data.material)) {
        console.error('Loaded data does not contain a valid "material" array:', data);
        return [];
    }
    return data.material;
}

async function findMaterials(components) {
    const materials = await loadMaterials();
    return materials.filter(material => {
        for (const element in components) {
            if (!material.components[element] || material.components[element] !== components[element]) {
                return false;
            }
        }
        for (const element in material.components) {
            if (!components[element]) {
                return false;
            }
        }
        return true;
    });
}

let totalPoints = 0; // ポイントの合計を保持する変数


document.getElementById('searchButton').addEventListener('click', async () => {
    const foundMaterials = await findMaterials(selectedElements);
    const resultDiv = document.getElementById('results');
    const pointsDiv = document.getElementById('points');
    resultDiv.innerHTML = '';

    totalPoints = 0;

    const selectedCards = document.querySelectorAll('.selected');
    selectedCards.forEach(card => {
        const oldElement = card.querySelector('img').alt.split(' ')[1];
        const newElement = drawRandomElements(elements, 1)[0]; // 新しい元素をランダムに選択
        card.querySelector('img').src = `../image/${elementToNumber[newElement]}.png`;
        card.querySelector('img').alt = `Element ${newElement}`;

        // 選択状態のリセット
        card.classList.remove('selected');

        // 選択されていた元素を更新
        if (selectedElements[oldElement] && selectedElements[oldElement] > 0) {
            selectedElements[oldElement]--;
            if (selectedElements[oldElement] === 0) {
                delete selectedElements[oldElement];
            }
        }
        selectedElements[newElement] = (selectedElements[newElement] || 0) + 1;
    });

    selectedElements = {}; // 全ての選択状態をリセット

    if (foundMaterials.length > 0) {
        foundMaterials.forEach(material => {
            resultDiv.innerHTML += `<p>${material.name} (${material.formula}) - ${material.point} points</p>`;
            totalPoints += material.point;
        });
        pointsDiv.textContent = `ポイント： ${totalPoints}`;
    } else {
        resultDiv.innerHTML = '<p>該当する物質が見つかりませんでした。</p>';
    }
});

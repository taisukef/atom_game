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

    if (foundMaterials.length > 0) {
        foundMaterials.forEach(material => {
            resultDiv.innerHTML += `<p>${material.name} (${material.formula}) - ${material.point} ポイント</p>`;
            playerPoints += material.point;
            replaceUsedCards(material, playerHand);
        });
        pointsDiv.textContent = `ポイント： ${playerPoints}`;
        checkWinCondition(); // 勝利条件を確認
    } else {
        resultDiv.innerHTML = '<p>該当する物質が見つかりませんでした。</p>';
    }
    
    aiTurn();
});

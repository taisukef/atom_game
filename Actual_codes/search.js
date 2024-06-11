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
    const pointsDiv = document.getElementById('points'); // ポイント表示用の要素
    resultDiv.innerHTML = '';

    totalPoints = 0; // 新しい検索ごとにポイントをリセット

    // 選択されているカードの画像を、それぞれの元素に対応する新しい画像に置き換えます。
    const selectedCards = document.querySelectorAll('.selected img');
    selectedCards.forEach(card => {
        card.src = `../image/${elementToNumber[card.alt.split(' ')[1]]}.png`; // 元素記号から番号に変換し、画像パスに変更
        card.parentNode.classList.remove('selected'); // カードの選択状態を解除
    });

    // 選択状態のリセット
    selectedElements = {};

    if (foundMaterials.length > 0) {
        foundMaterials.forEach(material => {
            resultDiv.innerHTML += `<p>${material.name} (${material.formula}) - ${material.point} points</p>`;
            totalPoints += material.point; // 各物質のポイントを合計に追加
        });
        pointsDiv.textContent = `ポイント： ${totalPoints}`; // ポイントを表示更新
    } else {
        resultDiv.innerHTML = '<p>該当する物質が見つかりませんでした。</p>';
    }
});

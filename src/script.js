fetch(
  "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados?formato=json&dataInicial=01/06/2021&dataFinal=01/06/2022"
)
  .then((resp) => resp.json())
  .then((dados) => {
    console.log(dados);
    geraGrafico(dados, 600, 300, [0, 2, 4, 6, 8, 10, 12, 14, 16], 4);
  });

function geraGrafico(dados, tw, th, escala, distancia) {
  const margem = 30;
  const w = tw - 2 * margem;
  const h = th - 2 * margem;
  const n = dados.length;
  const max = escala[escala.length - 1];
  const step = w / (n - 1);
  let pathD = "";
  let escalaY = "";
  for (let i = 0; i < n; i++) {
    const posY = h - (dados[i].valor / max) * h;
    const posX = i * step;
    if (i === 0) {
      pathD += `M 0 ${posY}`;
    } else {
      pathD += `L ${posX} ${posY}`;
    }
    if (i % distancia == 0) {
      escalaY += `<text text-anchor="middle" x="${posX}" y="${
        h + margem
      }">${formataData(dados[i].data)}</text>`;
    }
  }
  let escalaX = "";
  for (let i = 0; i < escala.length; i++) {
    const posY = 5 + h - (escala[i] / max) * h;
    escalaX += `<text text-anchor="end" x="-10" y="${posY}">${escala[i]}</text>`;
  }
  const svg = document.getElementById("chart");
  svg.innerHTML = `
          <g transform="translate(${margem}, ${margem})">
            <path d="${pathD}" stroke="blue" fill="none" />
            <path d="M 0 0 V ${h}" stroke="black" />
            <path d="M 0 ${h} H ${w}" stroke="black" />
            ${escalaY}
            ${escalaX}
          </g>
        `;
}

function formataData(data) {
  const dma = data.split("/");
  return dma[1] + "/" + dma[2].substring(2);
}

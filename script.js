"use strict";
// Startovací podmínky
let vysledek;
let operator = "";
let retezec = "";
const prikladEl = document.querySelector("#priklad");
const vysledekEl = document.querySelector("#vysledek");
const rokEl = document.querySelector("#rok");
const klavesy = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "-",
  "*",
  "/",
  ",",
  "Enter",
  "Backspace",
  "Delete",
];

// Funkce pro vynulování příkladu a výsledku
const start = function () {
  vysledek = undefined;
  prikladEl.textContent = "";
  vysledekEl.textContent = "00,00";
};

// Funkce pro mazání celého příkladu a poslední hodnoty
const smazani = function (tlacitko) {
  switch (tlacitko) {
    case "C":
      start();
      break;
    case "Back":
      const mezera = prikladEl.textContent.slice(-1);
      if (mezera === " ")
        prikladEl.textContent = prikladEl.textContent.slice(0, -2);
      else prikladEl.textContent = prikladEl.textContent.slice(0, -1);
      break;
  }
};

// Funkce pro vyhodnocení jednotlivých zmačknutých tlačítek
const priklad = function (tlacitko) {
  if (tlacitko != "=") {
    if (vysledek != "Error" && vysledek != undefined) {
      console.log(vysledek);
      prikladEl.textContent = vysledek.toString();
      vysledek = undefined;
    } else if (vysledek == "Error") {
      prikladEl.textContent = 0;
      vysledek = undefined;
    }

    if (
      !(
        tlacitko == "+" ||
        tlacitko == "-" ||
        tlacitko == "×" ||
        tlacitko == "÷" ||
        tlacitko == "²"
      )
    )
      prikladEl.textContent += tlacitko;
    else prikladEl.textContent += " " + tlacitko + " ";
  } else {
    retezec = prikladEl.textContent.replaceAll(",", ".");
    retezec = retezec.split(" ");

    // Výpočet operací s největší prioritou
    while (
      retezec.includes("×") ||
      retezec.includes("÷") ||
      retezec.includes("²")
    ) {
      for (let j = 1; j < retezec.length; j += 2) {
        const cislo1 = Number(retezec[j - 1]);
        const cislo2 = Number(retezec[j + 1]);
        let vysledek2;
        const nahrazeniVPoli = (vysledek2) =>
          retezec.splice(j - 1, 3, vysledek2);

        if (retezec[j] == "²") {
          vysledek2 = cislo1 * cislo1;
          nahrazeniVPoli(vysledek2);
        } else if (retezec[j] == "×") {
          vysledek2 = cislo1 * cislo2;
          nahrazeniVPoli(vysledek2);
        } else if (retezec[j] == "÷") {
          vysledek2 = cislo1 / cislo2;
          nahrazeniVPoli(vysledek2);
        }
      }
    }

    for (let i = 0; i < retezec.length; i += 2) {
      const cislo = Number(retezec[i]);

      if (i === 0) {
        vysledek = cislo;
        continue;
      } else {
        const operator = retezec[i - 1];

        switch (operator) {
          case "+":
            vysledek += cislo;
            break;
          case "-":
            vysledek -= cislo;
            break;
          case "×":
            vysledek *= cislo;
            break;
          case "÷":
            vysledek /= cislo;
            break;
          case "²":
            vysledek *= vysledek;
            break;
        }
      }
    }
    vysledek = +vysledek.toFixed(3);
    // Metoda .toFixed() vrací string hodnotu, takže jej musíme pak znovu převést na číslo pomocí unárního oprátoru + abychom se zbavili přebytečných nul
    if (vysledek === Infinity || !vysledek)
      vysledek = vysledek === 0 ? vysledek : "Error";
    vysledekEl.textContent = vysledek.toString().replaceAll(".", ",");
    // prikladEl.textContent = "";
    // pokud nechceme zobrazovat celý příklad při výpočtu výsledku, odkomentujeme řádku výše
  }
};

// Vstup z klávesnice
document.addEventListener("keydown", function (e) {
  const k = e.key;
  for (const klavesa of klavesy) {
    if (k === klavesa) {
      if (k === "Enter") {
        priklad("=");
        e.preventDefault();
      } else if (k === "Backspace") smazani("Back");
      else if (k === "Delete") smazani("C");
      else if (k === "*") priklad("×");
      else if (k === "/") priklad("÷");
      else priklad(k);
    }
  }
});

// Startovací věci, vynulování příkladu, výsledku a nastavení aktuálního roku
rokEl.textContent = `© ${new Date().getFullYear()}`;
start();

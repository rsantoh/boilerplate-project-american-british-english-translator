const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')
// Invertir un objeto (para british-to-american)
const invertDict = (obj) => {
  let inverted = {};
  for (let key in obj) {
    inverted[obj[key]] = key;
  }
  return inverted;
};

class Translator {
 translate(text, locale) {
    if (locale === "american-to-british") {
      return this.americanToBritish(text);
    }
    if (locale === "british-to-american") {
      return this.britishToAmerican(text);
    }
    return null;
  }

  // Resalta la palabra cambiada
  highlight(word) {
    return `<span class="highlight">${word}</span>`;
  }

  americanToBritish(text) {
    let translation = text;

    // Títulos (ej: Mr. → Mr)
    for (let title in americanToBritishTitles) {
      let regex = new RegExp(`\\b${title}`, "gi");
      translation = translation.replace(regex, (match) => {
        let repl = americanToBritishTitles[title];
        // Capitalizar si es necesario
        if (match[0] === match[0].toUpperCase()) {
          repl = repl.charAt(0).toUpperCase() + repl.slice(1);
        }
        return this.highlight(repl);
      });
    }

    // Ortografía (ej: accessorize → accessorise)
    for (let word in americanToBritishSpelling) {
      let regex = new RegExp(`\\b${word}\\b`, "gi");
      translation = translation.replace(regex, (match) => {
         if (match.includes('highlight')) {
            return match;
          }
        let repl = americanToBritishSpelling[word];
        return this.highlight(repl);
      });
    }

    // Palabras americanas únicas
    for (let word in americanOnly) {
      let regex = new RegExp(`\\b${word}\\b`, "gi");
      translation = translation.replace(regex, (match) => {
        let repl = americanOnly[word];
        return this.highlight(repl);
      });
    }

    // Formato de hora (ej: 12:15 → 12.15)
    translation = translation.replace(/(\d{1,2}):(\d{2})/g, (match, h, m) => {
      return this.highlight(`${h}.${m}`);
    });

    return {
      text: text,
      translation: translation === text ? "Everything looks good to me!" : translation
    };
  }

  britishToAmerican(text) {
    let translation = text;

    const britishToAmericanSpelling = invertDict(americanToBritishSpelling);
    const britishToAmericanTitles = invertDict(americanToBritishTitles);

    // Títulos
    for (let title in britishToAmericanTitles) {
      let regex = new RegExp(`\\b${title}\\b`, "gi");
      translation = translation.replace(regex, (match) => {
        let repl = britishToAmericanTitles[title];
        if (match[0] === match[0].toUpperCase()) {
          repl = repl.charAt(0).toUpperCase() + repl.slice(1);
        }
        return this.highlight(repl);
      });
    }

    // Ortografía
    for (let word in britishToAmericanSpelling) {
      let regex = new RegExp(`\\b${word}\\b`, "gi");
      translation = translation.replace(regex, (match) => {
        let repl = britishToAmericanSpelling[word];
        return this.highlight(repl);
      });
    }

    // Palabras británicas únicas
    // for (let word in britishOnly) {
    //   let regex = new RegExp(`\\b${word}\\b`, "gi");
    //   translation = translation.replace(regex, (match) => {
    //     let repl = britishOnly[word];
    //     return this.highlight(repl);
    //   });
    // }
    for (let word of Object.keys(britishOnly).sort((a, b) => b.length - a.length)) {
      let regex = new RegExp(`\\b${word}\\b`, "gi");
      translation = translation.replace(regex, (match) => {
        if (match.includes('highlight')) return match;
        let repl = britishOnly[word];
        return this.highlight(repl);
      });
    }

    // Formato de hora (ej: 12.15 → 12:15)
    translation = translation.replace(/(\d{1,2})\.(\d{2})/g, (match, h, m) => {
      return this.highlight(`${h}:${m}`);
    });

    return {
      text: text,
      translation: translation === text ? "Everything looks good to me!" : translation
    };
  }
}

module.exports = Translator;
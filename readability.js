// readability alogithm
function readability(text) {
  // initialise counts
  var letters = 0;
  var words = 0;
  var sentences = 0;

  // itearate through all characters of text
  for (let i = 0; i < text.length; i++) {
    // get unicode value of character
    let char_unicode = text.charCodeAt(i);

    // if a-z or A-Z
    if ((char_unicode >= 65 && char_unicode <= 90) || (char_unicode >= 97 && char_unicode <= 122)) {
      letters++;
    } else if (char_unicode === 32) { // if space
      words++;
    } else if ([46, 33, 63].includes(char_unicode) && text.charCodeAt(i + 1) === 32) { // if . ! ? and next character is a space
      sentences++;
    }
  }

  // as word count is only incremented by spaces, and sentence count is only incremented where sentence-final punctuation is followed by a space, the counts need incrementing by one (if there are any words)
  if (letters > 0) {
    words ++;
    sentences++;
  }

  // get average number of letters per 100 words
  let l = letters / words * 100;

  // get average number of sentences per 100 words
  let s = sentences / words * 100;

  // calculate Coleman-Liau Index, round it and assign the result to variable grade
  let grade = Math.round(0.0588 * l - 0.296 * s - 15.8);

  // return grade
  if (grade < 1) {
    return "Before US grade 1"
  } else if (grade >= 16) {
    return "US grade 16+";
  } else {
    return `US grade ${grade}`;
  }
}

// execute a script on the current tab
chrome.tabs.executeScript( {
    // get selected text and convert to a string
    code: "window.getSelection().toString();"
}, function(selection) { // pass in the return value of the code (the selected text) to a function as selection
    // trim leading and trailing spaces, replace new lines with spaces, remove any characters that aren't in the algorithm, then reduce any remaining consecutive spaces to single spaces
    var text = selection[0].trim().replace(/(\r\n|\n|\r)/gm, ' ').replace(/[^a-zA-Z.!? ]/g, '').replace(/\s\s+/g, ' ');

    // if there is selected text, run readability alogrithm and inject result
    if (text.length > 0) { // if not, provide usage instructions;
      // get reading level
      var reading_level = readability(text);

      // populate HTML main
      document.getElementsByTagName("main")[0].innerHTML =
        `
        <div class="accordion" id="accordion">
          <div class="card">
            <div class="card-header" id="headingOne">
              <h5 class="mb-0">
                <button class="btn" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <b class="text-dark">Reading level</b>
                </button>
              </h5>
            </div>
            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
              <div id="reading-level" class="card-body"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingTwo">
              <h5 class="mb-0">
                <button class="btn collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <b class="text-dark">Text</b>
                </button>
              </h5>
            </div>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
              <div class="card-body">
                <p id="text"></p>
                <hr>
                <p><em>Note: text is stripped of characters other than a-z/A-Z, '.', '?', '!' and spaces, and consecutive spaces and line breaks are reduced to a single space.</em></p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingThree">
              <h5 class="mb-0">
                <button class="btn collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  <b class="text-dark">Grade equivalence</b>
                </button>
              </h5>
            </div>
            <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
              <div class="card-body">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">US</th>
                      <th scope="col">&#8776; UK</th>
                      <th scope="col">&#8776; age</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td scope="row">1</td>
                      <td scope="row">2</td>
                      <td scope="row">6-7</td>
                    </tr>
                    <tr>
                      <td scope="row">6</td>
                      <td scope="row">7</td>
                      <td scope="row">11-12</td>
                    </tr>
                    <tr>
                      <td scope="row">12</td>
                      <td scope="row">13</td>
                      <td scope="row">17-18</td>
                    </tr>
                  </tbody>
                </table>

                <p>Grades 13-16 are roughly equivalent to undergraduate higher education.</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header" id="headingFour">
              <h5 class="mb-0">
                <button class="btn collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  <b class="text-dark">Method and limitations</b>
                </button>
              </h5>
            </div>
            <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion">
              <div class="card-body">
                <p>The calculation is based on the <a href="https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index" target="_blank" title="Coleman-Liau Index Wikipedia article">Coleman-Liau Index</a><sup>*</sup> and relies on counting letters, words and sentences, as outlined below.</p>

                <p>For greater accuracy, before running the calculation the text is stripped of any characters other than a-z/A-Z, '.', '?', '!' and spaces, and consecutive spaces and line breaks are reduced to a single space.</p>

                <p><em>Letters</em> are the characters a-z/A-Z.</p>

                <p><em>Words</em> are calculated by counting the number of spaces, with one added to the total to account for the final word. The text is initially cleaned to remove double spacing and line breaks.</p>

                <p><em>Sentences</em> are calculated by counting any '.', '?' and '!' characters that are followed by a space, with one added to the total to account for the final sentence.</p>

                <p class="before-list">The method does not account for:</p>
                <ul>
                  <li>letters other than a-z/A-Z (or non-alphabetic scripts - <a href="https://en.wikipedia.org/wiki/Writing_system" target="_blank" title="writing systems Wikipedia article">syllabaries, logographies, abjads and abugidas</a>)</li>
                  <li>sentences that don't end with '.', '?' or '!' (except the final sentence)</li>
                  <li>text such as 'word/word', which would count as one word (though by extension pluralisation such as 'text/s' would also count as one)</li>
                  <li>text such as 'U.S. Congress', where the '. ' would increase the sentence count by one regardless of whether 'U.S.' was the end of a sentence</li>
                  <li>any further complexities not captured by the method as described above</li>
                </ul>

                <hr>

                <p><em><sup>*</sup> The Coleman-Liau Index is one of many commonly-used readability tests, the results of which differ.</em></p>

                <p><em>Readable provides <a href="https://readable.com/features/readability-formulas" target="_blank" title="Readable readability formulas explainer articles">explainers</a> on both the Coleman-Liau Index and a number of alternatives.</em></p>
              </div>
            </div>
          </div>
        </div>
        `;

      // insert text into reading level and text elements
      document.getElementById("reading-level").textContent = reading_level;
      document.getElementById("text").textContent = text;
    }
});

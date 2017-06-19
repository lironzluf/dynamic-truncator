export class DynamicTruncator {

  constructor(element, text) {
    this._element = element;
    this._text = text;
    this.words = [];
    if (!this._element) {
      throw new Error('Dynamic Truncator: Element is required');
    }

    // Check if text is supplied, if not - get the one from the element
    if (!this.isTextValid()) {
      this._text = this.getTextFromElement();

      if (!this.isTextValid()) {
        throw new Error('Dynamic Truncator: No text found in element');
      }
    }

    // Set height 100% to element to prevent IE bug
    this.setHeightOnElement(100);
    this.words = this.getWordsFromText();

    if (this.isTruncationNeeded()) { // if text is overflown, truncate it
      this.startTruncating();
    }
  }

  startTruncating() {
    //get max height of text element
    var height = this.getMaxHeight();
    // clear text in element
    this._element.innerText = '';
    // add each word in the words array to the element and check for overflow, if overflown - add ellipsis and stop
    for (var i = 0; i < this.words.length; i += 1) {
      this._element.innerText = this._element.innerText + ' ' + this.words[i];
      // if dots added, break
      if (this.addElipsis(i, height)) {
        break;
      }
    }
  }

  addElipsis(i, height) {
    // if text element is now overflown add elipsis
    if (this._element.scrollHeight > height && this._element.innerText.length > 0) {
      this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - this.words[i].length - 1); // remove last word
      // replace special chars at the end of the word and replace them with three dots
      this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - 1) + this._element.innerText[this._element.innerText.length - 1].replace(/(_|\+|\.|\/|\\|\,|\:|\;|\-)/g, '');
      this._element.innerText += '...';
      if (this._element.scrollHeight > height) { // if ellipsis added caused overflow
        this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - 3); // remove ellipsis
        this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - this.words[i - 1].length - 1); // remove last word
        this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - 1) + this._element.innerText[this._element.innerText.length - 1].replace(/(_|\+|\.|\/|\\|\,|\:|\;|\-)/g, '');
        this._element.innerText += '...';
      }
      return true;
    }
    // not yet overflown.. continue to add words
    return false;
  }

  isTruncationNeeded() {
    return this._element.scrollHeight > this._element.clientHeight;
  }

  isTextValid() {
    return (typeof this._text === 'string' && this._text.length > 0);
  }

  getMaxHeight() {
    let computedStyle = window.getComputedStyle(this._element, null),
      maxHeightComputedStyle = 0, heightComputedStyle = 0;
    if (computedStyle) {
      maxHeightComputedStyle = parseInt(computedStyle.maxHeight, 10);
      heightComputedStyle = parseInt(computedStyle.height, 10);
    }

    return Math.max(maxHeightComputedStyle, heightComputedStyle, this._element.clientHeight);
  }

  getTextFromElement() {
    return this._element.innerText;
  }

  setHeightOnElement(height) {
    if (!isNaN(height)) {
      this._element.style.height = height + '%';
    }
  }

  getWordsFromText() {
    return this._text.split(' ');
  }
}
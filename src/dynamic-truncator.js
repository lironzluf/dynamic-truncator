/*
 MIT License

 Copyright (c) 2017 Liron Zluf

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

(function () {
  'use strict';

  window['DynamicTruncator'] = class {

    constructor(element, text){
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

      // Set height 100% to element to prevent ie bug
      this.setHeightOnElement(100);
      this.words = this.getWordsFromText();

      if (this.isTruncationNeeded()) { // if text is overflown, truncate it
        this.startTruncating();
      }
    }

    startTruncating(){
      //get max height of text element
      var height = this.getMaxHeight();
      // clear text in element
      this._element.innerText = '';
      // foreach word in rec add word to element and check for overflow, if overflown - add 3 dots and stop
      for (var i = 0; i < this.words.length; i+=1) {
        this._element.innerText = this._element.innerText + ' ' + this.words[i];
        // if dots added, break
        if (this.addElipsis(i, height)) {
          break;
        }
      }
    }

    addElipsis(i, height){
      // if text element is now overflown add elipsis
      if (this._element.scrollHeight > height && this._element.innerText.length > 0) {
        this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - this.words[i].length - 1); // remove last word
        // replace special chars at the end of the word and replace them with three dots
        this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - 1) + this._element.innerText[this._element.innerText.length - 1].replace(/(_|\+|\.|\/|\\|\,|\:|\;|\-)/g, '');
        this._element.innerText += '...';
        if (this._element.scrollHeight > height){ // if elipsis added caused overflow
          this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length -3); // remove dots
          this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - this.words[i-1].length - 1); // remove last word
          this._element.innerText = this._element.innerText.substring(0, this._element.innerText.length - 1) + this._element.innerText[this._element.innerText.length - 1].replace(/(_|\+|\.|\/|\\|\,|\:|\;|\-)/g, '');
          this._element.innerText += '...';
        }
        return true;
      }
      // not yet overflown.. continue to add words
      return false;
    }

    isTruncationNeeded(){
      return this._element.scrollHeight > this._element.clientHeight;
    }

    isTextValid(){
      return (typeof this._text === 'string' && this._text.length > 0);
    }

    getMaxHeight(){
      let computedStyle = window.getComputedStyle(this._element, null),
        maxHeightComputedStyle = 0, heightComputedStyle = 0;
      if (computedStyle) {
        maxHeightComputedStyle = parseInt(computedStyle.maxHeight,10);
        heightComputedStyle = parseInt(computedStyle.height,10);
      }

      return Math.max(maxHeightComputedStyle,heightComputedStyle,this._element.clientHeight);
    }

    getTextFromElement() {
      return this._element.innerText;
    }

    setHeightOnElement(height) {
      if (!isNaN(height)) {
        this._element.style.height = height + '%';
      }
    }

    getWordsFromText(){
      return this._text.split(' ');
    }
  };

}());

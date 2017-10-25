if (!!document.getBoxObjectFor || window.mozInnerScreenX != null) {
    HTMLElement.prototype.__defineSetter__("outerText", function(sText) {
        var parsedText = document.createTextNode(sText);
        this.parentNode.replaceChild(parsedText, this);
        return parsedText;
    });
    HTMLElement.prototype.__defineGetter__("outerText", function() {
        var r = this.ownerDocument.createRange();
        r.selectNodeContents(this);
        return r.toString();
    });
}

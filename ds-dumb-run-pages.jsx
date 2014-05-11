// based on dumbrunpages by dave saunders
// http://jsid.blogspot.de/2005/12/function-snippets.html

var halfpage = false;

function DumbRunPages(doc, theStory, likeColumns) {
  // What makes this "dumb" is that default master pages are used.
  //var uRuler = theDoc.viewPreferences.rulerOrigin;
  //theDoc.viewPreferences.rulerOrigin = RulerOrigin.spreadOrigin;
  while (theStory.textContainers[theStory.textContainers.length - 1].overflows) {
    var backPage = doc.pages.add();
    app.activeWindow.activePage = backPage;
    var myPbounds = backPage.bounds;
    var myNewTF = backPage.textFrames.add({
      geometricBounds: getBounds(doc, backPage)
    });
    myNewTF.itemLayer = theStory.textContainers[theStory.textContainers.length - 1].itemLayer;
    myNewTF.previousTextFrame = theStory.textContainers[theStory.textContainers.length - 1];
    if (likeColumns === true) {
      myNewTF.textFramePreferences.textColumnCount = backPage.marginPreferences.columnCount;
      myNewTF.textFramePreferences.textColumnGutter = backPage.marginPreferences.columnGutter;
    }
    if (myNewTF.characters.length === 0) {
      //theDoc.viewPreferences.rulerOrigin = uRuler;
      alert("Permanently overset"); // This indicates a permanent overset condition so break out of loop
    }
  }
}

function getBounds(doc, p) {
  var pWidth = doc.documentPreferences.pageWidth;
  var pHeight = doc.documentPreferences.pageHeight;
  var myX2, myX1, myY2, myY1;

  if (p.side == PageSideOptions.leftHand) {
     myX2 = p.marginPreferences.left;
     myX1 = p.marginPreferences.right;
  } else {
     myX1 = p.marginPreferences.left;
     myX2 = p.marginPreferences.right;
  }
   myY1 = p.marginPreferences.top;
   myX2 = pWidth - myX2;
   myY2 = pHeight - p.marginPreferences.bottom;
  if(halfpage===true){
    myY2 = myY2 /2;

  }
  return [myY1, myX1, myY2, myX2];
}


var main = function() {

      var dialog = app.dialogs.add({
      name: "DumbRunPages",
      canCancel: true
    });
    var d_col_one = dialog.dialogColumns.add();
    var c_box = d_col_one.checkboxControls.add({
      staticLabel:"Half Pages?",
      checkedState: false
    });
    if (dialog.show() === true) {
      halfpage = c_box.checkedState;
      dialog.destroy();

  var doc = app.activeDocument;


  if (doc.selection.length > 0) {
    if(doc.selection[0] instanceof TextFrame){
      var tf = doc.selection[0];
    var story = tf.parentStory;
    DumbRunPages(doc, story, true);

    }

  } else {

    alert("Please select a textFrames");
  }

    }
};

main();
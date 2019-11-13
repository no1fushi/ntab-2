function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

browser.menus.create({
  id: "separator-1",
  type: "separator",
  contexts: ["all"]
}, onCreated);

browser.menus.onClicked.addListener((info, tab) => {
});

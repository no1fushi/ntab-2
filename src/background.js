// Function definition
const onCreated = () => {
  if(chrome.runtime.lastError) {
    console.warn(`Error: ${chrome.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

const outputTabs = tabs => {
  console.groupCollapsed("URLs")
  for(let tab of tabs) console.log(tab.url);
  console.groupEnd();
  console.groupCollapsed("IDs")
  for(let tab of tabs) console.log(tab.id);
  console.groupEnd();
}

const countNewtab = tabs => {

  let newtab = new Array();

  const firefox = "^about:newtab$";
  const chrome =  "^chrome:\/\/newtab\/$";
  const browsers = [chrome, firefox];
  const regexp = new RegExp(browsers.join("|", "gm"))

  tabs.some((element, index) => {
    if(regexp.test(element.url)) newtab.push(index);
  })

  console.log("↓ newtab[]");
  console.log(newtab);
  return newtab;
}

const delTabs = (target, tabs) => {
  chrome.tabs.remove(target, () => console.log("RemoveTabs"));
}

const bmTabs = (target, tabs) => {
  for(let tab of tabs) {
    if(target.includes(tab.id) && tab.id != target[0]) {
      chrome.bookmarks.create({
        title: tab.title,
        url: tab.url
      }, bookmarkItem => console.log("Bookmark added with ID: " + bookmarkItem.id));
    }
  }
}

// Create contextmenus
chrome.contextMenus.create({
  id: "del",
  title: "delete Tabs",
  contexts: ["all"]
}, onCreated);

chrome.contextMenus.create({
  id: "bm",
  title: "bookmark Tabs",
  contexts: ["all"]
}, onCreated);

chrome.contextMenus.create({
  id: "bm-del",
  title: "bookmark and delete Tabs",
  contexts: ["all"]
}, onCreated);

chrome.contextMenus.create({
  id: "separator",
  type: "separator",
  contexts: ["all"]
}, onCreated);

// Event listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.tabs.query({currentWindow: true}, tabs => {

    outputTabs(tabs);
    const newtab = countNewtab(tabs);
    console.log("Number of new tabs open :", newtab.length);

    if(newtab.length >= 2) {
      
      let target = new Array();
      for(let index in tabs) if(index >= newtab[0] && index < newtab[1]) target.push(tabs[index].id);
      console.log("↓ target[]");
      console.log(target);

      switch (info.menuItemId) {
        case "del":
        delTabs(target, tabs);
        break;
        case "bm":
        bmTabs(target, tabs);
        break;
        case "bm-del":
        bmTabs(target, tabs);
        delTabs(target, tabs);
        break;
      }

    } else {
      console.warn("There are less than 2 new tabs open");
    }

  });
});

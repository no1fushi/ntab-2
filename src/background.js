// Function definition
const onCreated = () => {
  if(chrome.runtime.lastError) {
    console.log(`Error: ${chrome.runtime.lastError}`);
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

const callOpe = ope => {
  chrome.tabs.query({currentWindow: true}, tabs => {
    outputTabs(tabs);
    const newtab = countNewtab(tabs);

    if(newtab.length >= 2) {
      console.log("newtab.length :", newtab.length);
      let target = new Array();
      for(let index in tabs) if(index >= newtab[0] && index < newtab[1]) target.push(tabs[index].id);
      console.log("↓ target[]");
      console.log(target);

      switch (ope) {
        case "del":
        delTabs(target, tabs);
        break;
        case "bm":
        //delTabs(target, tabs);
        break;
      }

    } else {
      console.warn("There are less than 2 new tabs open");
      console.log("newtab.length :", newtab.length);
    }

  });
}

// Create contextmenus
chrome.contextMenus.create({
  id: "delTabs",
  title: "delTabs",
  contexts: ["all"]
}, onCreated);

chrome.contextMenus.create({
  id: "getTabList2",
  title: "GetTabList2",
  contexts: ["all"]
}, onCreated);

chrome.contextMenus.create({
  id: "separator",
  type: "separator",
  contexts: ["all"]
}, onCreated);

// Event listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "delTabs":
    callOpe("del");
    break;
    case "getTabList2":
    callOpe("bm");
    break;
  }
});

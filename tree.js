const tree = (data) => {

  const createAnchor = () => {
    const a = createElement("a");
    a.href = "#";
    a.classList.add("plus");
    a.addEventListener("click", openLi);
    return a;
  }

  const createIcon = item => {
    const icon = createElement("span");
    icon.classList.add("icon-span");
    icon.classList.add(item.className);
    return icon;
  }

  const createText = item => {
    const text = createElement("span");
    text.textContent = item.name.toLowerCase();
    text.classList.add("text-span");
    return text;
  }

  const getParentWithNull = () => {
    return data.filter((val) => {
      return val.parent === null;
    });
  }

  const hasNestedElements = parentId => {
    return data.filter((val) => {
      return val.parent === parentId;
    }).length > 0;
  }

  const getChildren = parentId => {
    return data.filter((val) => {
      return val.parent === parentId;
    });
  }

  const onTextOrIconClick = (a) => {
    a.click();
  }

  const buildTreeLi = item => {
    const li = createElement("li", "li-" + item.id);
    const icon = createIcon(item);
    const text = createText(item);
    if (hasNestedElements(item.id)) {
      const a = createAnchor();
      text.addEventListener("click", onTextOrIconClick.bind(this, a));
      icon.addEventListener("click", onTextOrIconClick.bind(this, a));
      li.appendChild(a);
    } else {
      text.classList.add("single");
    }

    li.appendChild(icon);
    li.appendChild(text);
    return li;
  }

  const openLi = event => {
    event.preventDefault();
    event.stopPropagation();
    const et = event.target;
    const parent = et.parentElement;
    const id = parent.id.replace("li-", "");
    const c = getChildren(id);
    const items = c.map(buildTreeLi);
    const ul = document.createElement("ul");
    items.forEach((li) => { ul.appendChild(li) });
    parent.appendChild(ul);
    et.classList.remove("plus");
    et.classList.add("minus");
    et.removeEventListener("click", openLi);
    et.addEventListener("click", closeLi);
  }

  const closeLi = event => {
    event.preventDefault();
    event.stopPropagation();
    const et = event.target;
    const parent = et.parentElement;
    const ul = parent.querySelector("ul");        
    parent.removeChild(ul);
    et.classList.remove("minus");
    et.classList.add("plus");
    et.removeEventListener("click", closeLi);
    et.addEventListener("click", openLi);
  }

  const createElement = (tag, id, innerText) => {
      const ele = document.createElement(tag);
      if(id) { ele.id = id; }
      if(innerText) { ele.innerText = innerText; }
      return ele;
  }

  const createModalHeader = () => {
    const header = createElement("div", "header", "Title");
    const close = createElement("div", "btnClose");
    header.appendChild(close);
    return header;
  }

  const createModalLabel = () => {
    return createElement("div", "label", "Label");
  }

  const createModalTree = () => {
    let ul = null;
    const arr = getParentWithNull();
    if (arr.length) {
      const items = arr.map(buildTreeLi);
      ul = createElement("ul", "ul-content");
      items.forEach((li) => { ul.appendChild(li) });
    }
    return ul;
  }

  const createModalFooter = () => {
    const footer = createElement("div", "footer");
    const link = createElement("div", "footer-link", "Link");
    const done = createElement("div", "footer-done", "Done");
    footer.appendChild(link);
    footer.appendChild(done);
    return footer;
  }

  const buildModal = () => {

    const root = createElement("div", "root");

    // header
    root.appendChild(createModalHeader());

    // label
    root.appendChild(createModalLabel());

    // tree 
    root.appendChild(createModalTree());

    // footer
    root.appendChild(createModalFooter())

    document.body.prepend(root);
  }
  return {
    render: buildModal
  }
};

const head = parse().start(document.head, true);
const body = parse().start(document.body, false);

tree([...head, ...body]).render();
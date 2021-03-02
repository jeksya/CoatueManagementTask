const parse = () => {

    let dict = {}; // private

    const isTypeFolder = (node)=> {
        return !(node instanceof Text) && node.nodeName !== "#text";
    }
    
    const isNodeElementOrText = node => {
        return (node instanceof Text || node instanceof Element) || (node instanceof HTMLScriptElement)
    }
    
    const getInnerText = (isFolder, node) => {
        return isFolder
        ? node.nodeName
        : node.data.trim();
    }
    
    const getClassName = (isFolder, isHead) => {
        let className = isFolder
            ? "folder"
            : "file";
    
        if(isFolder && isHead) {
            className = "red-folder";
        }
        return className;
    }
    
    const createNodeName = node => {
        let newName = node.id ? node.nodeName + "_" + node.id : node.nodeName;
        let namenum = newName;
        let count = 1;
        while (dict[namenum]) {
            namenum = newName + count;
            count++;
        }
        dict[namenum] = node;
        return namenum;
    }
    
    const parseDOM = (node, isHead, parentName, dataArray) => {
    
        parentName = parentName || null;
        dataArray = dataArray || [];
    
        if(isNodeElementOrText(node)) {

            const isFolder = isTypeFolder(node);
            const innerText = getInnerText(isFolder, node);
    
            if(innerText && innerText !== "") { // skip empty text

                let className = getClassName(isFolder, isHead);
                var name = createNodeName(node);
    
                dataArray.push({ id: name,
                    name: innerText,
                    className: className,
                    parent: parentName });
    
                node.childNodes.forEach((val, i) => {
                    parseDOM(node.childNodes[i], isHead, name, dataArray);
                });
            }
        }
        return dataArray;
    }

    return {
        start: parseDOM
    }
}

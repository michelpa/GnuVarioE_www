export function waitFor(conditionFunction) {
    const poll = resolve => {
        if (conditionFunction()) {
            resolve();
        } else {
            setTimeout(function () {
                poll(resolve);
            }, 30);
        }
    };

    return new Promise(poll);
}

export function triFichiers(tab) {
    tab.forEach(function (el) {
        if (el.type == 'dir' && el.contents.length) {
            triFichiers(el.contents);
        }
    });
    triParNom(tab);
    triParType(tab);
}

function triParNom(tab) {
    tab.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
}

function triParType(tab) {
    tab.sort(function (a, b) {
        return a.type.localeCompare(b.type);
    });
}
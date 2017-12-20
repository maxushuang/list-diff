/**
* list-diff
* compare aChildren with bChildren
* return moves(Array)
* otherwise return null
*
*/
export default function reorder(aChildren, bChildren, key = 'key') {
	const bChildIndex = keyIndex(bChildren);
	const bKeys = bChildIndex.keys;
    const bFree = bChildIndex.free;
    if (bFree.length === bChildren.length) {
    	return null;
    }

    const aChildIndex = keyIndex(aChildren);
    const aKeys = aChildIndex.keys;
    const aFree = aChildIndex.free;
    if (aFree.length === aChildren.length) {
    	return null;
    }

    // Care little thing and you will get more.
    const newChildren = [];

    for (let i = 0; i < aChildren.length; i ++) {
    	const aChild = aChildren[i];
    	const aKey = aChild[key];

    	if (aKey) {
    		if (bKeys.hasOwnProperty(aKey)) {
    			newChildren.push(bChildren[bKeys[aKey]]);
    		} else {
    			newChildren.push(null);
    		}
    	} else {
    		// un-keyed value in aChildren will be removed
    		newChildren.push(null);
    	}
    }

    // Don't need to forEach bChildren
    const simulate = newChildren.slice();
    let simulateIndex = 0;

    // All the operation in one array, by-index, one to one.
    const moves = [];

    for (let i = 0; i < bChildren.length;) {

    	const bChild = bChildren[i];
    	const bKey = bChild[key];
    	let simulateItem = simulate[simulateIndex];
    	if (simulateItem === undefined) {
    		moves.push(insert(simulate, simulateIndex, bChild));
    		simulateIndex ++;
    		i ++;
    		continue;
    	}

    	while (simulateItem === null) {
    		moves.push(remove(simulate, simulateIndex, undefined));
    		simulateItem = simulate[simulateIndex];
    	}

    	let simulateItemKey = simulateItem[key];

    	if (!bKey) {
    		moves.push(insert(simulate, simulateIndex, bChild));
    		simulateIndex ++;
    		i ++;
    	} else {
    		if (bKey !== simulateItemKey) {
    			if (bKeys[simulateItemKey] !== i + 1) {
    				moves.push(remove(simulate, simulateIndex, simulateItemKey));
    				simulateItem = simulate[simulateIndex];
    				if (simulateItem === undefined) {
    					moves.push(insert(simulate, simulateIndex, bChild));
    					i ++;
    					simulateIndex ++;
    					continue;
    				}
    				simulateItemKey = simulateItem[key];
    				if (simulateItemKey === bKey) {
    					i ++;
    					simulateIndex ++;
    				} else {
    					moves.push(insert(simulate, simulateIndex, bChild));
    					simulateIndex ++;
    					i ++;
    				}
    			} else {
    				moves.push(insert(simulate, simulateIndex, bChild));
    				simulateIndex ++;
    				i ++;
    			}
    		} else {
    			simulateIndex ++;
    			i ++;
    		}
    	}
    }
    while (simulateIndex < simulate.length) {
    	moves.push(remove(simulate, simulateIndex, undefined));
    }
    return moves;
}

function insert(arr, index, item) {
	arr.splice(index, 0, item);
	return {
		type: 'insert',
		index: index,
		item: item
	};
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
    	type: 'delete',
        index: index,
        key: key
    }
}

function keyIndex(children, key = 'key') {
	const free = [];
	const keys = {};
	for (let i = 0; i < children.length; i ++) {
		const child = children[i];
		const childKey = child[key];
		if (childKey !== undefined) {
			keys[childKey] = i;
		} else {
			free.push(child);
		}
	}
	return {
		keys,
		free
	};
}

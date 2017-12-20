/**
* list-diff
* compare aChildren with bChildren
* return moves(Array)
* otherwise return null
*
*/
function reorder(aChildren, bChildren, key = 'key') {
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

let one = [{a: 8}, {key: 1, aa: 1}, {key: 3, aa: 88}, {key: 2, aa: 8}];
let two = [{dd: 2}, {key: 2, aa: 8}, {key: 3, aa: 88}];

console.log('old:');
console.log(one);
console.log('new:');
console.log(two);
const now = 
const moves = reorder(one, two);
console.log('moves: ');
console.log(moves);

if (moves === null) {
	console.log("The old to the new is can't walk.");
	process.exit(0);
	return ;
}

for (let i = 0; i < moves.length; i++) {
	const move = moves[i];
	if (move.type === 'delete') {
		one.splice(move.index, 1);
	} else {
		one.splice(move.index, 0, move.item);
	}
}
for (let i = 0; i < one.length; i ++) {
	if (one[i].key !== two[i].key) {
		console.log('error');
		process.exit(0);
	}
}

console.log();
console.log('Test success.');
console.log();
const nodes = [{
  idnum: 'v0', name: 0,
}, {
  idnum: 'v1', name: 1,
}, {
  idnum: 'v2', name: 2,
}, {
  idnum: 'v3', name: 3,
}, {
  idnum: 'v4', name: 4,
}];

const relationsId = [{
  beginId: 'v0', endId: 'v3', weight: 1,
}, {
  beginId: 'v1', endId: 'v0', weight: 1,
}, {
  beginId: 'v1', endId: 'v2', weight: 2,
}, {
  beginId: 'v2', endId: 'v0', weight: 3,
}, {
  beginId: 'v2', endId: 'v1', weight: 4,
}];

const relationsIndex = [{
  beginIndex: 0, endIndex: 3, weight: 1,
}, {
  beginIndex: 1, endIndex: 0, weight: 1,
}, {
  beginIndex: 1, endIndex: 2, weight: 2,
}, {
  beginIndex: 2, endIndex: 0, weight: 3,
}, {
  beginIndex: 2, endIndex: 1, weight: 4,
}];

const matrixMin = [
  [0, Infinity, Infinity, 1],
  [1, 0, 2],
  [3, 4, 0],
];


const resultRelationsIndex = [{
  beginId: 0, endId: 3, weight: 1,
}, {
  beginId: 1, endId: 0, weight: 1,
}, {
  beginId: 1, endId: 2, weight: 2,
}, {
  beginId: 2, endId: 0, weight: 3,
}, {
  beginId: 2, endId: 1, weight: 4,
}];

const resultMatrix = [
  [0, Infinity, Infinity, 1, Infinity],
  [1, 0, 2, Infinity, Infinity],
  [3, 4, 0, Infinity, Infinity],
  [Infinity, Infinity, Infinity, 0, Infinity],
  [Infinity, Infinity, Infinity, Infinity, 0],
];

import {
  edgesetArray_adjacencyMatrix, adjacencyMatrix_edgesetArray, edgesetArray_orthogonalList, adjacencyMatrix_orthogonalList,
} from '../src/index';

test('edgesetArray_adjacencyMatrix id', () => {
  const { matrix: value } = edgesetArray_adjacencyMatrix(nodes, relationsId, { id: 'idnum' });
  expect(value).toEqual(resultMatrix);
});

test('edgesetArray_adjacencyMatrix index', () => {
  const { matrix: value } = edgesetArray_adjacencyMatrix(nodes, relationsIndex, { beginId: 'beginIndex', endId: 'endIndex' });
  expect(value).toEqual(resultMatrix);
});


test('adjacencyMatrix_edgesetArray id', () => {
  const { edges: value } = adjacencyMatrix_edgesetArray(nodes, matrixMin, { id: 'idnum' });
  expect(value).toEqual(relationsId);
});

test('adjacencyMatrix_edgesetArray index', () => {
  const { edges: value } = adjacencyMatrix_edgesetArray(nodes, matrixMin);
  expect(value).toEqual(resultRelationsIndex);
});


test('edgesetArray_orthogonalList id', () => {
  const value = edgesetArray_orthogonalList(nodes, relationsId, { id: 'idnum' });
  expect(value).not.toBeUndefined();
  expect(value).not.toBeUndefined();
});

test('edgesetArray_orthogonalList index', () => {
  const value = edgesetArray_orthogonalList(nodes, relationsIndex, { beginId: 'beginIndex', endId: 'endIndex' });
  expect(value).not.toBeUndefined();
  expect(value).not.toBeUndefined();
});


test('adjacencyMatrix_orthogonalList id', () => {
  const value = adjacencyMatrix_orthogonalList(nodes, matrixMin, { id: 'idnum' });
  expect(value).not.toBeUndefined();
  expect(value).not.toBeUndefined();
});

test('adjacencyMatrix_orthogonalList index', () => {
  const value = adjacencyMatrix_orthogonalList(nodes, matrixMin);
  expect(value).not.toBeUndefined();
  expect(value).not.toBeUndefined();
});

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
  beginIndex: '0', endIndex: '3', weight: 1,
}, {
  beginIndex: '1', endIndex: '0', weight: 1,
}, {
  beginIndex: '1', endIndex: '2', weight: 2,
}, {
  beginIndex: '2', endIndex: '0', weight: 3,
}, {
  beginIndex: '2', endIndex: '1', weight: 4,
}];

const matrix = [
  [0, Infinity, Infinity, 1],
  [1, 0, 2],
  [3, 4, 0],
  [Infinity, Infinity, Infinity, 0],
];

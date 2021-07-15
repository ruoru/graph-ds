class OrthogonalListVertice {
  constructor(info, firstin, firstout) {
    this.info = info;
    this.firstin = firstin;  // 入边表头指针，指向该顶点的入边表中第一个结点
    this.firstout = firstout;  // 出边表头指针，指向该顶点的出边表中的第一个结点
  }
}

class OrthogonalListEdge {
  constructor(info, tailvex, headvex, taillink, headlink, weight) {
    this.info = info;
    this.tailvex = tailvex;  // 是指弧起点在顶点表的下表
    this.headvex = headvex;  // 是指弧终点在顶点表的下标
    this.taillink = taillink;  // 是指边表指针域，指向起点相同的下一条边。
    this.headlink = headlink;  // 是指入边表指针域，指向终点相同的下一条边
    this.weight = weight;  // 如果是网，还可以增加一个weight域来存储权值。
  }
}

// vertices 数组里面顶点：index 是降级方案，优先使用 id，如果已经使用 index 方案，则一直使用 index 方案。
function isUseIndex(key = '', item = {}, status) {
  let result;
  try {
    result = !status && !(key in item);
  } catch (error) {
    result = true;
    console.error(`useIndex: ${error}`);
  }
  return result;
}

// 边数组转为邻接矩阵
export function edgesetArray_adjacencyMatrix(vertices, edges, keyMap = {}) {
  // 合并键值
  keyMap = Object.assign({ id: 'id', beginId: 'beginId', endId: 'endId', weight: 'weight' }, keyMap);

  // 如果 vertices 没有 id 则用 index
  const useIndex = isUseIndex(keyMap.id, vertices[0]);

  const verticesIdIndex = {};
  vertices.forEach((item, i) => {
    verticesIdIndex[useIndex ? i : item[keyMap.id]] = i;
  });

  // 初始化矩阵
  const maxMatrixLength = vertices.length || 0;
  const matrix = new Array(maxMatrixLength).fill(new Array(maxMatrixLength).fill(Infinity)).map((elements, i) => {
    return elements.map((item, j) => i === j ? 0 : item);
  });

  // 填充矩阵
  edges.forEach(item => {
    const beginIdIndex = verticesIdIndex[item[keyMap.beginId]];
    const endIdIndex = verticesIdIndex[item[keyMap.endId]];
    matrix[beginIdIndex][endIdIndex] = item[keyMap.weight];
  });

  return { vertices, matrix };
}

// 邻接矩阵转为边数组
export function adjacencyMatrix_edgesetArray(vertices, matrix, keyMap = {}) {
  // 合并键值
  keyMap = Object.assign({ id: 'id' }, keyMap);

  // 矩阵边长，防止不规则矩阵
  const maxMatrixLength = vertices.length || 0;

  // 如果 vertices 没有 id 则用 index
  const useIndex = isUseIndex(keyMap.id, vertices[0]);

  // 生成边
  const edges = [];
  for (let i = 0; i < maxMatrixLength; i++) {
    const beginId = useIndex ? i : vertices[i][keyMap.id];

    for (let j = 0; j < maxMatrixLength; j++) {
      const weight = (matrix[i] || [])[j];
      if (![0, Infinity, NaN, false, null, undefined, ''].includes(weight)) {
        edges.push({
          beginId,
          endId: useIndex ? j : vertices[j][keyMap.id],
          weight,
        })
      }
    }
  }

  return { vertices, edges };
}

// 边数组转为十字链表
export function edgesetArray_orthogonalList(vertices, edges, keyMap = {}) {
  // 合并键值
  keyMap = Object.assign({ id: 'id', beginId: 'beginId', endId: 'endId', weight: 'weight' }, keyMap);

  // 如果 vertices 没有 id 则用 index
  const useIndex = isUseIndex(keyMap.id, vertices[0]);

  // 实例化节点
  const verticesMap = new Map();
  vertices.forEach((item, i) => {
    verticesMap.set(useIndex ? i : item[keyMap.id], new OrthogonalListVertice(item, null, null));
  });

  const nextInMap = new Map();
  const nextOutMap = new Map();
  const invalidMap = new Map(); // 任意一个方向没有指向顶点的边

  edges.map((item, i) => {
    const currentBeginId = item[keyMap.beginId];
    const currentEndId = item[keyMap.endId];
    const currentEdge = new OrthogonalListEdge(item, verticesMap.get(currentBeginId), verticesMap.get(currentEndId), null, null, item[keyMap.weight]);

    // 出度邻接表
    if (nextOutMap.get(currentBeginId)) {
      nextOutMap.get(currentBeginId).taillink = currentEdge;
      nextOutMap.set(currentBeginId, currentEdge);
    } else if (verticesMap.get(currentBeginId)) {
      verticesMap.get(currentBeginId).firstout = currentEdge;
      nextOutMap.set(currentBeginId, currentEdge);
    } else {
      invalidMap.set(i, currentEdge);
    }

    // 入度邻接表
    if (nextInMap.get(currentEndId)) {
      nextInMap.get(currentEndId).headlink = currentEdge;
      nextInMap.set(currentEndId, currentEdge);
    } else if (verticesMap.get(currentEndId)) {
      verticesMap.get(currentEndId).firstin = currentEdge;
      nextInMap.set(currentEndId, currentEdge);
    } else {
      invalidMap.set(i, currentEdge);
    }
  });

  return verticesMap;
}

// 邻接矩阵转为十字链表
export function adjacencyMatrix_orthogonalList(vertices, matrix, keyMap) {
  // 合并键值
  keyMap = Object.assign({ id: 'id' }, keyMap);

  // 如果 vertices 没有 id 则用 index
  const useIndex = isUseIndex(keyMap.id, vertices[0]);

  // 实例化节点
  const verticesMap = new Map();
  vertices.forEach((item, i) => {
    verticesMap.set(useIndex ? i : item[keyMap.id], new OrthogonalListVertice(item, null, null));
  });

  const nextInMap = new Map();
  const nextOutMap = new Map();
  const invalidMap = new Map(); // 任意一个方向没有指向顶点的边

  for (let i = 0; i < matrix.length; i++) {
    const rowsItems = matrix[i];
    const currentBeginId = useIndex ? i : vertices[i][keyMap.id];

    for (let j = 0; j < rowsItems.length; j++) {
      const weight = rowsItems[j];

      // 不符合条件的跳出不执行
      if ([0, Infinity, null, undefined, ''].includes(weight)) {
        continue;
      }

      const currentEndId = useIndex ? j : vertices[j][keyMap.id];
      const currentEdge = new OrthogonalListEdge(weight, verticesMap.get(currentBeginId), verticesMap.get(currentEndId), null, null, weight);

      // 出度邻接表
      if (nextOutMap.get(currentBeginId)) {
        nextOutMap.get(currentBeginId).taillink = currentEdge;
        nextOutMap.set(currentBeginId, currentEdge);
      } else if (verticesMap.get(currentBeginId)) {
        verticesMap.get(currentBeginId).firstout = currentEdge;
        nextOutMap.set(currentBeginId, currentEdge);
      } else {
        invalidMap.set(`${i}-${j}`, currentEdge);
      }

      // 入度邻接表
      if (nextInMap.get(currentEndId)) {
        nextInMap.get(currentEndId).headlink = currentEdge;
        nextInMap.set(currentEndId, currentEdge);
      } else if (verticesMap.get(currentEndId)) {
        verticesMap.get(currentEndId).firstin = currentEdge;
        nextInMap.set(currentEndId, currentEdge);
      } else {
        invalidMap.set(`${i}-${j}`, currentEdge);
      }
    }
  }

  return verticesMap;
}

export default {
  edgesetArray_adjacencyMatrix,
  adjacencyMatrix_edgesetArray,
  edgesetArray_orthogonalList,
  adjacencyMatrix_orthogonalList,
}

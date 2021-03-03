import { Model, createKey } from '@blink-mind/core';

export function genEmptyModel() {
  const rootKey = createKey();

  return Model.create({
    rootTopicKey: rootKey,
    topics: [
      {
        key: rootKey,
        blocks: [{ type: 'CONTENT', data: 'MainTopic' }],
      },
    ],
  });
}

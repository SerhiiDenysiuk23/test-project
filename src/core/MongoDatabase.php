<?php

declare(strict_types=1);

namespace Vendor\Name\core;

use MongoDB\Client;
use MongoDB\Collection;
use MongoDB\BSON\ObjectId;

class MongoDatabase
{
    private Client $client;
    private string $dbName;

    public function __construct(string $uri = 'mongodb://127.0.0.1:27017', string $dbName = 'test')
    {
        $this->client = new Client($uri);
        $this->dbName = $dbName;
    }

    public function collection(string $collection): Collection
    {
        return $this->client
            ->selectDatabase($this->dbName)
            ->selectCollection($collection);
    }


    public function all(string $collection): array
    {
        // Повертаємо усі документи масивом
        return $this->collection($collection)
            ->find()
            ->toArray();
    }

    public function find(string $collection, string $id): ?array
    {
        $doc = $this->collection($collection)
            ->findOne(['_id' => new ObjectId($id)]);
        return $doc ? $doc->getArrayCopy() : null;
    }

    public function insert(string $collection, array $data): array
    {
        $result = $this->collection($collection)
            ->insertOne($data);
        $data['_id'] = (string)$result->getInsertedId();
        return $data;
    }

    public function update(string $collection, string $id, array $data): array
    {
        $this->collection($collection)
            ->updateOne(
                ['_id' => new ObjectId($id)],
                ['$set' => $data]
            );
        return $this->find($collection, $id) ?? [];
    }

    public function delete(string $collection, string $id): bool
    {
        $result = $this->collection($collection)
            ->deleteOne(['_id' => new ObjectId($id)]);
        return $result->getDeletedCount() > 0;
    }
}

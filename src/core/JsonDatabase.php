<?php

namespace Vendor\Name\core;

use Exception;

class JsonDatabase
{
    private string $path;
    private array $data;

    public function __construct(string $filename)
    {
        $this->path = __DIR__ . '/../data/' . $filename;
        if (!file_exists($this->path)) {
            file_put_contents($this->path, json_encode([
                'users' => [],
                'albums' => [],
                'photos' => []
            ], JSON_PRETTY_PRINT));
        }
        $this->data = json_decode(file_get_contents($this->path), true);
    }

    public function all(string $key): array
    {
        return $this->data[$key] ?? [];
    }

    public function find(string $key, string $id): ?array
    {
        foreach ($this->data[$key] as $item) {
            if ($item['id'] == $id) return $item;
        }
        return null;
    }

    public function insert(string $key, array $item): array
    {
        $this->data[$key][] = $item;
        $this->save();
        return $item;
    }

    public function update(string $key, string $id, array $fields): array
    {
        foreach ($this->data[$key] as &$item) {
            if ($item['id'] == $id) {
                $item = array_merge($item, $fields);
                $this->save();
                return $item;
            }
        }
        throw new Exception('Update error.');
    }

    public function delete(string $key, string $id): bool
    {
        $before = count($this->data[$key]);
        $this->data[$key] = array_filter($this->data[$key], fn($item) => $item['id'] != $id);
        $this->data[$key] = array_values($this->data[$key]);
        $this->save();
        return count($this->data[$key]) < $before;
    }

    private function save(): void
    {
        file_put_contents($this->path, json_encode($this->data, JSON_PRETTY_PRINT));
    }
}

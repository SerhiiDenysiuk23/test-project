<?php

namespace Vendor\Name\json_repositories;


use Vendor\Name\core\JsonDatabase;
use Vendor\Name\i_repositories\IAlbumRepository;
use Vendor\Name\models\Album;

class AlbumRepository implements IAlbumRepository
{
	private JsonDatabase $database;
	private const KEY = 'albums';

	public function __construct(JsonDatabase $db)
	{
		$this->database = $db;
	}

	public function getAll(): array
	{
		$raw = $this->database->all(self::KEY);
		return array_map(fn(array $item) => new Album($item), $raw);
	}

	public function getById($id): ?Album
	{
		$data = $this->database->find(self::KEY, $id);
		return new Album($data);
	}

	public function put($id, Album $data): Album
	{
		$data = $this->database->update(self::KEY, $id, $data->toArray());
		return new Album($data);
	}

	public function create(Album $data): Album
	{
		$data = $this->database->insert(self::KEY, $data->toArray());
		return new Album($data);
	}

	public function delete(string $id): bool
	{
		$data = $this->database->delete(self::KEY, $id);
		return $data;
	}
}

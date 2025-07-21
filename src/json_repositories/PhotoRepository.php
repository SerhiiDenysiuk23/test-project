<?php
namespace Vendor\Name\json_repositories;


use Vendor\Name\core\JsonDatabase;
use Vendor\Name\i_repositories\IPhotoRepository;
use Vendor\Name\models\Photo;

class PhotoRepository implements IPhotoRepository{

	private JsonDatabase $database;
	private const KEY = 'photos';

	public function __construct(JsonDatabase $db)
	{
		$this->database = $db;
	}

	public function getAll(): array {
        $raw = $this->database->all(self::KEY);
        return array_map(fn(array $item) => new Photo($item), $raw);
	}

	public function getById($id): ?Photo {
		$data = $this->database->find(self::KEY, $id);
		return $data;
	}

	public function put($id, $data): Photo {
		$data = $this->database->update(self::KEY, $id, $data);

		return new Photo($data);
	}

	public function create($data): Photo {
		$data = $this->database->insert(self::KEY, $data);
		return new Photo($data);
	}

	public function delete($id): bool {
		$data = $this->database->delete(self::KEY, $id);
		return $data;
	}
}
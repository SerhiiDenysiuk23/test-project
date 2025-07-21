<?php
namespace Vendor\Name\json_repositories;


use Vendor\Name\core\JsonDatabase;
use Vendor\Name\i_repositories\IUserRepository;
use Vendor\Name\models\User;

class UserRepositiry implements IUserRepository{

	private JsonDatabase $database;
	private const KEY = 'users';

	public function __construct(JsonDatabase $db)
	{
		$this->database = $db;
	}

	public function getAll(): array {
        $raw = $this->database->all(self::KEY);
        return array_map(fn(array $item) => new User($item), $raw);
	}

	public function getById($id): ?User {
		$data = $this->database->find(self::KEY, $id);
		return $data;
	}

	public function put($id, $data): User {
		$data = $this->database->update(self::KEY, $id, $data);

		return new User($data);
	}

	public function create($data): User {
		$data = $this->database->insert(self::KEY, $data);
		return new User($data);
	}

	public function delete($id): bool {
		$data = $this->database->delete(self::KEY, $id);
		return $data;
	}
}
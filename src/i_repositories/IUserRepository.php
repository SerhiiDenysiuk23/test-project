<?php
namespace Vendor\Name\i_repositories;

use Vendor\Name\models\User;

interface IUserRepository{
    public function getAll(): array;
    public function getById(string $id): ?User;
    public function put(string $id, $item): User;
    public function create($item): User;
    public function delete($item): bool;
}
<?php
namespace Vendor\Name\i_repositories;

use Vendor\Name\models\Photo;

interface IPhotoRepository{
    public function getAll(): array;
    public function getById(string $id): ?Photo;
    public function put(string $id, $item): Photo;
    public function create($item): Photo;
    public function delete($item): bool;
}
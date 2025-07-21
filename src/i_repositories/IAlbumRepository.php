<?php

namespace Vendor\Name\i_repositories;

use Vendor\Name\models\Album;

interface IAlbumRepository
{
    public function getAll(): array;
    public function getById(string $id): ?Album;
    public function put(string $id, Album $item): Album;
    public function create(Album $item): Album;
    public function delete(string $id): bool;
}

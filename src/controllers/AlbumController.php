<?php

namespace Vendor\Name\controllers;

use Exception;
use Vendor\Name\models\Album;
use Vendor\Name\i_repositories\IAlbumRepository;

class AlbumController
{
    public function __construct(private IAlbumRepository $repo) {}

    public function index(): void
    {
        $albums = $this->repo->getAll();
        http_response_code(200);
        echo json_encode($albums);
    }

    public function show(string $id): void
    {
        $album = $this->repo->getById($id);
        if ($album === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Album not found']);
        } else {
            echo json_encode($album);
        }
    }

    public function store(): void
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $album = $this->repo->create(new Album($data));
            http_response_code(201);
            echo json_encode($album);
        } catch (Exception $ex) {
            http_response_code(500);
            echo json_decode($ex);
        }
    }

    public function update(string $id): void
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $updated = $this->repo->put($id, new Album($data));
            echo json_encode($updated);
        } catch (Exception $ex) {
            http_response_code(500);
            echo json_decode($ex);
        }
    }

    public function destroy(string $id): void
    {
        $ok = $this->repo->delete($id);
        http_response_code($ok ? 204 : 404);
    }
}

<?php
namespace Vendor\Name\controllers;

use Vendor\Name\i_repositories\IPhotoRepository;
use Vendor\Name\models\Photo;

class PhotoController{
    public function __construct(private IPhotoRepository $repo) {}

    public function index(): void {
        $photos = $this->repo->getAll();
        http_response_code(200);
        echo json_encode($photos);
    }

    public function show(string $id): void {
        $photo = $this->repo->getById($id);
        if ($photo === null) {
            http_response_code(404);
            echo json_encode(['error'=>'photo$photo not found']);
        } else {
            echo json_encode($photo);
        }
    }

    public function store(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $photo = $this->repo->create(new Photo($data));
        http_response_code(201);
        echo json_encode($photo);
    }

    public function update(string $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $updated = $this->repo->put($id, new Photo($data));
        echo json_encode($updated);
    }

    public function destroy(string $id): void {
        $ok = $this->repo->delete($id);
        http_response_code($ok ? 204 : 404);
    }
}
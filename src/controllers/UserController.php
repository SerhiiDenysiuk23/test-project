<?php
namespace Vendor\Name\controllers;

use Vendor\Name\i_repositories\IUserRepository;
use Vendor\Name\models\User;

class UserController{
    public function __construct(private IUserRepository $repo) {}

    public function index(): void {
        $users = $this->repo->getAll();
        http_response_code(200);
        echo json_encode($users);
    }

    public function show(string $id): void {
        $user = $this->repo->getById($id);
        if ($user === null) {
            http_response_code(404);
            echo json_encode(['error'=>'user$user not found']);
        } else {
            echo json_encode($user);
        }
    }

    public function store(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $user = $this->repo->create(new User($data));
        http_response_code(201);
        echo json_encode($user);
    }

    public function update(string $id): void {
        $data = json_decode(file_get_contents('php://input'), true);
        $updated = $this->repo->put($id, new User($data));
        echo json_encode($updated);
    }

    public function destroy(string $id): void {
        $ok = $this->repo->delete($id);
        http_response_code($ok ? 204 : 404);
    }
}
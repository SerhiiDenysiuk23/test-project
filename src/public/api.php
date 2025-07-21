<?php

declare(strict_types=1);
require __DIR__ . '/../../vendor/autoload.php';


use Vendor\Name\core\Router;
use Vendor\Name\core\JsonDatabase;
use Vendor\Name\controllers\AlbumController;
use Vendor\Name\controllers\PhotoController;
use Vendor\Name\controllers\UserController;
use Vendor\Name\json_repositories\AlbumRepository;
use Vendor\Name\json_repositories\PhotoRepository;
use Vendor\Name\json_repositories\UserRepositiry;


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');


$db = new JsonDatabase('db.json');
$router = new Router();

$albumRepo = new AlbumRepository($db);
$albumController = new AlbumController($albumRepo);

$router->add('GET', '/albums', [$albumController, 'index']);
$router->add('GET', '/albums/{id}', [$albumController, 'show']);
$router->add('POST', '/albums', [$albumController, 'store']);
$router->add('PUT', '/albums/{id}', [$albumController, 'update']);
$router->add('DELETE', '/albums/{id}', [$albumController, 'destroy']);

$photoRepo = new PhotoRepository($db);
$photoController = new PhotoController($photoRepo);

$router->add('GET', '/photos', [$photoController, 'index']);
$router->add('GET', '/photos/{id}', [$photoController, 'show']);
$router->add('POST', '/photos', [$photoController, 'store']);
$router->add('PUT', '/photos/{id}', [$photoController, 'update']);
$router->add('DELETE', '/photos/{id}', [$photoController, 'destroy']);

$userRepo = new UserRepositiry($db);
$userController = new UserController($userRepo);

$router->add('GET', '/users', [$userController, 'index']);
$router->add('GET', '/users/{id}', [$userController, 'show']);
$router->add('POST', '/users', [$userController, 'store']);
$router->add('PUT', '/users/{id}', [$userController, 'update']);
$router->add('DELETE', '/users{id}', [$userController, 'destroy']);

$router->dispatch();

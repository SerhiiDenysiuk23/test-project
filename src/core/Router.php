<?php
namespace Vendor\Name\core;


class Router
{
    private array $routes = [];

    public function add(string $method, string $path, callable $handler): void {
        $this->routes[] = compact('method','path','handler');
    }

    public function dispatch(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        foreach ($this->routes as $route) {
            $pattern = "#^" . preg_replace('#\{[\w]+\}#','([^/]+)', $route['path']) . "$#";
            if ($method === $route['method'] && preg_match($pattern, $uri, $matches)) {
                array_shift($matches);
                call_user_func_array($route['handler'], $matches);
                return;
            }
        }
        http_response_code(404);
        echo json_encode(['error'=>'Not Found']);
    }
}